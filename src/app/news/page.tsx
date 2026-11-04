"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_NEWS, Article } from "@/data/mockNews";

export default function NewsIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiArticles, setApiArticles] = useState<Article[] | null>(null);

  React.useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news?limit=30");
        if (res.ok) {
          const json = await res.json();
          if (json.articles && json.articles.length > 0) {
            setApiArticles(
              json.articles.map((a: any, idx: number) => ({
                id: a.id,
                title: a.title,
                slug: a.slug,
                excerpt: a.summary || a.content.slice(0, 150) + "...",
                content: a.content,
                category: a.category,
                region: a.regionName || "Sumatera Barat",
                author: a.authorName || "Humas ESI",
                date: new Date(a.publishedAt).toLocaleDateString("id-ID"),
                readTime: "3 min baca",
                coverImage: a.coverImageUrl || undefined,
                isHeadline: idx === 0,
              }))
            );
          }
        }
      } catch {
        // Fallback to MOCK_NEWS
      }
    }
    loadNews();
  }, []);

  const activeCatalog = apiArticles || MOCK_NEWS;

  const categories = [
    { id: "all", label: "Semua Kategori" },
    { id: "Agenda Resmi ESI", label: "Agenda PBESI" },
    { id: "Turnamen Daerah", label: "Turnamen" },
    { id: "Tata Kelola", label: "Tata Kelola" },
    { id: "Prestasi Klub", label: "Prestasi" },
  ];

  const regions = [
    { id: "all", label: "Semua Wilayah" },
    { id: "Sumatera Barat", label: "Sumbar" },
    { id: "Kota Padang", label: "Padang" },
    { id: "Kota Bukittinggi", label: "Bukittinggi" },
    { id: "Kota Payakumbuh", label: "Payakumbuh" },
  ];

  const filteredNews = useMemo(() => {
    return activeCatalog.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchReg =
        selectedRegion === "all" || item.region === selectedRegion;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCat && matchReg && matchSearch;
    });
  }, [selectedCategory, selectedRegion, searchQuery]);

  const headline = filteredNews.find((n) => n.isHeadline) || filteredNews[0];
  const listItems = filteredNews.filter((n) => n.id !== headline?.id);

  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col select-none">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10">
        {/* Header bar */}
        <div className="flex flex-col gap-1.5 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Warta Resmi PBESI Sumatera Barat</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-heading font-black text-white tracking-tight uppercase">
            Berita &amp; Agenda
          </h1>
        </div>

        {/* Filter Chips Bar (Kategori & Wilayah Berupa Chip) */}
        <div className="p-4 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Chips */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#D4AF37] text-[#07080C] shadow-sm"
                    : "bg-[#161A24] text-white/60 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}

            <div className="h-4 w-px bg-white/10 hidden sm:block mx-1" />

            {/* Region Chips */}
            {regions.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition-all ${
                  selectedRegion === reg.id
                    ? "bg-[#4C7DFF] text-white font-bold"
                    : "bg-[#161A24] text-white/50 hover:text-white"
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-56">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berita..."
              className="w-full h-9 bg-[#161A24] border border-white/[0.08] rounded-xl pl-8 pr-3 text-xs text-white placeholder-white/30 outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. ARTIKEL UTAMA SINEMATIK LEBAR PENUH                    */}
        {/* ========================================================= */}
        {headline && (
          <Link
            href={`/news/${headline.slug}`}
            className="group relative block w-full h-[360px] sm:h-[460px] rounded-3xl overflow-hidden border border-white/[0.08] hover:border-[#D4AF37]/50 shadow-2xl mb-12 transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={headline.imageUrl}
              alt={headline.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07080C]/80 via-transparent to-transparent" />

            {/* Content Over Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 flex flex-col justify-end max-w-4xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#07080C] text-[10px] font-heading font-black uppercase tracking-wider">
                  UTAMA
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-[#D4AF37] backdrop-blur-md">
                  {headline.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-white/60 backdrop-blur-md">
                  {headline.region}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-heading font-black text-white group-hover:text-[#D4AF37] transition-colors leading-tight line-clamp-2">
                {headline.title}
              </h2>

              <div className="mt-4 flex items-center gap-4 text-xs font-mono text-white/50">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {headline.date}
                </span>
                <span>•</span>
                <span>{headline.readTime}</span>
              </div>
            </div>
          </Link>
        )}

        {/* ========================================================= */}
        {/* 2. GRID 3 KOLOM KARTU BERITA                              */}
        {/* (GAMBAR, KATEGORI CHIP, JUDUL 2 BARIS, TANGGAL)          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listItems.map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.slug}`}
              className="group p-5 rounded-3xl bg-[#0F1118]/80 hover:bg-[#161A24] border border-white/[0.08] hover:border-[#D4AF37]/50 flex flex-col justify-between transition-all shadow-xl"
            >
              <div>
                {/* Gambar */}
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/[0.06] mb-4 bg-[#161A24]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Chip Kategori */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#07080C]/80 border border-white/10 text-[9px] font-mono text-[#D4AF37] font-bold backdrop-blur-md">
                    {news.category}
                  </span>
                </div>

                {/* Judul 2 Baris */}
                <h3 className="text-base font-heading font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
                  {news.title}
                </h3>
              </div>

              {/* Tanggal & Wilayah */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>{news.date}</span>
                <span className="text-white/60">{news.region}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
