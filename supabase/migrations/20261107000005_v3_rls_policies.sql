-- ==============================================================================
-- ESPORT SUMBAR V3 - Database Migration 0014: RLS POLICIES (Konsolidasi user & platform_admin)
-- Basis: docs/adr/ADR-002 & Bagian 3.3 Dokumen Transformasi
-- ==============================================================================

-- 1. FUNGSI PEMBANTU: is_platform_admin()
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.accounts
        WHERE id = auth.uid() AND role = 'platform_admin' AND is_active = TRUE
    );
$$;

-- 2. KEBIJAKAN RLS PADA TABEL ACCOUNTS
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own account" ON public.accounts;
CREATE POLICY "Users can read their own account"
ON public.accounts FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_platform_admin());

DROP POLICY IF EXISTS "Users can update their own account" ON public.accounts;
CREATE POLICY "Users can update their own account"
ON public.accounts FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.accounts WHERE id = auth.uid())); -- Cegah eskalasi peran mandiri

DROP POLICY IF EXISTS "Platform admin can manage accounts" ON public.accounts;
CREATE POLICY "Platform admin can manage accounts"
ON public.accounts FOR ALL
TO authenticated
USING (public.is_platform_admin());

-- 3. KEBIJAKAN RLS PADA TABEL PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published profiles" ON public.profiles;
CREATE POLICY "Public can view published profiles"
ON public.profiles FOR SELECT
TO public
USING (is_published = TRUE AND verification_status != 'suspended');

DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
CREATE POLICY "Users can manage own profile"
ON public.profiles FOR ALL
TO authenticated
USING (account_id = auth.uid() OR public.is_platform_admin())
WITH CHECK (account_id = auth.uid() OR public.is_platform_admin());

-- 4. KEBIJAKAN RLS PADA TABEL VERIFICATION_REQUESTS
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own verification request" ON public.verification_requests;
CREATE POLICY "Users can view own verification request"
ON public.verification_requests FOR SELECT
TO authenticated
USING (
    profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR public.is_platform_admin()
);

DROP POLICY IF EXISTS "Users can insert own verification request" ON public.verification_requests;
CREATE POLICY "Users can insert own verification request"
ON public.verification_requests FOR INSERT
TO authenticated
WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

DROP POLICY IF EXISTS "Platform admin can update verification requests" ON public.verification_requests;
CREATE POLICY "Platform admin can update verification requests"
ON public.verification_requests FOR UPDATE
TO authenticated
USING (public.is_platform_admin());

-- 5. KEBIJAKAN RLS PADA TABEL ENTITY_RELATIONS
ALTER TABLE public.entity_relations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active relations" ON public.entity_relations;
CREATE POLICY "Public can view active relations"
ON public.entity_relations FOR SELECT
TO public
USING (status = 'active');

DROP POLICY IF EXISTS "Involved profiles can view pending relations" ON public.entity_relations;
CREATE POLICY "Involved profiles can view pending relations"
ON public.entity_relations FOR SELECT
TO authenticated
USING (
    source_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR target_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR public.is_platform_admin()
);

-- 6. KEBIJAKAN RLS PADA TABEL RELATION_RULES
ALTER TABLE public.relation_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active relation rules" ON public.relation_rules;
CREATE POLICY "Anyone can read active relation rules"
ON public.relation_rules FOR SELECT
TO public
USING (is_active = TRUE);

DROP POLICY IF EXISTS "Platform admin can manage relation rules" ON public.relation_rules;
CREATE POLICY "Platform admin can manage relation rules"
ON public.relation_rules FOR ALL
TO authenticated
USING (public.is_platform_admin());

-- 7. KEBIJAKAN RLS PADA MASTER GAMES, GAME_ROLES, GAME_RANKS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_ranks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view games" ON public.games;
CREATE POLICY "Public can view games" ON public.games FOR SELECT TO public USING (TRUE);

DROP POLICY IF EXISTS "Public can view game roles" ON public.game_roles;
CREATE POLICY "Public can view game roles" ON public.game_roles FOR SELECT TO public USING (TRUE);

DROP POLICY IF EXISTS "Public can view game ranks" ON public.game_ranks;
CREATE POLICY "Public can view game ranks" ON public.game_ranks FOR SELECT TO public USING (TRUE);

DROP POLICY IF EXISTS "Platform admin can manage games" ON public.games;
CREATE POLICY "Platform admin can manage games" ON public.games FOR ALL TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admin can manage game roles" ON public.game_roles;
CREATE POLICY "Platform admin can manage game roles" ON public.game_roles FOR ALL TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admin can manage game ranks" ON public.game_ranks;
CREATE POLICY "Platform admin can manage game ranks" ON public.game_ranks FOR ALL TO authenticated USING (public.is_platform_admin());

-- 8. PROTEKSI MUTLAK APPEND-ONLY PADA AUDIT_LOGS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admin can view audit logs" ON public.audit_logs;
CREATE POLICY "Platform admin can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_platform_admin());

-- Cegah tegas operasi UPDATE dan DELETE pada tabel audit_logs
CREATE OR REPLACE FUNCTION public.prevent_audit_logs_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit Log bersifat append-only dan tidak dapat diubah atau dihapus oleh siapapun.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_tampering ON public.audit_logs;
CREATE TRIGGER trg_prevent_audit_tampering
BEFORE UPDATE OR DELETE ON public.audit_logs
FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_audit_logs_tampering();
