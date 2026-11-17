import 'dart:convert';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';

class ApiClient {
  ApiClient._();
  static final ApiClient instance = ApiClient._();

  // URL BFF Next.js default untuk emulator Android: 10.0.2.2 mengarah ke host localhost:3000
  static String get baseUrl {
    const overrideUrl = String.fromEnvironment('BFF_URL');
    if (overrideUrl.isNotEmpty) return overrideUrl;

    if (kIsWeb) return 'http://localhost:3000';
    try {
      if (Platform.isAndroid) return 'http://10.0.2.2:3000';
    } catch (_) {}
    return 'http://localhost:3000';
  }

  Map<String, String> _buildHeaders([String? token]) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-correlation-id': 'mob-${DateTime.now().millisecondsSinceEpoch}',
    };

    String? authToken;
    try {
      authToken = token ?? Supabase.instance.client.auth.currentSession?.accessToken;
    } catch (_) {}
    if (authToken != null && authToken.isNotEmpty) {
      headers['Authorization'] = 'Bearer $authToken';
    }

    return headers;
  }

  /// Generic GET helper
  Future<http.Response> get(String endpoint, {String? token}) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    return http.get(uri, headers: _buildHeaders(token)).timeout(const Duration(seconds: 10));
  }

  /// Generic POST helper
  Future<http.Response> post(String endpoint, Map<String, dynamic> body, {String? token}) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    return http
        .post(uri, headers: _buildHeaders(token), body: jsonEncode(body))
        .timeout(const Duration(seconds: 10));
  }

  // 1. GET /api/v1/system/version
  Future<Map<String, dynamic>> getSystemVersion() async {
    try {
      final uri = Uri.parse('$baseUrl/api/v1/system/version');
      final response = await http.get(uri, headers: _buildHeaders()).timeout(
            const Duration(seconds: 5),
          );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
      return {
        'success': false,
        'error': {'message': 'Status code ${response.statusCode}'}
      };
    } catch (e) {
      return {
        'success': false,
        'error': {'message': e.toString()}
      };
    }
  }

  // 2. GET /api/v1/system/health
  Future<Map<String, dynamic>> getSystemHealth() async {
    try {
      final uri = Uri.parse('$baseUrl/api/v1/system/health');
      final response = await http.get(uri, headers: _buildHeaders()).timeout(
            const Duration(seconds: 5),
          );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
      return {
        'success': false,
        'error': {'message': 'Status code ${response.statusCode}'}
      };
    } catch (e) {
      return {
        'success': false,
        'error': {'message': e.toString()}
      };
    }
  }

  // 3. POST /api/v1/auth/device-token
  Future<bool> registerDeviceToken(String token, String platform) async {
    try {
      final uri = Uri.parse('$baseUrl/api/v1/auth/device-token');
      final response = await http
          .post(
            uri,
            headers: _buildHeaders(),
            body: jsonEncode({
              'token': token,
              'platform': platform,
            }),
          )
          .timeout(const Duration(seconds: 5));

      return response.statusCode == 200;
    } catch (e) {
      debugPrint('[ApiClient] Error registerDeviceToken: $e');
      return false;
    }
  }

  // 4. POST /api/v1/reports
  Future<Map<String, dynamic>> submitReport({
    required String targetType,
    required String targetId,
    required String category,
    required String reason,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/api/v1/reports');
      final response = await http
          .post(
            uri,
            headers: _buildHeaders(),
            body: jsonEncode({
              'targetType': targetType,
              'targetId': targetId,
              'category': category,
              'reason': reason,
            }),
          )
          .timeout(const Duration(seconds: 5));

      return jsonDecode(response.body) as Map<String, dynamic>;
    } catch (e) {
      return {
        'success': false,
        'error': {'message': e.toString()}
      };
    }
  }

  // 5. DELETE /api/v1/auth/account
  Future<bool> deleteAccount({String? reason}) async {
    try {
      final uri = Uri.parse('$baseUrl/api/v1/auth/account');
      final response = await http
          .delete(
            uri,
            headers: _buildHeaders(),
            body: jsonEncode({
              'confirmation': 'HAPUS',
              'reason': reason ?? 'Permintaan pengguna dari aplikasi mobile',
            }),
          )
          .timeout(const Duration(seconds: 5));

      return response.statusCode == 200;
    } catch (e) {
      debugPrint('[ApiClient] Error deleteAccount: $e');
      return false;
    }
  }
}
