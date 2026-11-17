import React from "react";

export interface FooterLinkItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLinkItem[];
}

export interface FooterProps {
  logo?: React.ReactNode;
  brandDescription?: string;
  columns?: FooterColumn[];
  legalEntity?: string;
  year?: number;
  className?: string;
}

export function Footer({
  logo,
  brandDescription = "Pusat data, identitas digital, dan ekosistem resmi olahraga elektronik 19 Kota dan Kabupaten Sumatera Barat.",
  columns = [
    {
      title: "Platform",
      links: [
        { label: "Jelajah Direktori", href: "/explore" },
        { label: "Penerbitan Kartu", href: "/onboarding" },
        { label: "Standar Verifikasi", href: "/verification-standard" },
      ],
    },
    {
      title: "Informasi",
      links: [
        { label: "Tentang Kami", href: "/about" },
        { label: "Warta & Prestasi", href: "/news" },
        { label: "Hubungi Pengurus", href: "/contact" },
      ],
    },
    {
      title: "Legalitas",
      links: [
        { label: "Syarat & Ketentuan", href: "/terms" },
        { label: "Kebijakan Privasi", href: "/privacy" },
        { label: "Pedoman Konten", href: "/content-policy" },
      ],
    },
  ],
  legalEntity = "Perkumpulan Olahraga Elektronik Sumatera Barat",
  year = 2026,
  className = "",
}: FooterProps) {
  return (
    <footer
      className={`w-full mt-auto bg-[#05051A] border-t border-white/[0.08] select-none ${className}`}
    >
      <div className="max-w-6xl w-full mx-auto px-6 py-12 md:py-16 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info Column */}
          <div className="flex flex-col gap-3 md:col-span-1">
            {logo || (
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#FF1752] text-white flex items-center justify-center font-black text-xs">
                  V
                </span>
                <span className="font-extrabold tracking-tight text-white text-sm">
                  ESPORT SUMBAR
                </span>
              </div>
            )}
            <p className="text-xs text-white/50 leading-relaxed max-w-xs mt-1">
              {brandDescription}
            </p>
          </div>

          {/* 3 Nav Columns */}
          {columns.map((col, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="text-xs text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Legal Line */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-3">
          <span>
            © {year} ESPORT SUMBAR. Hak cipta dilindungi undang-undang.
          </span>
          <span>{legalEntity}</span>
        </div>
      </div>
    </footer>
  );
}
