-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0002: Row Level Security (RLS) & Policies
-- Basis: docs/esport-sumbar-prd.md Bagian 3.2 & 8.2 (Keamanan Multi-Tenant & Audit)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- HELPER FUNCTIONS FOR ROLE AND REGION EXTRACTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS VARCHAR AS $$
    SELECT role FROM public.accounts WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_auth_region_id()
RETURNS VARCHAR AS $$
    SELECT assigned_region_id FROM public.accounts WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. REGIONS POLICIES (Publik Boleh Baca, Operator Boleh Kelola)
-- ------------------------------------------------------------------------------
CREATE POLICY "Regions are viewable by everyone" 
ON public.regions FOR SELECT 
USING (true);

CREATE POLICY "Regions can only be modified by platform operator" 
ON public.regions FOR ALL 
USING (public.get_auth_role() = 'platform_operator')
WITH CHECK (public.get_auth_role() = 'platform_operator');

-- ------------------------------------------------------------------------------
-- 2. GAMES POLICIES (Publik Boleh Baca, Operator Boleh Kelola)
-- ------------------------------------------------------------------------------
CREATE POLICY "Games are viewable by everyone" 
ON public.games FOR SELECT 
USING (true);

CREATE POLICY "Games can only be modified by platform operator" 
ON public.games FOR ALL 
USING (public.get_auth_role() = 'platform_operator')
WITH CHECK (public.get_auth_role() = 'platform_operator');

-- ------------------------------------------------------------------------------
-- 3. ACCOUNTS POLICIES (Data Pribadi & Manajemen Hak Akses)
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view their own account" 
ON public.accounts FOR SELECT 
USING (
    id = auth.uid() 
    OR public.get_auth_role() IN ('prov_admin', 'platform_operator')
);

CREATE POLICY "Users can update their own account details" 
ON public.accounts FOR UPDATE 
USING (id = auth.uid())
WITH CHECK (
    id = auth.uid() 
    -- Cegah eskalasi hak akses role sendiri
    AND role = (SELECT role FROM public.accounts WHERE id = auth.uid())
);

CREATE POLICY "Platform operator can manage all accounts" 
ON public.accounts FOR ALL 
USING (public.get_auth_role() = 'platform_operator')
WITH CHECK (public.get_auth_role() = 'platform_operator');

-- ------------------------------------------------------------------------------
-- 4. GUARDIAN CONSENTS POLICIES (Perlindungan Data Anak UU PDP)
-- ------------------------------------------------------------------------------
CREATE POLICY "User can view and insert own guardian consent" 
ON public.guardian_consents FOR ALL 
USING (account_id = auth.uid())
WITH CHECK (account_id = auth.uid());

CREATE POLICY "Admins can view guardian consents for review" 
ON public.guardian_consents FOR SELECT 
USING (
    public.get_auth_role() IN ('prov_admin', 'platform_operator')
    OR (
        public.get_auth_role() = 'region_admin' 
        AND account_id IN (
            SELECT p.account_id FROM public.profiles p 
            WHERE p.region_id = public.get_auth_region_id()
        )
    )
);

-- ------------------------------------------------------------------------------
-- 5. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Publik dapat melihat profil yang dipublikasikan
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (
    is_published = true 
    OR account_id = auth.uid()
    OR public.get_auth_role() IN ('prov_admin', 'platform_operator')
    OR (public.get_auth_role() = 'region_admin' AND region_id = public.get_auth_region_id())
);

-- Pemilik akun dapat membuat profil baru
CREATE POLICY "Users can create profiles for their account" 
ON public.profiles FOR INSERT 
WITH CHECK (account_id = auth.uid());

