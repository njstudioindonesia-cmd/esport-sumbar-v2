import { z } from "zod";

export const SystemVersionSchema = z.object({
  minVersion: z.string(),
  latestVersion: z.string(),
  forceUpdate: z.boolean(),
  maintenance: z.boolean(),
  maintenanceMessage: z.string().optional(),
  storeUrl: z.object({
    android: z.string().url().optional(),
    ios: z.string().url().optional(),
  }).optional(),
});
export type SystemVersion = z.infer<typeof SystemVersionSchema>;

export const ServiceHealthSchema = z.object({
  status: z.enum(["UP", "DOWN", "DEGRADED"]),
  timestamp: z.string().datetime(),
  version: z.string(),
  services: z.record(z.string(), z.object({
    status: z.enum(["UP", "DOWN", "DEGRADED"]),
    latencyMs: z.number().optional(),
    message: z.string().optional(),
  })),
});
export type ServiceHealth = z.infer<typeof ServiceHealthSchema>;

export const ApiV1EnvelopeSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }).nullable(),
    meta: z.object({
      correlationId: z.string().optional(),
      page: z.number().optional(),
      pageSize: z.number().optional(),
      hasMore: z.boolean().optional(),
    }).optional(),
  });
