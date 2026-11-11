import { randomUUID } from "crypto";
import { logger } from "./logger";

export interface CreateOutboxEventParams<T = unknown> {
  eventName: string;
  aggregateType: string;
  aggregateId: string;
  data: T;
  correlationId?: string;
  idempotencyKey?: string;
}

export interface OutboxEventEnvelope<T = unknown> {
  id: string;
  event_name: string;
  aggregate_type: string;
  aggregate_id: string;
  payload: {
    metadata: {
      eventId: string;
      eventName: string;
      aggregateType: string;
      aggregateId: string;
      timestamp: string;
      version: 1;
      correlationId?: string;
      idempotencyKey?: string;
    };
    data: T;
  };
  status: "pending" | "processed" | "failed";
  retry_count: number;
  created_at: string;
}

/**
 * Factory untuk membuat rekaman Outbox yang mematuhi standar Event Envelope V3
 */
export function createOutboxEvent<T = unknown>(
  params: CreateOutboxEventParams<T>
): OutboxEventEnvelope<T> {
  const eventId = randomUUID();
  const timestamp = new Date().toISOString();

  return {
    id: eventId,
    event_name: params.eventName,
    aggregate_type: params.aggregateType,
    aggregate_id: params.aggregateId,
    payload: {
      metadata: {
        eventId,
        eventName: params.eventName,
        aggregateType: params.aggregateType,
        aggregateId: params.aggregateId,
        timestamp,
        version: 1,
        correlationId: params.correlationId,
        idempotencyKey: params.idempotencyKey,
      },
      data: params.data,
    },
    status: "pending",
    retry_count: 0,
    created_at: timestamp,
  };
}

/**
 * Menyimpan rekaman outbox ke pangkalan data Supabase
 */
export async function publishOutboxEvent(
  supabaseClient: any,
  event: OutboxEventEnvelope
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseClient.from("outbox_events").insert({
      id: event.id,
      event_name: event.event_name,
      aggregate_type: event.aggregate_type,
      aggregate_id: event.aggregate_id,
      payload: event.payload,
      status: "pending",
      retry_count: 0,
      created_at: event.created_at,
    });

    if (error) {
      logger.error("Gagal menerbitkan event ke tabel outbox_events", error, {
        eventName: event.event_name,
        aggregateId: event.aggregate_id,
        correlationId: event.payload.metadata.correlationId,
      });
      return { success: false, error: error.message };
    }

    logger.info("Event outbox berhasil diterbitkan", {
      eventName: event.event_name,
      aggregateId: event.aggregate_id,
      eventId: event.id,
      correlationId: event.payload.metadata.correlationId,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export type EventHandlerFn = (payload: any, metadata: any) => Promise<void>;

/**
 * Worker Processor: Memproses batch event berstatus 'pending' dari tabel outbox_events
 */
export async function processOutboxBatch(
  supabaseClient: any,
  handlers: Record<string, EventHandlerFn>,
  options: { batchSize?: number; maxRetries?: number } = {}
): Promise<{ processed: number; failed: number }> {
  const batchSize = options.batchSize || 10;
  const maxRetries = options.maxRetries || 3;

  const { data: events, error } = await supabaseClient
    .from("outbox_events")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(batchSize);

  if (error || !events || events.length === 0) {
    return { processed: 0, failed: 0 };
  }

  let processedCount = 0;
  let failedCount = 0;

  for (const event of events) {
    const handler = handlers[event.event_name];
    const metadata = event.payload?.metadata || {};
    const eventData = event.payload?.data || {};

    try {
      if (handler) {
        await handler(eventData, metadata);
      } else {
        logger.warn(`Tidak ada handler untuk event ${event.event_name}, menandai processed`, {
          eventId: event.id,
        });
      }

      await supabaseClient
        .from("outbox_events")
        .update({
          status: "processed",
          processed_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", event.id);

      processedCount++;
    } catch (err: any) {
      const nextRetry = (event.retry_count || 0) + 1;
      const isFinalFail = nextRetry >= maxRetries;

      await supabaseClient
        .from("outbox_events")
        .update({
          status: isFinalFail ? "failed" : "pending",
          retry_count: nextRetry,
          error_message: err.message || String(err),
        })
        .eq("id", event.id);

      failedCount++;
      logger.error(`Gagal memproses event ${event.event_name} (retry: ${nextRetry})`, err, {
        eventId: event.id,
      });
    }
  }

  return { processed: processedCount, failed: failedCount };
}

/**
 * Membersihkan event outbox yang telah sukses diproses ('processed') dan sudah melewati batas usia.
 * Mencegah pembengkakan penyimpanan tabel outbox_events di database PostgreSQL Supabase.
 */
export async function purgeProcessedOutboxEvents(
  supabaseClient: any,
  daysOld: number = 7
): Promise<number> {
  try {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseClient
      .from("outbox_events")
      .delete()
      .eq("status", "processed")
      .lt("created_at", cutoffDate)
      .select("id");

    if (error) {
      logger.warn("Gagal membersihkan outbox_events kedaluwarsa", { error: error.message });
      return 0;
    }

    const deletedCount = data?.length || 0;
    if (deletedCount > 0) {
      logger.info(`Berhasil memangkas ${deletedCount} event outbox kedaluwarsa (> ${daysOld} hari).`);
    }
    return deletedCount;
  } catch (err: any) {
    logger.warn("Kesalahan saat mengeksekusi purgeProcessedOutboxEvents", { error: err.message });
    return 0;
  }
}