-- Pemilik akun dapat memperbarui profilnya sendiri (status verifikasi dicegah via trigger)
CREATE POLICY "Users can update their own profiles" 
ON public.profiles FOR UPDATE 
USING (account_id = auth.uid())
WITH CHECK (account_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 6. VERIFICATION REQUESTS POLICIES (Isolasi Antrean Multi-Tenant)
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view and create their own verification requests" 
ON public.verification_requests FOR SELECT 
USING (
    profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

CREATE POLICY "Users can submit verification request" 
ON public.verification_requests FOR INSERT 
WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

-- Admin Daerah HANYA BISA MELIHAT antrean di wilayahnya sendiri
CREATE POLICY "Region admins can view requests in their assigned region" 
ON public.verification_requests FOR SELECT 
USING (
    public.get_auth_role() = 'region_admin' 
    AND region_id = public.get_auth_region_id()
);

-- Admin Provinsi dapat melihat antrean seluruh daerah (termasuk mode fallback)
CREATE POLICY "Provincial admins can view all verification requests" 
ON public.verification_requests FOR SELECT 
USING (public.get_auth_role() = 'prov_admin');

-- Operator Platform dapat melihat ringkasan antrean teknis
CREATE POLICY "Platform operators can view all verification requests" 
ON public.verification_requests FOR SELECT 
USING (public.get_auth_role() = 'platform_operator');

-- ------------------------------------------------------------------------------
-- 7. AUDIT LOGS POLICIES (IMMUTABLE APPEND-ONLY - TANPA UPDATE/DELETE)
-- ------------------------------------------------------------------------------
-- Cabut secara mutlak hak UPDATE dan DELETE untuk semua role
REVOKE UPDATE, DELETE ON public.audit_logs FROM PUBLIC, anon, authenticated;

-- Hanya izinkan pembacaan audit log sesuai hierarki peran (PRD 3.2 & 8.2)
CREATE POLICY "Read audit logs based on role scope" 
ON public.audit_logs FOR SELECT 
USING (
    public.get_auth_role() IN ('prov_admin', 'platform_operator')
    OR (
        public.get_auth_role() = 'region_admin' 
        AND region_id = public.get_auth_region_id()
    )
);

-- Penulisan audit logs diizinkan untuk internal service / authenticated transitions
CREATE POLICY "Allow system and transition functions to insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 8. MEMBERSHIPS POLICIES (Relasi & Persetujuan Roster Tim)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view accepted memberships" 
ON public.memberships FOR SELECT 
USING (
    status = 'accepted'
    OR member_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR org_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

CREATE POLICY "Members or Team Owners can initiate memberships" 
ON public.memberships FOR INSERT 
WITH CHECK (
    member_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR org_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

CREATE POLICY "Involved parties can update membership status" 
ON public.memberships FOR UPDATE 
USING (
    member_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR org_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

-- ------------------------------------------------------------------------------
-- 9. ACHIEVEMENTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view validated achievements" 
ON public.achievements FOR SELECT 
USING (
    validation_status = 'validated'
    OR profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR public.get_auth_role() IN ('prov_admin', 'platform_operator')
    OR (
        public.get_auth_role() = 'region_admin' 
        AND profile_id IN (
            SELECT id FROM public.profiles WHERE region_id = public.get_auth_region_id()
        )
    )
);

CREATE POLICY "Users can manage achievements for their own profiles" 
ON public.achievements FOR ALL 
USING (profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid()));

-- ------------------------------------------------------------------------------
-- 10. ARTICLES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Published articles are viewable by everyone" 
ON public.articles FOR SELECT 
USING (
    status = 'published'
    OR public.get_auth_role() IN ('platform_operator', 'prov_admin')
);

CREATE POLICY "Platform operators can manage articles" 
ON public.articles FOR ALL 
USING (public.get_auth_role() IN ('platform_operator', 'prov_admin'))
WITH CHECK (public.get_auth_role() IN ('platform_operator', 'prov_admin'));

-- ------------------------------------------------------------------------------
-- 11. REPORTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Authenticated users can submit abuse reports" 
ON public.reports FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own submitted reports" 
ON public.reports FOR SELECT 
USING (reporter_account_id = auth.uid());

CREATE POLICY "Moderators can view and update reports" 
ON public.reports FOR ALL 
USING (public.get_auth_role() IN ('platform_operator', 'prov_admin'))
WITH CHECK (public.get_auth_role() IN ('platform_operator', 'prov_admin'));

-- ------------------------------------------------------------------------------
-- 12. NOTIFICATIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view their own notifications" 
ON public.notifications_queue FOR SELECT 
USING (account_id = auth.uid());
