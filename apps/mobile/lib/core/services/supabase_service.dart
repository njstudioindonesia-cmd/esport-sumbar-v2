import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  // Kredensial sinkron 1:1 dengan .env.local ESPORT SUMBAR
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://gxtzbyeqdmhtddgesbxb.supabase.co',
  );

  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'sb_publishable_-4DDA3BgNl6kZzsOE4lmaQ_2lWj4g5Q',
  );

  static Future<void> initialize() async {
    try {
      await Supabase.initialize(
        url: supabaseUrl,
        // ignore: deprecated_member_use
        anonKey: supabaseAnonKey,
        realtimeClientOptions: const RealtimeClientOptions(
          eventsPerSecond: 10,
        ),
      );
      debugPrint('[SupabaseService] Initialized successfully with Realtime enabled.');
    } catch (e) {
      debugPrint('[SupabaseService] Error initializing Supabase: $e');
    }
  }

  static SupabaseClient get client => Supabase.instance.client;
}
