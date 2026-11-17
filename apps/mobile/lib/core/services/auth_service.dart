import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../network/api_client.dart';

class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  SupabaseClient? get _client {
    try {
      return Supabase.instance.client;
    } catch (_) {
      return null;
    }
  }

  User? get currentUser => _client?.auth.currentUser;
  Session? get currentSession => _client?.auth.currentSession;
  bool get isAuthenticated => currentUser != null;

  Stream<AuthState> get authStateChanges => _client?.auth.onAuthStateChange ?? const Stream.empty();

  // Masuk akun (PKCE otomatis oleh Supabase SDK)
  Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    final client = _client;
    if (client == null) {
      throw Exception('Layanan autentikasi belum siap.');
    }
    try {
      final response = await client.auth.signInWithPassword(
        email: email.trim(),
        password: password,
      );
      debugPrint('[AuthService] User signed in: ${response.user?.id}');
      return response;
    } catch (e) {
      debugPrint('[AuthService] Sign in error: $e');
      rethrow;
    }
  }

  // Daftar akun baru
  Future<AuthResponse> signUp({
    required String email,
    required String password,
    Map<String, dynamic>? data,
  }) async {
    final client = _client;
    if (client == null) {
      throw Exception('Layanan autentikasi belum siap.');
    }
    try {
      final response = await client.auth.signUp(
        email: email.trim(),
        password: password,
        data: data,
      );
      debugPrint('[AuthService] User registered: ${response.user?.id}');
      return response;
    } catch (e) {
      debugPrint('[AuthService] Sign up error: $e');
      rethrow;
    }
  }

  // Reset / Lupa kata sandi (Pesan netral tanpa kebocoran email)
  Future<void> resetPassword({required String email}) async {
    final client = _client;
    if (client == null) {
      return;
    }
    try {
      await client.auth.resetPasswordForEmail(
        email.trim(),
        redirectTo: 'esportsumbar://reset-password',
      );
      debugPrint('[AuthService] Reset password email dispatched.');
    } catch (e) {
      // Tangani error secara aman: tidak membocorkan keberadaan email
      debugPrint('[AuthService] Reset password request handled: $e');
    }
  }

  // Keluar sesi
  Future<void> signOut() async {
    final client = _client;
    if (client == null) return;
    try {
      await client.auth.signOut().timeout(
        const Duration(seconds: 1),
        onTimeout: () => debugPrint('[AuthService] Sign out timeout, proceed offline.'),
      );
      debugPrint('[AuthService] User signed out cleanly.');
    } catch (e) {
      debugPrint('[AuthService] Sign out error: $e');
    }
  }

  // Hapus akun mandiri dari dalam aplikasi (Kepatuhan Toko Apple/Google)
  Future<bool> deleteAccount({String? reason}) async {
    try {
      final success = await ApiClient.instance.deleteAccount(reason: reason);
      if (success) {
        await signOut();
      }
      return success;
    } catch (e) {
      debugPrint('[AuthService] Delete account error: $e');
      return false;
    }
  }
}
