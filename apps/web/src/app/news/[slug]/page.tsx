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
  Award,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_NEWS, Article } from "@/data/mockNews";
import { getArticleBySlug, getLatestArticles } from "@/lib/services/news";
import { FLAGS } from "@/lib/config/flags";

export const instant = false;

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dbArticle = await getArticleBySlug(slug);
  const mockArticle = FLAGS.SHOW_DEMO_DATA
    ? MOCK_NEWS.find((n) => n.slug === slug)
    : null;

  if (!dbArticle && !mockArticle) {
    notFound();
  }

  const article = dbArticle
    ? {
        id: dbArticle.id,
        title: dbArticle.title,
        slug: dbArticle.slug,
        excerpt: dbArticle.summary || "",
        content: dbArticle.content ? [dbArticle.content] : [],
        category: dbArticle.category,
        region: dbArticle.regionName || "Sumatera Barat",
        author: dbArticle.authorName || "Tim Redaksi ESPORT SUMBAR",
        date: new Date(dbArticle.publishedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        readTime: "3 min baca",
        imageUrl: dbArticle.coverImageUrl || "/images/news-placeholder.jpg",
        coverImage: dbArticle.coverImageUrl || "/images/news-placeholder.jpg",
      }
    : mockArticle!;

  // Related articles
  const dbRelated = await getLatestArticles({ limit: 4 });
  const relatedArticles = dbRelated.length > 0
    ? dbRelated
        .filter((n) => n.slug !== article.slug)
        .slice(0, 3)
        .map((r) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          excerpt: r.summary || "",
          content: [r.content],
          category: r.category,
          region: r.regionName || "Sumatera Barat",
          author: "Tim Redaksi ESPORT SUMBAR",
          date: new Date(r.publishedAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          readTime: "3 min",
          imageUrl: r.coverImageUrl || "/images/news-placeholder.jpg",
        }))
    : (FLAGS.SHOW_DEMO_DATA
        ? MOCK_NEWS.filter((n) => n.slug !== article.slug).slice(0, 3)
        : []);

  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col select-none">
      <Navbar />

      <main className="flex-1 w-full mx-auto px-6 lg:px-12 py-10">
        {/* BREADCRUMB */}
        <div className="max-w-[680px] mx-auto flex items-center justify-between mb-6 text-xs text-white/40 font-mono">
          <Link
            href="/news"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Berita</span>
          </Link>

          <div className="flex items-center gap-2">
            <span>{article.category}</span>
            <span>•</span>
            <span>{article.region}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* HEADER ARTIKEL: KATEGORI, JUDUL, PENULIS & TANGGAL KECIL */}
        {/* ========================================================= */}
        <header className="max-w-[680px] mx-auto flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
              {article.category}
            </span>
            <span className="text-xs text-white/50 font-mono flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              {article.region}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white leading-tight">
            {article.title}
          </h1>

          {/* Penulis dan Tanggal Kecil + Tombol Bagikan */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs font-mono text-white/50">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-white">
                <User className="w-3 h-3 text-[#D4AF37]" />
                {article.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-white/40" />
                {article.date}
              </span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] font-mono">Bagikan</span>
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* GAMBAR HEADER LEBAR                                      */}
        {/* ========================================================= */}
        <div className="max-w-4xl mx-auto h-72 sm:h-[440px] rounded-3xl overflow-hidden mb-10 border border-white/[0.08] bg-[#0F1118] shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ========================================================= */}
        {/* KOLOM TEKS 680 PX DENGAN TIPOGRAFI NYAMAN (18/30)        */}
        {/* ========================================================= */}
        <article className="max-w-[680px] mx-auto text-[18px] leading-[30px] font-sans text-white/90 space-y-6">
          {article.excerpt && (
            <p className="text-xl font-heading font-bold text-white leading-relaxed text-[#D4AF37]/90">
              {article.excerpt}
            </p>
          )}

          {Array.isArray(article.content) ? (
            article.content.map((para, i) => (
              <p key={i} className="whitespace-pre-line leading-relaxed">
                {para}
              </p>
            ))
          ) : (
            <p className="whitespace-pre-line leading-relaxed">
              {article.content}
            </p>
          )}
        </article>

        {/* ========================================================= */}
        {/* BERITA TERKAIT (3 KOLOM)                                  */}
        {/* ========================================================= */}
        {relatedArticles.length > 0 && (
          <section className="max-w-5xl mx-auto mt-16 pt-10 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-black text-lg text-white uppercase tracking-wider">
                Berita Terkait
              </h2>
              <Link href="/news" className="text-xs font-mono text-[#D4AF37] hover:underline">
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group p-5 rounded-2xl bg-[#0F1118]/80 hover:bg-[#161A24] border border-white/[0.08] hover:border-[#D4AF37]/50 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-[#161A24]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-heading font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                  <div className="mt-4 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-white/40 flex items-center justify-between">
                    <span>{item.date}</span>
                    <span>{item.region}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
