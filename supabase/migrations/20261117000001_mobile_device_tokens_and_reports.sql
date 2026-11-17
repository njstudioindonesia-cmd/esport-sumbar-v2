-- ====================================================================
-- Migrasi Mobile V3: Device Tokens untuk Push Notification & Pelaporan UGC
-- ====================================================================

-- 1. Tabel Device Tokens untuk Push Notification
CREATE TABLE IF NOT EXISTS public.device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    platform VARCHAR(10) NOT NULL CHECK (platform IN ('android', 'ios')),
    device_id TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing untuk pencarian cepat berdasarkan account_id dan token
CREATE INDEX IF NOT EXISTS idx_device_tokens_account_id ON public.device_tokens(account_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_token ON public.device_tokens(token);

-- RLS Device Tokens
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own device tokens"
    ON public.device_tokens
    FOR ALL
    USING (auth.uid() = account_id)
    WITH CHECK (auth.uid() = account_id);

-- Service role bypass untuk background push worker
CREATE POLICY "Service role has full access to device tokens"
    ON public.device_tokens
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);


-- 2. Tabel User Reports untuk Kepatuhan Toko (UGC Safety)
CREATE TABLE IF NOT EXISTS public.user_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('profile', 'card', 'comment', 'media')),
    target_id UUID NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('inappropriate_content', 'spam', 'harassment', 'impersonation', 'other')),
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'ACTION_TAKEN', 'DISMISSED')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMPTZ,
    admin_notes TEXT
);

-- Indexing laporan
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON public.user_reports(status);
CREATE INDEX IF NOT EXISTS idx_user_reports_target ON public.user_reports(target_type, target_id);

-- RLS User Reports
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Siapa pun (termasuk anonim) dapat membuat laporan
CREATE POLICY "Anyone can submit a report"
    ON public.user_reports
    FOR INSERT
    WITH CHECK (true);

-- Hanya service role / admin yang dapat membaca dan memproses laporan
CREATE POLICY "Service role has full access to reports"
    ON public.user_reports
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
