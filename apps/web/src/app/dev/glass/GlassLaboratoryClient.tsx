"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Gauge,
  Sliders,
  ShieldCheck,
  Eye,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import {
  GlassSurface,
  QuietSurface,
  SceneBackground,
  useQualityMode,
  useSpecularPointer,
  calcConcentricRadius,
  type QualityMode,
} from "@/components/glass";

export function GlassLaboratoryClient() {
  const { quality, setQualityMode, isAutoDetected, fps } = useQualityMode();

  // Test states
  const [parentRadius, setParentRadius] = useState<number>(32);
  const [padding, setPadding] = useState<number>(16);
  const [testBackground, setTestBackground] = useState<"scene" | "white" | "vibrant-pink" | "busy-pattern">("scene");
  const [scrimEnabled, setScrimEnabled] = useState<boolean>(true);
  const [stackedLayerCount, setStackedLayerCount] = useState<number>(1);

  const specularRef = useSpecularPointer<HTMLDivElement>();

  const childRadius = calcConcentricRadius(parentRadius, padding);

  return (
    <div className="min-h-screen bg-[#03031A] text-slate-100 flex flex-col font-sans relative">
      {/* 1. Dynamic Background Under Test */}
      {testBackground === "scene" && <SceneBackground intensity="normal" />}
      {testBackground === "white" && (
        <div aria-hidden="true" className="fixed inset-0 -z-50 bg-[#FFFFFF]" />
      )}
      {testBackground === "vibrant-pink" && (
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-50 bg-gradient-to-tr from-[#FF1752] via-[#FF4D77] to-[#D90F43]"
        />
      )}
      {testBackground === "busy-pattern" && (
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-50 bg-[repeating-linear-gradient(45deg,#FF1752,#FF1752_20px,#00004F_20px,#00004F_40px,#FFFFFF_40px,#FFFFFF_60px)]"
        />
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              Laboratorium Desain Liquid Glass 2026
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              /dev/glass · Alat Validasi Material, Kontras & FPS
            </p>
          </div>
        </div>

        {/* Quality Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono font-semibold text-emerald-300">{fps} FPS</span>
            {isAutoDetected && (
              <span className="text-[10px] text-slate-500 font-mono ml-1">(Otomatis)</span>
            )}
          </div>

          <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10 text-xs">
            {(["full", "standard", "eco"] as QualityMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setQualityMode(mode, true)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors font-medium ${
                  quality === mode
                    ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {mode === "full" ? "Penuh" : mode === "standard" ? "Standar" : "Hemat"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-10">
        {/* ========================================================= */}
        {/* MODUL 1: EMPAT MATERIAL KACA STANDAR                      */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-pink-500" /> 1. Empat Tingkat Material Kaca
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluasi blur, opasitas, rim light, dan specular highlight pada mode{" "}
                <span className="font-bold text-pink-400 capitalize">{quality}</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Thin */}
            <GlassSurface
              variant="thin"
              elevation="raised"
              interactive
              className="p-6 rounded-2xl"
            >
              <span className="text-xs font-mono text-pink-400 font-bold block mb-1">
                Material Thin (14px)
              </span>
              <h3 className="text-base font-bold text-white mb-2">Kontrol Mengambang</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Opasitas 5%, blur 14px. Dikhususkan untuk tombol sekunder, filter chips, dan pill navigasi.
              </p>
            </GlassSurface>

            {/* Regular */}
            <GlassSurface
              variant="regular"
              elevation="raised"
              interactive
              className="p-6 rounded-2xl"
            >
              <span className="text-xs font-mono text-pink-400 font-bold block mb-1">
                Material Regular (24px)
              </span>
              <h3 className="text-base font-bold text-white mb-2">Kartu Standar</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Opasitas 8%, blur 24px. Material standar untuk panggung kartu, kartu jelajah, dan modal sheet.
              </p>
            </GlassSurface>

            {/* Thick */}
            <GlassSurface
              variant="thick"
              elevation="floating"
              interactive
              className="p-6 rounded-2xl"
            >
              <span className="text-xs font-mono text-pink-400 font-bold block mb-1">
                Material Thick (40px)
              </span>
              <h3 className="text-base font-bold text-white mb-2">Navigasi Utama</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Opasitas 12%, blur 40px. Dikhususkan untuk GlassNav atas, tab bar mobile bawah, dan dialog.
              </p>
            </GlassSurface>

            {/* Tinted */}
            <GlassSurface
              variant="tinted"
              elevation="raised"
              interactive
              className="p-6 rounded-2xl"
            >
              <span className="text-xs font-mono text-pink-300 font-bold block mb-1">
                Material Tinted (Pink)
              </span>
              <h3 className="text-base font-bold text-white mb-2">Aksen Penting</h3>
              <p className="text-xs text-pink-100 leading-relaxed">
                Tint pink 16% + blur 24px. Dikhususkan untuk tombol aksi utama, notifikasi sukses, dan badge.
              </p>
            </GlassSurface>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MODUL 2: SPECULAR SPOTLIGHT & POINTER TRACKER            */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> 2. Specular Pointer Spotlight
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Arahkan kursor / sentuhan di atas permukaan ini untuk melihat specular sheen dinamis.
              </p>
            </div>
          </div>

          <div
            ref={specularRef}
            className="p-8 rounded-3xl glass-surface glass-specular border border-white/15 text-center space-y-3 cursor-crosshair transition-all"
          >
            <Sparkles className="w-8 h-8 text-pink-400 mx-auto animate-pulse" />
            <h3 className="text-xl font-bold text-white">Area Uji Specular Sheen Mengikuti Pointer</h3>
            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              Titik pantulan cahaya putih mengikuti pergerakan pointer secara mulus menggunakan variabel CSS
              <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-800 text-pink-400 font-mono">--mx</code>
              dan
              <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-800 text-pink-400 font-mono">--my</code>.
              Pada perangkat mobile, efek ini didukung oleh kemiringan gyroscope.
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MODUL 3: FORMULA RADIUS KONSENTRIS                       */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-400" /> 3. Formula Radius Konsentris Harmonik
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Formula matematis: <code className="font-mono text-pink-400 font-bold">R_anak = max(0, R_induk - Padding)</code>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Kontrol Slider */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 flex justify-between mb-1.5">
                  <span>Radius Induk (R_induk)</span>
                  <span className="font-mono text-pink-400">{parentRadius} px</span>
                </label>
                <input
                  type="range"
                  min="12"
                  max="48"
                  value={parentRadius}
                  onChange={(e) => setParentRadius(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 flex justify-between mb-1.5">
                  <span>Padding Kontainer (P)</span>
                  <span className="font-mono text-blue-400">{padding} px</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-white/10 text-xs text-slate-400 flex justify-between">
                <span>Hasil Radius Anak:</span>
                <span className="font-mono font-bold text-emerald-400">{childRadius} px</span>
              </div>
            </div>

            {/* Visualisasi Nesting */}
            <div className="lg:col-span-2 flex items-center justify-center p-8 bg-slate-950/40 rounded-3xl border border-white/5">
              <div
                style={{
                  borderRadius: `${parentRadius}px`,
                  padding: `${padding}px`,
                }}
                className="bg-slate-800/80 border-2 border-dashed border-pink-500/50 transition-all max-w-md w-full"
              >
                <div
                  style={{
                    borderRadius: `${childRadius}px`,
                  }}
                  className="p-6 bg-pink-500/20 border border-pink-400/40 text-center transition-all"
                >
                  <p className="text-xs font-mono text-pink-300 font-semibold">
                    Elemen Anak (R = {childRadius}px)
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Kurvatur anak presisi sejajar dengan kurvatur induk tanpa celah tak beraturan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MODUL 4: UJI KONTRAS LATAR TERBURUK (WCAG AA 4.5:1)      */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> 4. Uji Kontras pada Latar Terburuk
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulasi keterbacaan teks di atas berbagai variasi latar ekstrim dengan lapisan Scrim.
              </p>
            </div>

            {/* Switcher Latar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Latar:</span>
              <button
                onClick={() => setTestBackground("scene")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  testBackground === "scene" ? "bg-pink-600 text-white font-medium" : "bg-slate-900 text-slate-400"
                }`}
              >
                Navy Scene
              </button>
              <button
                onClick={() => setTestBackground("vibrant-pink")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  testBackground === "vibrant-pink" ? "bg-pink-600 text-white font-medium" : "bg-slate-900 text-slate-400"
                }`}
              >
                Pink Ekstrim
              </button>
              <button
                onClick={() => setTestBackground("white")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  testBackground === "white" ? "bg-pink-600 text-white font-medium" : "bg-slate-900 text-slate-400"
                }`}
              >
                Putih Terang
              </button>
              <button
                onClick={() => setTestBackground("busy-pattern")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  testBackground === "busy-pattern" ? "bg-pink-600 text-white font-medium" : "bg-slate-900 text-slate-400"
                }`}
              >
                Pola Garis Kontras
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kaca Kiri: Tanpa Scrim */}
            <GlassSurface
              variant="regular"
              scrim={false}
              className="p-6 rounded-2xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-rose-400 font-bold">Tanpa Scrim</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                  Rentan Silau
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">Teks Judul Tanpa Lapisan Kontras</h4>
              <p className="text-xs text-slate-200 leading-relaxed mb-3">
                Pada kondisi latar putih atau pola ramai, teks di atas kaca murni tanpa scrim berisiko gagal
                memenuhi rasio kontras 4.5:1.
              </p>
              <button className="px-3.5 py-1.5 rounded-lg bg-pink-600 text-white text-xs font-semibold">
                Tombol Uji
              </button>
            </GlassSurface>

            {/* Kaca Kanan: DILENGKAPI SCRIM (Standar V3) */}
            <GlassSurface
              variant="regular"
              scrim={true}
              className="p-6 rounded-2xl border border-white/25 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Dengan Scrim Penjamin (V3 Standard)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> WCAG AA Lulus
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">Teks Judul Terproteksi Penuh</h4>
              <p className="text-xs text-slate-200 leading-relaxed mb-3">
                Lapisan scrim `rgba(3, 3, 26, 0.45)` di bawah kaca menjamin rasio kontras teks selalu mencapai
                minimal 4.5:1 bahkan di atas latar putih murni atau gradien terang.
              </p>
              <button className="px-3.5 py-1.5 rounded-lg bg-pink-600 text-white text-xs font-semibold shadow-lg shadow-pink-600/30">
                Tombol Uji
              </button>
            </GlassSurface>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MODUL 5: ANGGARAN LAPISAN BLUR (MAX 2 LAPISAN)           */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" /> 5. Anggaran Lapisan Blur (Max 2 Lapisan)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aturan performa: Dilarang menumpuk lebih dari 2 lapisan backdrop-filter aktif per viewport.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Tumpukan:</span>
              <button
                onClick={() => setStackedLayerCount(1)}
                className={`px-3 py-1 rounded-lg text-xs font-mono ${
                  stackedLayerCount === 1 ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-400"
                }`}
              >
                1 Lapis (Aman)
              </button>
              <button
                onClick={() => setStackedLayerCount(2)}
                className={`px-3 py-1 rounded-lg text-xs font-mono ${
                  stackedLayerCount === 2 ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-400"
                }`}
              >
                2 Lapis (Batas Maksimal)
              </button>
              <button
                onClick={() => setStackedLayerCount(3)}
                className={`px-3 py-1 rounded-lg text-xs font-mono ${
                  stackedLayerCount === 3 ? "bg-rose-600 text-white" : "bg-slate-900 text-slate-400"
                }`}
              >
                3 Lapis (Pelanggaran Anggaran)
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Meteran Anggaran Lapisan:</span>
              <span
                className={`font-mono font-bold px-2.5 py-0.5 rounded ${
                  stackedLayerCount <= 2
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {stackedLayerCount} / 2 Lapisan Aktif
              </span>
            </div>

            {/* Visualisasi Lapisan Bertingkat */}
            <GlassSurface variant="thick" className="p-6 rounded-2xl border border-white/20">
              <p className="text-xs font-mono text-purple-400 mb-2 font-bold">Lapisan 1: Kontainer Induk (Thick 40px)</p>

              {stackedLayerCount >= 2 && (
                <GlassSurface variant="regular" className="p-4 rounded-xl border border-white/20 mt-3">
                  <p className="text-xs font-mono text-pink-400 mb-2 font-bold">
                    Lapisan 2: Komponen Anak (Regular 24px)
                  </p>

                  {stackedLayerCount >= 3 ? (
                    <GlassSurface variant="thin" className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 mt-3">
                      <p className="text-xs font-mono text-rose-300 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        Lapisan 3: Pelanggaran Anggaran! Gunakan QuietSurface di sini.
                      </p>
                    </GlassSurface>
                  ) : (
                    <QuietSurface className="p-3 rounded-lg mt-3">
                      <p className="text-xs font-mono text-emerald-300 font-semibold">
                        Gunakan QuietSurface untuk lapisan ketiga (Solid translusen tanpa blur GPU).
                      </p>
                    </QuietSurface>
                  )}
                </GlassSurface>
              )}
            </GlassSurface>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MODUL 6: QUIETSURFACE UNTUK TABEL & FORMULIR PANJANG     */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" /> 6. QuietSurface (Area Padat Data)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Permukaan tenang translusen solid tanpa blur, khusus tabel admin dan formulir panjang.
              </p>
            </div>
          </div>

          <QuietSurface className="space-y-4">
            <h3 className="text-base font-bold text-white">Contoh Tabel Data di Permukaan Tenang (QuietSurface)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3">ID Rute</th>
                    <th className="px-4 py-3">Nama Halaman</th>
                    <th className="px-4 py-3">Komponen</th>
                    <th className="px-4 py-3 text-center">Status Kontras</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-pink-400">/admin/verification</td>
                    <td className="px-4 py-2.5">Antrean Verifikasi</td>
                    <td className="px-4 py-2.5">QuietSurface Tabel</td>
                    <td className="px-4 py-2.5 text-center text-emerald-400 font-semibold">≥ 7.0:1 (AAA)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-pink-400">/admin/users</td>
                    <td className="px-4 py-2.5">Direktori Pengguna</td>
                    <td className="px-4 py-2.5">QuietSurface Tabel</td>
                    <td className="px-4 py-2.5 text-center text-emerald-400 font-semibold">≥ 7.0:1 (AAA)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-pink-400">/onboarding</td>
                    <td className="px-4 py-2.5">Formulir 7 Bidang</td>
                    <td className="px-4 py-2.5">QuietSurface Form</td>
                    <td className="px-4 py-2.5 text-center text-emerald-400 font-semibold">≥ 7.0:1 (AAA)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </QuietSurface>
        </section>
      </main>
    </div>
  );
}
