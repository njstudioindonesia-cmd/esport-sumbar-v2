"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Filter,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_NEWS, Article } from "@/data/mockNews";

export default function NewsIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "Semua Kategori" },
    { id: "Agenda Resmi ESI", label: "Agenda Resmi ESI" },
    { id: "Turnamen Daerah", label: "Turnamen Daerah" },
    { id: "Tata Kelola", label: "Tata Kelola & Edukasi" },
    { id: "Prestasi Klub", label: "Prestasi Klub & Atlet" },
  ];

  const filteredNews = useMemo(() => {
    return MOCK_NEWS.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const headline = filteredNews.find((n) => n.isHeadline) || filteredNews[0];
  const listItems = filteredNews.filter((n) => n.id !== headline?.id);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
            <span>Portal Media & Informasi Resmi</span>
            <span>•</span>
            <span>Sumatera Barat</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase text-white tracking-tight">
            Kabar Esport Ranah Minang
          </h1>
          <p className="text-sm text-[#9AA3B2] max-w-2xl leading-relaxed">
            Pusat publikasi berita kejuaraan daerah, agenda resmi Pengprov ESI Sumbar, prestasi atlet, dan perkembangan ekosistem esport 19 kabupaten/kota.
          </p>
        </div>

        {/* CONTROLS: CATEGORIES & SEARCH */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 p-4 rounded-xl bg-[#12151C] border border-[#262B38]">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[#D4AF37] text-black shadow-sm"
                    : "bg-[#1A1E28] text-gray-300 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik atau wilayah..."
              className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* HEADLINE ARTICLE */}
        {headline && (
          <div className="mb-10 rounded-2xl bg-[#12151C] border border-[#262B38] overflow-hidden group hover:border-[#D4AF37]/50 transition-colors grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative h-72 sm:h-96 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={headline.imageUrl}
                alt={headline.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12151C] via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#0B0D12]/90 border border-[#262B38] text-[10px] font-heading font-bold uppercase text-[#D4AF37] backdrop-blur-md">
                  {headline.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#0B0D12]/90 border border-[#262B38] text-[10px] font-mono text-gray-300 backdrop-blur-md">
                  {headline.region}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-[#9AA3B2] mb-3 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {headline.date}
                  </span>
                  <span>•</span>
                  <span>{headline.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {headline.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#9AA3B2] leading-relaxed mt-3">
                  {headline.excerpt}
                </p>
              </div>

              <Link
                href={`/news/${headline.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
              >
                <span>Baca Artikel Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ARTICLES GRID */}
        {listItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listItems.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="rounded-2xl bg-[#12151C] border border-[#262B38] overflow-hidden hover:border-[#D4AF37]/50 flex flex-col justify-between transition-all group hover:scale-[1.01]"
              >
                <div>
                  <div className="relative w-full h-48 overflow-hidden bg-[#161922]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#0B0D12]/90 border border-[#262B38] text-[9px] font-heading font-bold uppercase text-[#D4AF37] backdrop-blur-md">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[10px] text-[#9AA3B2] font-mono">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.region}</span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#9AA3B2] line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1 flex items-center justify-between text-xs font-heading font-bold text-[#D4AF37]">
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] text-xs text-[#9AA3B2]">
            Tidak ada artikel yang cocok dengan filter yang dipilih.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
