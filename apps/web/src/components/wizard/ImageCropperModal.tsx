"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  AlertCircle,
  Loader2,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import {
  validateRawImageFile,
  loadFileAsImage,
  cropAndCompressToWebP,
  getAspectRatioValue,
  type AspectRatioType,
} from "@/lib/media/client-image";
import { uploadAvatarAction } from "@/app/actions/upload";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  aspectRatioType: AspectRatioType;
  entityName?: string;
  onUploadSuccess: (url: string, path?: string) => void;
}

export function ImageCropperModal({
  isOpen,
  onClose,
  aspectRatioType,
  entityName = "Profil",
  onUploadSuccess,
}: ImageCropperModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  // Pan & Zoom State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Upload & Error States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetAspect = getAspectRatioValue(aspectRatioType);

  // Reset state saat modal dibuka/ditutup
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setLoadedImage(null);
      setPreviewSrc(null);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setIsProcessing(false);
      setUploadProgress(0);
      setErrorMessage(null);
    }
  }, [isOpen]);

  // Handler pemilihan berkas gambar
  const handleFileSelected = async (file: File) => {
    setErrorMessage(null);
    const validation = validateRawImageFile(file);
    if (!validation.ok) {
      setErrorMessage(validation.error || "Berkas tidak valid.");
      return;
    }

    try {
      setSelectedFile(file);
      const img = await loadFileAsImage(file);
      setLoadedImage(img);
      setPreviewSrc(img.src);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat berkas gambar.";
      setErrorMessage(msg);
    }
  };

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Pan Gestures (Pointer / Mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!loadedImage) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  // Reset Pan & Zoom
  const handleResetCrop = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Proses Crop & Eksekusi Upload Sisi Server
  const handleConfirmAndUpload = async () => {
    if (!loadedImage || !selectedFile) return;

    setIsProcessing(true);
    setUploadProgress(15);
    setErrorMessage(null);

    try {
      // 1. Hitung area crop berdasarkan posisi zoom & pan relatif terhadap naturalWidth
      const imgNaturalW = loadedImage.naturalWidth;
      const imgNaturalH = loadedImage.naturalHeight;

      // Aspek rasio alami vs target
      const containerW = 320;
      const containerH = 320 / targetAspect;

      // Rasio skala tampilan ke dimensi asli
      const baseScale = Math.max(containerW / imgNaturalW, containerH / imgNaturalH);
      const effectiveScale = baseScale * zoom;

      // Koordinat crop di dimensi gambar asli
      const visibleW = containerW / effectiveScale;
      const visibleH = containerH / effectiveScale;

      const sourceX = Math.max(0, (imgNaturalW - visibleW) / 2 - pan.x / effectiveScale);
      const sourceY = Math.max(0, (imgNaturalH - visibleH) / 2 - pan.y / effectiveScale);
      const sourceWidth = Math.min(imgNaturalW - sourceX, visibleW);
      const sourceHeight = Math.min(imgNaturalH - sourceY, visibleH);

      setUploadProgress(40);

      // 2. Client-side crop & WebP export (Resize max 1200px, quality 82%, EXIF stripped)
      const { blob } = await cropAndCompressToWebP(
        loadedImage,
        {
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
        },
        targetAspect,
        0.82
      );

      setUploadProgress(65);

      // 3. Susun FormData untuk Server Action
      const formData = new FormData();
      formData.append(
        "file",
        new File([blob], "avatar.webp", { type: "image/webp" })
      );
      formData.append("kind", aspectRatioType === "cover" ? "cover" : "avatar");

      setUploadProgress(80);

      // 4. Panggil uploadAvatarAction
      const result = await uploadAvatarAction(formData);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Gagal mengunggah foto ke server penyimpanan.");
      }

      setUploadProgress(100);

      // Callback sukses ke komponen wizard
      onUploadSuccess(result.url, result.path);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kegagalan saat memproses foto.";
      setErrorMessage(msg);
      setUploadProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[#0F121C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <h3 className="text-base font-heading font-black text-white">
                {aspectRatioType === "cover"
                  ? "Atur Foto Sampul"
                  : aspectRatioType === "logo"
                  ? "Atur Logo Resmi"
                  : "Atur Foto Profil"}
              </h3>
              <p className="text-[11px] font-mono text-white/50">
                {aspectRatioType === "avatar"
                  ? "Rasio Paspor 4:5 • Otomatis Tanpa EXIF"
                  : aspectRatioType === "cover"
                  ? "Rasio Sampul 16:9 • Maksimal 2 MB"
                  : "Rasio Logo 1:1 • Format WebP"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 flex flex-col items-center">
            {/* Error Message Banner */}
            {errorMessage && (
              <div className="w-full mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!loadedImage ? (
              /* State 1: Dropzone Pemilihan Berkas */
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="w-full py-10 px-6 border-2 border-dashed border-white/15 hover:border-[#D4AF37]/60 rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-heading font-bold text-white mb-1">
                  Pilih Foto atau Tarik ke Sini
                </span>
                <span className="text-xs text-white/40 mb-4 max-w-xs">
                  Format JPG, PNG, WebP (Maks. 8 MB). Akan dikompresi otomatis $\le 2$ MB.
                </span>

                {/* Tombol Kamera (Mobile) & Galeri */}
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="sm:hidden px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/10 hover:border-white/20 text-xs font-mono text-white flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-[#D4AF37]" />
                    <span>Kamera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] text-xs font-heading font-bold flex items-center gap-2 shadow-lg"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Pilih dari Galeri</span>
                  </button>
                </div>

                {/* Hidden Native File Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />
              </div>
            ) : (
              /* State 2: Interactive Cropper Canvas */
              <div className="w-full flex flex-col items-center">
                {/* Viewport Frame dengan Aspect Ratio */}
                <div
                  ref={containerRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="relative w-full max-w-[320px] rounded-2xl overflow-hidden bg-black/60 border border-white/20 shadow-2xl select-none cursor-grab active:cursor-grabbing touch-none"
                  style={{
                    aspectRatio: `${targetAspect}`,
                  }}
                >
                  {/* Foto yang Digeser dan Di-Zoom */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewSrc || ""}
                    alt="Pratinjau Crop"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover origin-center pointer-events-none transition-transform duration-75"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    }}
                  />

                  {/* Guide Grid Garis Rule of Thirds */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/20">
                    <div className="border-r border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-b border-white/10" />
                    <div className="border-r border-white/10" />
                    <div className="border-r border-white/10" />
                    <div />
                  </div>

                  {/* Badge Rasio */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-mono text-[#D4AF37]">
                    {aspectRatioType === "avatar"
                      ? "4:5 Paspor"
                      : aspectRatioType === "cover"
                      ? "16:9 Sampul"
                      : "1:1 Persegi"}
                  </div>
                </div>

                {/* Kontrol Zoom & Reset */}
                <div className="w-full max-w-[320px] mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <ZoomOut className="w-4 h-4 text-white/40" />
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.05}
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      disabled={isProcessing}
                      className="w-full accent-[#D4AF37] cursor-pointer"
                    />
                    <ZoomIn className="w-4 h-4 text-white/40" />
                  </div>

                  <button
                    type="button"
                    onClick={handleResetCrop}
                    disabled={isProcessing}
                    className="p-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-white/60 hover:text-white transition-colors"
                    title="Reset Posisi"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Upload Progress Bar */}
                {isProcessing && (
                  <div className="w-full max-w-[320px] mt-4 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-white/70">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                        Mengompres &amp; Mengunggah...
                      </span>
                      <span className="text-[#D4AF37] font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F3E5AB]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0A0C13] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white transition-colors"
            >
              Batal
            </button>

            {loadedImage ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoadedImage(null);
                    setSelectedFile(null);
                    setPreviewSrc(null);
                  }}
                  disabled={isProcessing}
                  className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70 hover:text-white transition-colors"
                >
                  Ganti Foto
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAndUpload}
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] text-xs font-heading font-black uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Terapkan</span>
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
