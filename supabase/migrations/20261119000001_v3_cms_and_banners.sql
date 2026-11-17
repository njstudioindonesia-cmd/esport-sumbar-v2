-- ============================================================================
-- ESPORT SUMBAR V3: CMS, BANNERS, SITE SETTINGS, AND MEDIA LIBRARY SCHEMA
-- File: supabase/migrations/20261119000001_v3_cms_and_banners.sql
-- Sub-langkah 8.1: Skema CMS Lengkap (Expand-Only Migration)
-- ============================================================================

-- 1. PENGATURAN SITUS GLOBAL (SITE SETTINGS)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    site_name TEXT NOT NULL DEFAULT 'ESPORT SUMBAR',
    tagline TEXT NOT NULL DEFAULT 'Pusat Ekosistem & Identitas Digital Atlet Sumatera Barat',
    contact_email TEXT DEFAULT 'kontak@esportsumbar.com',
    contact_phone TEXT DEFAULT '+62 751 123456',
    contact_address TEXT DEFAULT 'Padang, Sumatera Barat, Indonesia',
    legal_entity_name TEXT NOT NULL DEFAULT 'Pengprov ESI Sumatera Barat',
    copyright_year INT NOT NULL DEFAULT 2026,
    maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
    registration_open BOOLEAN NOT NULL DEFAULT TRUE,
    announcement_banner JSONB DEFAULT NULL,
    social_links JSONB NOT NULL DEFAULT '[
        {"platform": "instagram", "url": "https://instagram.com/esi_sumbar", "label": "Instagram Resmi"},
        {"platform": "youtube", "url": "https://youtube.com/@esisumbar", "label": "YouTube Channel"},
        {"platform": "discord", "url": "https://discord.gg/esportsumbar", "label": "Komunitas Discord"}
    ]'::jsonb,
    metadata_defaults JSONB NOT NULL DEFAULT '{
        "title": "ESPORT SUMBAR V3 - Identitas & Ekosistem Esport Resmi Sumatera Barat",
        "description": "Portal resmi registrasi atlet, tim, pelatih, komunitas, dan ekosistem esport Sumatera Barat di bawah Pengprov ESI Sumatera Barat.",
        "ogImage": "/og-default.png"
    }'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- 2. BLOK KONTEN HALAMAN (CONTENT BLOCKS) & RIWAYAT REVISI
CREATE TABLE IF NOT EXISTS public.content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT NOT NULL,
    slot TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    order_index INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    current_version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    CONSTRAINT uq_content_block_page_slot UNIQUE (page, slot)
);

CREATE TABLE IF NOT EXISTS public.content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_block_id UUID NOT NULL REFERENCES public.content_blocks(id) ON DELETE CASCADE,
    version INT NOT NULL,
    content JSONB NOT NULL,
    change_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    CONSTRAINT uq_content_revision UNIQUE (content_block_id, version)
);

