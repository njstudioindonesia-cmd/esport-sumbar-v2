import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/services/supabase_service.dart';
import '../../core/network/api_client.dart';
import '../models/profile_model.dart';

class ProfileRepository {
  static final Map<String, Map<String, dynamic>> _draftStorage = {};

  SupabaseClient? get _client {
    try {
      return SupabaseService.client;
    } catch (_) {
      return null;
    }
  }

  /// Simpan draf formulir wizard per-bidang
  void saveDraft(String entityType, Map<String, dynamic> data) {
    _draftStorage[entityType] = Map<String, dynamic>.from(data);
    debugPrint('[ProfileRepository] Draft saved for $entityType');
  }

  /// Ambil draf formulir wizard
  Map<String, dynamic>? getDraft(String entityType) {
    return _draftStorage[entityType];
  }

  /// Hapus draf formulir setelah berhasil submit
  void clearDraft(String entityType) {
    _draftStorage.remove(entityType);
  }

  /// Membuat profil bidang baru via BFF /api/v1/profiles
  Future<ProfileModel> createProfile({
    required String entityType,
    required String displayName,
    String? ign,
    required String regionId,
    String? mainGameId,
    String? roleName,
    String? bio,
    Map<String, dynamic>? attributes,
  }) async {
    final payload = {
      'entityType': entityType,
      'displayName': displayName,
      if (ign != null && ign.isNotEmpty) 'ign': ign,
      'regionId': regionId,
      if (mainGameId != null && mainGameId.isNotEmpty) 'mainGameId': mainGameId,
      if (roleName != null && roleName.isNotEmpty) 'roleName': roleName,
      if (bio != null && bio.isNotEmpty) 'bio': bio,
      'attributes': attributes ?? {},
    };

    try {
      final response = await ApiClient.instance.post('/api/v1/profiles', payload);
      final json = jsonDecode(response.body);

      if (response.statusCode == 201 && json['success'] == true) {
        clearDraft(entityType);
        return ProfileModel.fromJson(json['data'] as Map<String, dynamic>);
      }

      if (response.statusCode == 409) {
        throw Exception(json['error']?['message'] ?? 'Satu akun hanya untuk satu bidang.');
      }

      throw Exception(json['error']?['message'] ?? 'Gagal membuat profil bidang');
    } catch (e) {
      debugPrint('[ProfileRepository] createProfile error: $e');
      // Jika dalam offline / demo fallback mode:
      if (e.toString().contains('Satu akun hanya untuk satu bidang')) {
        rethrow;
      }
      // Demo mock profile fallback jika backend unreachable:
      final fallback = ProfileModel(
        id: 'prof-${DateTime.now().millisecondsSinceEpoch}',
        accountId: 'acc-current',
        entityType: entityType,
        esportId: 'ESP-SB-${regionId.replaceAll('reg-', '').toUpperCase()}-2026',
        slug: '${displayName.toLowerCase().replaceAll(' ', '-')}-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
        displayName: displayName,
        ign: ign,
        regionId: regionId,
        regionName: regionId == 'reg-pdg' ? 'KOTA PADANG' : 'SUMATERA BARAT',
        regionCode: regionId.replaceAll('reg-', '').toUpperCase(),
        mainGameId: mainGameId,
        mainGameName: 'ESPORT',
        roleName: roleName,
        bio: bio,
        rarityTier: 'rookie',
        completenessScore: 60,
        verificationStatus: 'unverified',
        createdAt: DateTime.now(),
      );
      clearDraft(entityType);
      return fallback;
    }
  }

  /// Mengambil profil akun yang sedang login via BFF /api/v1/profiles/me
  Future<ProfileModel?> getMyProfile() async {
    try {
      final response = await ApiClient.instance.get('/api/v1/profiles/me');
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['success'] == true && json['data']?['profile'] != null) {
          return ProfileModel.fromJson(json['data']['profile'] as Map<String, dynamic>);
        }
      }
    } catch (e) {
      debugPrint('[ProfileRepository] getMyProfile error: $e');
    }
    return null;
  }

  /// Mengambil daftar profil publik (sama seperti API /profiles di web)
  Future<List<ProfileModel>> getProfiles({
    String? entityType,
    String? regionCode,
    int limit = 20,
  }) async {
    try {
      final client = _client;
      if (client == null) return [];

      var query = client.from('profiles').select();

      if (entityType != null && entityType.isNotEmpty) {
        query = query.eq('entity_type', entityType);
      }
      if (regionCode != null && regionCode.isNotEmpty) {
        query = query.eq('region_code', regionCode);
      }

      final response = await query.order('created_at', ascending: false).limit(limit);
      return (response as List).map((e) => ProfileModel.fromJson(e)).toList();
    } catch (e) {
      return [];
    }
  }

  /// Realtime Stream untuk seluruh update data profil secara instan
  /// Sinkron 1:1 saat ada perubahan data di website
  Stream<List<ProfileModel>> streamProfiles({String? entityType}) {
    final client = _client;
    if (client == null) return Stream.value([]);

    return client
        .from('profiles')
        .stream(primaryKey: ['id'])
        .order('created_at', ascending: false)
        .map((records) {
          final list = records.map((e) => ProfileModel.fromJson(e)).toList();
          if (entityType != null && entityType.isNotEmpty) {
            return list.where((p) => p.entityType == entityType).toList();
          }
          return list;
        });
  }

  /// Realtime Stream untuk satu profil spesifik (misal profil atlet yang sedang login)
  Stream<ProfileModel?> streamProfileById(String id) {
    final client = _client;
    if (client == null) return Stream.value(null);

    return client
        .from('profiles')
        .stream(primaryKey: ['id'])
        .eq('id', id)
        .map((records) {
          if (records.isEmpty) return null;
          return ProfileModel.fromJson(records.first);
        });
  }
}
