import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Share2,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_NEWS, Article } from "@/data/mockNews";

export function generateStaticParams() {
  return MOCK_NEWS.map((n) => ({
    slug: n.slug,
  }));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = MOCK_NEWS.find((n) => n.slug === slug);

  if (!article) {
    notFound();
  }

  // Related articles
  const relatedArticles = MOCK_NEWS.filter((n) => n.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* BREADCRUMBS & BACK LINK */}
        <div className="flex items-center justify-between gap-4 mb-6 text-xs text-[#9AA3B2] font-mono">
          <Link
            href="/news"
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Berita</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <span>{article.category}</span>
            <span>•</span>
            <span>{article.region}</span>
          </div>
        </div>

        {/* ARTICLE HEADER */}
        <header className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1A1E28] border border-[#262B38] text-[10px] font-heading font-bold uppercase text-[#D4AF37]">
              {article.category}
            </span>
            <span className="text-xs text-[#9AA3B2] font-mono flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              {article.region}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white leading-tight">
            {article.title}
          </h1>

          {/* Meta Author & Published Date */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#262B38] text-xs text-[#9AA3B2] font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                {article.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </header>

        {/* FEATURED HERO IMAGE */}
        <div className="relative w-full h-64 sm:h-[420px] rounded-2xl overflow-hidden mb-10 border border-[#262B38] bg-[#161922]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* EDITORIAL CONTENT (65-75 chars optimal readability width) */}
        <article className="max-w-[70ch] mx-auto flex flex-col gap-5 text-gray-200 text-base sm:text-lg leading-relaxed font-sans pb-12 border-b border-[#262B38]">
          <p className="font-semibold text-lg sm:text-xl text-white leading-snug">
            {article.excerpt}
          </p>

          {article.content && article.content.length > 0 ? (
            article.content.map((para, idx) => (
              <p key={idx} className="text-[#D1D5DB] leading-relaxed">
                {para}
              </p>
            ))
          ) : (
            <p className="text-[#D1D5DB] leading-relaxed">
              Liputan lengkap mengenai perkembangan ekosistem esport dan verifikasi kelembagaan resmi di Sumatera Barat.
            </p>
          )}

          {/* Institutional note */}
          <div className="mt-6 p-4 rounded-xl bg-[#12151C] border border-[#262B38] text-xs text-[#9AA3B2] flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>
              Publikasi resmi portal media <strong>ESPORT SUMBAR</strong> bekerjasama dengan Pengurus Provinsi ESI Sumatera Barat.
            </span>
          </div>
        </article>

        {/* RELATED ARTICLES */}
        <section className="pt-10">
          <h3 className="font-heading font-bold text-lg uppercase text-white tracking-wider mb-6">
            Berita Terkait Lainnya
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/news/${rel.slug}`}
                className="rounded-xl bg-[#12151C] border border-[#262B38] hover:border-[#D4AF37]/50 p-4 flex flex-col justify-between gap-3 group transition-colors"
              >
                <div>
                  <span className="text-[9px] font-heading font-bold uppercase text-[#D4AF37]">
                    {rel.category}
                  </span>
                  <h4 className="font-heading font-bold text-xs text-white group-hover:text-[#D4AF37] line-clamp-2 mt-1">
                    {rel.title}
                  </h4>
                </div>
                <span className="text-[10px] text-[#9AA3B2] font-mono">
                  {rel.date} • {rel.region}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
