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
import { QuietSurface } from "@/components/glass/QuietSurface";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";

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
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* BREADCRUMB */}
        <div className="flex items-center justify-between mb-6 text-xs text-white/50 font-mono">
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

        {/* HEADER ARTIKEL: KATEGORI, JUDUL, PENULIS & TANGGAL */}
        <header className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF1752]/20 border border-[#FF1752]/40 text-[10px] font-mono text-pink-300 font-bold uppercase">
              {article.category}
            </span>
            <span className="text-xs text-white/50 font-mono flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#FF1752]" />
              {article.region}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black text-white leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08] text-xs font-mono text-white/50">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-white">
                <User className="w-3 h-3 text-[#FF1752]" />
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
          </div>
        </header>

        {/* GAMBAR HEADER UTAMA */}
        <div className="w-full h-64 sm:h-[420px] rounded-3xl overflow-hidden mb-10 border border-white/10 bg-black/40 shadow-2xl relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* AREA BACA TENANG (QUIET SURFACE UNTUK KETERBACAAN TEKS MAKSIMAL) */}
        <QuietSurface
          elevation="raised"
          radius="3xl"
          className="w-full p-6 sm:p-10 lg:p-12 mb-12 border-white/10 shadow-xl"
        >
          <article className="max-w-[700px] mx-auto text-[17px] sm:text-[18px] leading-[32px] font-sans text-white/90 space-y-6">
            {article.excerpt && (
              <p className="text-lg sm:text-xl font-heading font-bold text-pink-200 leading-relaxed border-l-2 border-[#FF1752] pl-4 italic">
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
        </QuietSurface>

        {/* BERITA TERKAIT */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 pt-8 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-black text-lg text-white uppercase tracking-wider">
                Berita Terkait
              </h2>
              <Link href="/news" className="text-xs font-mono text-pink-300 hover:underline">
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group block"
                >
                  <GlassCard
                    variant="standard"
                    elevation="glass"
                    radius="2xl"
                    specular={true}
                    className="p-4 h-full flex flex-col justify-between group-hover:border-[#FF1752]/40 transition-colors"
                  >
                    <div>
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-black/40 border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-pink-400 font-bold uppercase block mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-heading font-black text-white group-hover:text-pink-300 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 block mt-3 pt-2 border-t border-white/[0.06]">
                      {item.date}
                    </span>
                  </GlassCard>
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
