# ADR-M05: Arsitektur Notifikasi Push Multi-Platform (FCM & APNs)

**Status**: APPROVED  
**Tanggal**: November 2026  

---

## 1. Konteks
Pemberitahuan persetujuan verifikasi, undangan tim, dan pengumuman turnamen harus sampai langsung ke smartphone pengguna melalui Push Notification. Saat ini sistem hanya memiliki notifikasi email.

## 2. Keputusan Arsitektur
1. **Penyimpanan Token Perangkat (`device_tokens`)**:
   - Skema tabel di Supabase:
     ```sql
     CREATE TABLE public.device_tokens (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
       platform VARCHAR(10) CHECK (platform IN ('android', 'ios')),
       push_token TEXT NOT NULL,
       app_version VARCHAR(20),
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW(),
       UNIQUE(account_id, push_token)
     );
     ```
2. **Pengiriman Notifikasi**:
   - Menggunakan Firebase Cloud Messaging (FCM) untuk Android dan Apple Push Notification service (APNs) untuk iOS via `expo-notifications`.
   - Event Outbox backend (`VerificationApproved`, `RelationRequested`, `RelationAccepted`) memicu pengiriman push tanpa blocking request pengguna.
3. **Privasi & Izin Pengguna**:
   - Permintaan izin notifikasi **tidak dimunculkan saat pertama kali aplikasi dibuka**. Izin baru diminta setelah onboarding atau saat pengguna pertama kali mengajukan kartu / relasi dengan penjelasan kontekstual.
