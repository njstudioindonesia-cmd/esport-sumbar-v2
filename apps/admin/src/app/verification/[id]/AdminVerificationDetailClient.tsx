"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  AlertOctagon,
  FileText,
  Send,
  User,
  Gamepad2,
  MapPin,
  ExternalLink,
  Lock,
} from "lucide-react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer, QuietSurface, StatusBadge } from "@esport-sumbar/ui";
import { copy } from "@esport-sumbar/lib";
import { getVerificationDetailAction, transitionVerificationAction } from "@/app/actions/verification";

interface VerificationDetail {
  id: string;
  profileId: string;
  accountId: string;
  name: string;
  ign: string;
  esportId: string;
  type: string;
  game: string;
  region: string;
  status: string;
  submittedAtIso: string;
  notes: string;
  documents: {
    type: string;
    title: string;
    url: string;
    fileSize: string;
  }[];
  attributes: Record<string, any>;
}

export function AdminVerificationDetailClient({
  id,
  initialItem,
  initialAdminId,
}: {
  id: string;
  initialItem?: VerificationDetail;
  initialAdminId?: string;
}) {
  const router = useRouter();

  const [item, setItem] = useState<VerificationDetail | null>(initialItem || null);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(initialAdminId || null);
  const [isLoading, setIsLoading] = useState(!initialItem);
  const [decision, setDecision] = useState<"verified" | "revision_requested" | "rejected" | "suspended">("verified");
  const [reason, setReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      setIsLoading(true);
      try {
        const res = await getVerificationDetailAction(id);
        if (res.success && res.item) {
          if (res.currentAdminId) setCurrentAdminId(res.currentAdminId);
          setItem(res.item as any);
        } else {
          setItem(null);
        }
      } catch (err) {
        console.error("Gagal memuat detail verifikasi:", err);
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const isOwnAccount = Boolean(currentAdminId && item && currentAdminId === item.accountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOwnAccount) {
      setFeedback({
        type: "error",
        text: "Pelanggaran Aturan: Admin tidak dapat memverifikasi atau memutuskan pengajuan akun sendiri.",
      });
      return;
    }

    if (decision !== "verified" && !reason.trim()) {
      setFeedback({
        type: "error",
        text: "Alasan keputusan wajib diisi untuk penolakan atau permintaan revisi.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await transitionVerificationAction({
        requestId: item?.id || id,
        newStatus: decision,
        reason,
        notes: adminNotes,
      });

      if (!res.success) {
        throw new Error(res.error || "Gagal menyimpan keputusan verifikasi.");
      }

      setFeedback({
        type: "success",
        text: "Keputusan verifikasi berhasil dicatat dalam audit trail append-only.",
      });

      setTimeout(() => {
        router.push("/verification");
      }, 1500);
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.message || "Terjadi kendala saat memproses verifikasi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        <div className="mb-2 flex items-center justify-between border-b border-white/[0.08] pb-4">
          <Link
            href="/verification"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Antrean Verifikasi
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded bg-[#0C0C26] text-white/70 font-mono border border-white/[0.08]">
              ID: {id}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-3 text-pink-500" />
            <p>Memuat berkas pengajuan verifikasi...</p>
          </div>
        ) : !item ? (
          <div className="p-8 bg-slate-900/50 rounded-2xl border border-white/10 text-center text-slate-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <p>Data pengajuan verifikasi tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profil & Berkas (2 Kolom) */}
            <div className="lg:col-span-2 space-y-6">
              <QuietSurface radius="2xl" elevation="raised" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                      {item.name}
                      <span className="text-xs font-mono text-pink-400 font-normal">
                        ({item.ign})
                      </span>
                    </h1>
                    <p className="text-xs text-slate-400 font-mono">{item.esportId}</p>
                  </div>
                  <StatusBadge
                    status={
                      item.status === "verified"
                        ? "verified"
                        : item.status === "suspended"
                        ? "suspended"
                        : "under_review"
                    }
                    size="sm"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">Entitas</span>
                    <span className="font-semibold text-slate-200 capitalize">{item.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Divisi Game</span>
                    <span className="font-semibold text-slate-200">{item.game || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Wilayah</span>
                    <span className="font-semibold text-slate-200">{item.region || "Sumatera Barat"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Waktu Pengajuan</span>
                    <span className="text-slate-300">
                      {new Date(item.submittedAtIso).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </QuietSurface>

              {/* Berkas Bukti Digital */}
              <QuietSurface radius="2xl" elevation="raised" className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-pink-400" />
                  Berkas Bukti Verifikasi (URL Bertanda Tangan 60 Detik)
                </h2>

                <div className="space-y-3">
                  {item.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{doc.title}</p>
                          <p className="text-xs text-slate-400">
                            {doc.type} · {doc.fileSize}
                          </p>
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 transition-colors"
                      >
                        Buka Dokumen <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  ))}
                </div>
              </QuietSurface>
            </div>

            {/* Panel Keputusan Admin (1 Kolom) */}
            <div className="space-y-6">
              <QuietSurface radius="2xl" elevation="raised" className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Keputusan Verifikasi
                </h2>

                {isOwnAccount ? (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed flex items-start gap-2.5">
                    <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Akses Dibatasi</p>
                      <p>
                        Akun ini teridentifikasi milik Anda sendiri. Sesuai prinsip integritas V3, Anda tidak dapat memverifikasi atau merevisi pengajuan akun Anda sendiri.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Tindakan
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDecision("verified")}
                          className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                            decision === "verified"
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                              : "bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                        </button>

                        <button
                          type="button"
                          onClick={() => setDecision("revision_requested")}
                          className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                            decision === "revision_requested"
                              ? "bg-amber-500/20 border-amber-500 text-amber-300"
                              : "bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10"
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Minta Revisi
                        </button>

                        <button
                          type="button"
                          onClick={() => setDecision("rejected")}
                          className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                            decision === "rejected"
                              ? "bg-rose-500/20 border-rose-500 text-rose-300"
                              : "bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10"
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Tolak
                        </button>

                        <button
                          type="button"
                          onClick={() => setDecision("suspended")}
                          className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                            decision === "suspended"
                              ? "bg-purple-500/20 border-purple-500 text-purple-300"
                              : "bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10"
                          }`}
                        >
                          <AlertOctagon className="w-3.5 h-3.5" /> Tangguhkan
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Alasan Keputusan {decision !== "verified" && <span className="text-rose-400">*</span>}
                      </label>
                      <textarea
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={
                          decision === "verified"
                            ? "Catatan persetujuan (opsional)"
                            : "Jelaskan alasan atau instruksi revisi dokumen..."
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Catatan Internal Admin (Opsional)
                      </label>
                      <textarea
                        rows={2}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Hanya dapat dilihat oleh admin..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
                      />
                    </div>

                    {feedback && (
                      <div
                        className={`p-3 rounded-xl text-xs ${
                          feedback.type === "success"
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                            : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                        }`}
                      >
                        {feedback.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-pink-600/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" /> Menyimpan Keputusan...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Konfirmasi Keputusan
                        </>
                      )}
                    </button>
                  </form>
                )}
              </QuietSurface>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