-- 3. BANNER PROMOSI & SPONSOR (BANNERS) & STATISTIK HARIAN
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    placement TEXT NOT NULL CHECK (placement IN ('home_top', 'home_middle', 'explore', 'news', 'profile_sidebar')),
    desktop_image_url TEXT NOT NULL,
    mobile_image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    target_url TEXT,
    open_in_new_tab BOOLEAN NOT NULL DEFAULT TRUE,
    is_ad BOOLEAN NOT NULL DEFAULT FALSE,
    sponsor_name TEXT,
    priority INT NOT NULL DEFAULT 0,
    target_device TEXT NOT NULL DEFAULT 'all' CHECK (target_device IN ('all', 'desktop', 'mobile')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'ended', 'archived')),
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{
        "license_source": "internal_production",
        "ad_policy_reviewed": true
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.banner_stats_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    banner_id UUID NOT NULL REFERENCES public.banners(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    impressions INT NOT NULL DEFAULT 0,
    clicks INT NOT NULL DEFAULT 0,
    unique_impressions INT NOT NULL DEFAULT 0,
    CONSTRAINT uq_banner_stats_daily UNIQUE (banner_id, date)
);

-- 4. NAVIGASI SITUS (NAV ITEMS)
CREATE TABLE IF NOT EXISTS public.nav_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location TEXT NOT NULL CHECK (location IN ('header', 'footer_col1', 'footer_col2', 'footer_col3', 'footer_legal')),
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    is_external BOOLEAN NOT NULL DEFAULT FALSE,
    target_role TEXT DEFAULT 'all',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. HALAMAN STATIS & KEBIJAKAN HUKUM (LEGAL PAGES)
CREATE TABLE IF NOT EXISTS public.legal_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content_markdown TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_reviewed_by_legal BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- 6. PERTANYAAN UMUM (FAQ ITEMS)
CREATE TABLE IF NOT EXISTS public.faq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL DEFAULT 'umum',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PUSTAKA MEDIA & LISENSI ASET (MEDIA ASSETS)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    dimensions JSONB DEFAULT '{"width": 1920, "height": 1080}'::jsonb,
    alt_text TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'internal_production' CHECK (source IN ('internal_production', 'licensed_partner', 'official_ugc', 'brand_asset')),
    license_type TEXT NOT NULL DEFAULT 'owned' CHECK (license_type IN ('owned', 'partnership_authorized', 'creative_commons_verified', 'exclusive_license')),
    credit TEXT NOT NULL DEFAULT 'Pengprov ESI Sumatera Barat',
    usage_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 8. BENDERA FITUR (FEATURE FLAGS)
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    owner_only BOOLEAN NOT NULL DEFAULT FALSE,
    percentage INT NOT NULL DEFAULT 100 CHECK (percentage >= 0 AND percentage <= 100),
    attributes JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- INDEKS PERFORMA KUERI CMS & BANNERS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_content_blocks_page_pub ON public.content_blocks(page, is_published, order_index);
CREATE INDEX IF NOT EXISTS idx_banners_placement_status ON public.banners(placement, status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_banners_schedule ON public.banners(start_at, end_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_banner_stats_date ON public.banner_stats_daily(date);
CREATE INDEX IF NOT EXISTS idx_nav_items_location ON public.nav_items(location, is_visible, order_index);
CREATE INDEX IF NOT EXISTS idx_faq_items_cat_pub ON public.faq_items(category, is_published, order_index);
CREATE INDEX IF NOT EXISTS idx_media_assets_source ON public.media_assets(source, license_type);

-- ============================================================================
-- KEBIJAKAN ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_stats_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Hak Baca Publik (Anonim & Terotentikasi)
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read published content blocks" ON public.content_blocks FOR SELECT USING (is_published = true);
CREATE POLICY "Public read active banners" ON public.banners FOR SELECT USING (
    status = 'published' AND
    (start_at IS NULL OR start_at <= NOW()) AND
    (end_at IS NULL OR end_at >= NOW())
);
CREATE POLICY "Public read visible nav items" ON public.nav_items FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read legal pages" ON public.legal_pages FOR SELECT USING (true);
CREATE POLICY "Public read published faq" ON public.faq_items FOR SELECT USING (is_published = true);
CREATE POLICY "Public read public media" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Public read feature flags" ON public.feature_flags FOR SELECT USING (true);

-- Pelacakan Banner (BFF / Anonim bisa increment stats)
CREATE POLICY "Public increment banner stats" ON public.banner_stats_daily FOR ALL USING (true) WITH CHECK (true);

-- Hak Kelola Admin (Berdasarkan peran di public.accounts)
CREATE POLICY "Admin manage site settings" ON public.site_settings FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'));

CREATE POLICY "Admin manage content blocks" ON public.content_blocks FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'));

CREATE POLICY "Admin manage content revisions" ON public.content_revisions FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'));

CREATE POLICY "Admin manage banners" ON public.banners FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'));

CREATE POLICY "Admin manage nav items" ON public.nav_items FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'));

CREATE POLICY "Admin manage legal pages" ON public.legal_pages FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'));

CREATE POLICY "Admin manage faq items" ON public.faq_items FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'));

CREATE POLICY "Admin manage media assets" ON public.media_assets FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'));

CREATE POLICY "Admin manage feature flags" ON public.feature_flags FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.accounts WHERE accounts.id = auth.uid() AND accounts.role = 'platform_admin'));

-- ============================================================================
-- SEED DATA AWAL PRODUKSI (ZERO DUMMY, RESMI SUMATERA BARAT)
-- ============================================================================

-- Seed Site Settings
INSERT INTO public.site_settings (id, site_name, tagline, legal_entity_name, copyright_year)
VALUES ('default', 'ESPORT SUMBAR', 'Pusat Ekosistem & Identitas Digital Atlet Sumatera Barat', 'Pengprov ESI Sumatera Barat', 2026)
ON CONFLICT (id) DO NOTHING;

-- Seed Feature Flags
INSERT INTO public.feature_flags (id, name, description, is_enabled, percentage)
VALUES
    ('maintenance_mode', 'Mode Pemeliharaan Situs', 'Mengalihkan akses publik ke halaman pemeliharaan terkendali', FALSE, 100),
    ('registration_open', 'Pendaftaran Akun Baru', 'Membuka portal registrasi atlet, tim, pelatih, dan komunitas', TRUE, 100),
    ('banner_autoplay', 'Putar Otomatis Slider Banner', 'Mengaktifkan transisi otomatis karusel banner', TRUE, 100),
    ('owner_preview_mode', 'Mode Pratinjau Publik Pemilik', 'Memungkinkan pemilik profil beralih ke pratinjau publik', TRUE, 100)
ON CONFLICT (id) DO NOTHING;

-- Seed Nav Items (Header)
INSERT INTO public.nav_items (location, label, href, order_index, is_visible)
VALUES
    ('header', 'Beranda', '/', 0, TRUE),
    ('header', 'Direktori', '/explore', 1, TRUE),
    ('header', 'Ekosistem', '/ecosystem', 2, TRUE),
    ('header', 'Berita', '/news', 3, TRUE),
    ('header', 'Standar Verifikasi', '/verification-standard', 4, TRUE)
ON CONFLICT DO NOTHING;

-- Seed Nav Items (Footer)
INSERT INTO public.nav_items (location, label, href, order_index, is_visible)
VALUES
    ('footer_col1', 'Tentang Kami', '/about', 0, TRUE),
    ('footer_col1', 'Cara Kerja', '/how-it-works', 1, TRUE),
    ('footer_col1', 'Standar Verifikasi', '/verification-standard', 2, TRUE),
    ('footer_col1', 'Pertanyaan Umum (FAQ)', '/faq', 3, TRUE),

    ('footer_col2', 'Eksplorasi Atlet', '/players', 0, TRUE),
    ('footer_col2', 'Direktori Tim', '/teams', 1, TRUE),
    ('footer_col2', 'Komunitas & Venue', '/communities', 2, TRUE),
    ('footer_col2', 'Peta Wilayah', '/regions', 3, TRUE),

    ('footer_legal', 'Syarat & Ketentuan', '/terms', 0, TRUE),
    ('footer_legal', 'Kebijakan Privasi (UU PDP)', '/privacy', 1, TRUE),
    ('footer_legal', 'Kebijakan Konten & Iklan', '/content-policy', 2, TRUE)
ON CONFLICT DO NOTHING;

-- Seed Content Blocks (Home Hero)
INSERT INTO public.content_blocks (page, slot, type, title, content, order_index, is_published, current_version)
VALUES
    ('home', 'hero', 'hero_block', 'Panggung Esport Sumatera Barat', '{
        "headline": "Satu Ekosistem Resmi. Identitas Digital Terpercaya.",
        "subheadline": "Portal resmi Pengprov ESI Sumatera Barat untuk verifikasi identitas atlet, tim, pelatih, komunitas, dan arena kompetisi di 19 kabupaten dan kota.",
        "cta_primary_label": "Daftar Identitas Resmi",
        "cta_primary_href": "/register",
        "cta_secondary_label": "Jelajahi Direktori",
        "cta_secondary_href": "/explore",
        "hero_badge_text": "Pengprov ESI Sumatera Barat • Musim 2026"
    }'::jsonb, 0, TRUE, 1),
    ('home', 'section_config', 'section_config', 'Konfigurasi Bagian Beranda', '{
        "hero_visible": true,
        "banners_visible": true,
        "ecosystem_visible": true,
        "featured_profiles_visible": true,
        "news_visible": true,
        "cta_visible": true,
        "min_profiles_threshold": 3
    }'::jsonb, 1, TRUE, 1)
ON CONFLICT (page, slot) DO NOTHING;

-- Seed Legal Pages
INSERT INTO public.legal_pages (slug, title, summary, content_markdown, version, effective_date, is_reviewed_by_legal)
VALUES
    ('terms', 'Syarat & Ketentuan Penggunaan', 'Ketentuan hukum resmi penggunaan platform ESPORT SUMBAR V3', '# Syarat & Ketentuan Penggunaan ESPORT SUMBAR V3

Selamat datang di platform resmi ESPORT SUMBAR, portal verifikasi dan identitas digital esport Sumatera Barat yang dikelola oleh Pengprov ESI Sumatera Barat.

### 1. Ketentuan Umum
Dengan mengakses atau menggunakan platform ini, pengguna menyatakan tunduk pada seluruh ketentuan yang ditetapkan. Setiap pengguna hanya diperkenankan memiliki satu akun identitas resmi yang mewakili bidang esport yang sah.

### 2. Keaslian Identitas
Setiap atlet, tim, pelatih, dan komunitas wajib menyampaikan data yang benar, akurat, dan dapat diverifikasi. Pemalsuan identitas atau dokumen pendukung akan berakibat pada penangguhan (suspension) atau pencabutan status verifikasi resmi.

### 3. Perlindungan Hak Cipta & Merek
Seluruh aset visual, lencana verifikasi, dan materi resmi di platform ini dilindungi oleh undang-undang hak cipta. Penggunaan tidak sah untuk tujuan komersial di luar ekosistem resmi dilarang keras.', '1.0', CURRENT_DATE, TRUE),

    ('privacy', 'Kebijakan Privasi & Perlindungan Data Pribadi', 'Komitmen kepatuhan terhadap Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)', '# Kebijakan Privasi Platform ESPORT SUMBAR V3

Platform ESPORT SUMBAR berkomitmen penuh melindungi hak privasi pengguna sesuai Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).

### 1. Data yang Dikumpulkan
Kami memisahkan secara ketat antara **Data Publik** (nama tampilan, in-game name, cabang game, asal daerah) dan **Data Pribadi Terlindungi** (NIK, tanggal lahir, kontak privat, dokumen identitas).

### 2. Prinsip Pemrosesan Data
- **Data pribadi sensitif tidak pernah ditampilkan di antarmuka publik atau respons API publik.**
- Dokumen verifikasi hanya dapat diakses oleh verifikator resmi yang berwenang melalui jaringan terproteksi.
- Pengguna berhak menarik persetujuan, meminta pembaruan data, atau menghapus akun mereka kapan saja.

### 3. Keamanan Sesi & Kuki
Sesi platform menggunakan kuki host-only yang aman dengan proteksi CSRF dan enkripsi modern.', '1.0', CURRENT_DATE, TRUE),

    ('content-policy', 'Kebijakan Konten & Periklanan Platform', 'Standar etika konten, materi sponsor, dan integritas esport', '# Kebijakan Konten & Periklanan ESPORT SUMBAR V3

### 1. Integritas Konten
Platform ESPORT SUMBAR menolak seluruh bentuk konten buatan pengguna yang memuat ujaran kebencian, diskriminasi, kecurangan dalam kompetisi esport, serta materi yang melanggar hukum Republik Indonesia.

### 2. Larangan Periklanan & Sponsorship
Platform secara tegas melarang penayangan banner, sponsor, atau materi promosi yang terafiliasi dengan:
1. Perjudian, taruhan, atau lotere dalam bentuk apa pun.
2. Pinjaman daring ilegal atau investasi tanpa izin OJK.
3. Konten dewasa, alkohol, rokok, atau obat-obatan terlarang.
4. Klaim kesehatan atau finansial yang menyesatkan.

### 3. Transparansi Materi Berbayar
Setiap banner promosi atau sponsor wajib menyertakan label penanda "Iklan" atau "Sponsor" dan mematuhi standar rasio serta batas ukuran berkas yang telah ditetapkan.', '1.0', CURRENT_DATE, TRUE),

    ('verification-standard', 'Standar Verifikasi Kartu & Lencana Digital', 'Pedoman penjaminan mutu identitas atlet dan ekosistem esport Sumatera Barat', '# Standar Verifikasi Digital ESPORT SUMBAR V3

Platform ESPORT SUMBAR menerapkan sistem verifikasi bertingkat untuk menjamin keabsahan atlet dan entitas yang berkompetisi di Sumatera Barat.

### 1. Tingkatan Lencana
- **Unverified (Belum Terverifikasi):** Pengguna baru yang belum mengunggah dokumen bukti resmi.
- **Dalam Peninjauan:** Dokumen sedang dalam antrean pemeriksaan oleh tim verifikator Pengprov ESI Sumatera Barat.
- **Terverifikasi Resmi:** Pemilik profil telah lolos pemeriksaan identitas dan menerima nomor lencana resmi terdaftar.
- **Penangguhan (Suspended):** Akun yang melanggar kode etik esport atau terbukti memalsukan data.

### 2. Dokumen yang Diperlukan
- **Atlet/Pemain:** Kartu identitas yang sah (KTP/KIA/Kartu Pelajar), surat izin wali bagi yang berusia di bawah 18 tahun, serta bukti rekam jejak kompetisi.
- **Tim:** Bukti kepengurusan, daftar nama anggota (roster), dan penanggung jawab tim.
- **Komunitas & Venue:** Surat rekomendasi pengurus daerah atau dokumentasi legalitas venue fisik.', '1.0', CURRENT_DATE, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Seed Initial FAQ
INSERT INTO public.faq_items (category, question, answer, order_index, is_published)
VALUES
    ('pendaftaran', 'Bagaimana cara mendaftarkan diri sebagai atlet esport resmi di Sumatera Barat?', 'Anda dapat mendaftar dengan membuat akun, memilih bidang Atlet/Pemain, mengisi informasi game utama serta wilayah kabupaten/kota, kemudian mengunggah dokumen pendukung untuk diverifikasi.', 0, TRUE),
    ('verifikasi', 'Berapa lama proses verifikasi lencana resmi?', 'Proses verifikasi oleh tim peninjau Pengprov ESI Sumatera Barat memakan waktu antara 1 hingga 3 hari kerja setelah seluruh dokumen lengkap diunggah.', 1, TRUE),
    ('ekosistem', 'Apakah tim esport yang terdaftar bisa mengundang atlet ke dalam roster?', 'Ya, pemilik atau manajer tim resmi dapat mengirimkan tautan undangan relasi roster kepada atlet terdaftar secara langsung melalui fitur Ekosistem.', 2, TRUE),
    ('privasi', 'Apakah nomor kontak dan data pribadi saya dapat dilihat oleh pengunjung umum?', 'Tidak. Berdasarkan UU PDP dan standar privasi platform kami, data kontak pribadi dan nomor identitas tersimpan secara aman dan tidak pernah ditampilkan ke publik.', 3, TRUE)
ON CONFLICT DO NOTHING;
