import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../network/api_client.dart';
import '../../data/models/catalog_models.dart';

class CatalogService {
  final ApiClient _apiClient;

  CatalogService({ApiClient? apiClient}) : _apiClient = apiClient ?? ApiClient.instance;

  /// Mengambil daftar game aktif dari BFF dengan fallback offline
  Future<List<GameModel>> getGames() async {
    try {
      final response = await _apiClient.get('/api/v1/catalog/games');
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        if (decoded['success'] == true && decoded['data'] is List) {
          final list = (decoded['data'] as List)
              .map((item) => GameModel.fromJson(item as Map<String, dynamic>))
              .toList();
          if (list.isNotEmpty) return list;
        }
      }
    } catch (e) {
      debugPrint('[CatalogService] Warning fetching games from BFF: $e');
    }
    return _fallbackGames;
  }

  /// Mengambil 19 Kota & Kabupaten di Sumatera Barat dari BFF dengan fallback offline
  Future<List<RegionModel>> getRegions() async {
    try {
      final response = await _apiClient.get('/api/v1/catalog/regions');
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        if (decoded['success'] == true && decoded['data'] is List) {
          final list = (decoded['data'] as List)
              .map((item) => RegionModel.fromJson(item as Map<String, dynamic>))
              .toList();
          if (list.isNotEmpty) return list;
        }
      }
    } catch (e) {
      debugPrint('[CatalogService] Warning fetching regions from BFF: $e');
    }
    return _fallbackRegions;
  }

  static const List<GameModel> _fallbackGames = [
    GameModel(
      id: 'game-hok',
      name: 'Honor of Kings',
      shortName: 'HOK',
      slug: 'honor-of-kings',
      genre: 'moba',
      platform: 'mobile',
      roles: ['Clash Lane', 'Jungle', 'Mid Lane', 'Farm Lane', 'Roam'],
      ranks: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Mythic'],
    ),
    GameModel(
      id: 'game-mlbb',
      name: 'Mobile Legends: Bang Bang',
      shortName: 'MLBB',
      slug: 'mlbb',
      genre: 'moba',
      platform: 'mobile',
      roles: ['Gold Lane', 'EXP Lane', 'Mid Lane', 'Jungler', 'Roamer'],
      ranks: ['Warrior', 'Elite', 'Master', 'Grandmaster', 'Epic', 'Legend', 'Mythic', 'Mythical Glory'],
    ),
    GameModel(
      id: 'game-ff',
      name: 'Free Fire',
      shortName: 'FF',
      slug: 'free-fire',
      genre: 'battle_royale',
      platform: 'mobile',
      roles: ['Rusher', 'Flanker', 'Sniper', 'Support'],
      ranks: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Heroic', 'Grandmaster'],
    ),
    GameModel(
      id: 'game-pubgm',
      name: 'PUBG Mobile',
      shortName: 'PUBGM',
      slug: 'pubgm',
      genre: 'battle_royale',
      platform: 'mobile',
      roles: ['In-Game Leader (IGL)', 'Fragger / Rusher', 'Scout', 'Support / Medic'],
      ranks: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown', 'Ace', 'Conqueror'],
    ),
    GameModel(
      id: 'game-val',
      name: 'Valorant',
      shortName: 'Valorant',
      slug: 'valorant',
      genre: 'fps',
      platform: 'pc',
      roles: ['Duelist', 'Initiator', 'Controller', 'Sentinel'],
      ranks: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'],
    ),
  ];

  static const List<RegionModel> _fallbackRegions = [
    // 7 Kota
    RegionModel(id: 'reg-pdg', name: 'Kota Padang', code: 'PDG', slug: 'kota-padang', type: 'kota', isPilot: true),
    RegionModel(id: 'reg-bkt', name: 'Kota Bukittinggi', code: 'BKT', slug: 'kota-bukittinggi', type: 'kota', isPilot: true),
    RegionModel(id: 'reg-pyk', name: 'Kota Payakumbuh', code: 'PYK', slug: 'kota-payakumbuh', type: 'kota', isPilot: true),
    RegionModel(id: 'reg-sol', name: 'Kota Solok', code: 'SOL', slug: 'kota-solok', type: 'kota'),
    RegionModel(id: 'reg-pp', name: 'Kota Padang Panjang', code: 'PP', slug: 'kota-padang-panjang', type: 'kota'),
    RegionModel(id: 'reg-prk', name: 'Kota Pariaman', code: 'PRK', slug: 'kota-pariaman', type: 'kota'),
    RegionModel(id: 'reg-swl', name: 'Kota Sawahlunto', code: 'SWL', slug: 'kota-sawahlunto', type: 'kota'),
    // 12 Kabupaten
    RegionModel(id: 'reg-pdp', name: 'Kabupaten Padang Pariaman', code: 'PDP', slug: 'kab-padang-pariaman', type: 'kabupaten'),
    RegionModel(id: 'reg-agm', name: 'Kabupaten Agam', code: 'AGM', slug: 'kab-agam', type: 'kabupaten'),
    RegionModel(id: 'reg-lkt', name: 'Kabupaten Lima Puluh Kota', code: 'LKT', slug: 'kab-lima-puluh-kota', type: 'kabupaten'),
    RegionModel(id: 'reg-tdt', name: 'Kabupaten Tanah Datar', code: 'TDT', slug: 'kab-tanah-datar', type: 'kabupaten'),
    RegionModel(id: 'reg-psb', name: 'Kabupaten Pasaman Barat', code: 'PSB', slug: 'kab-pasaman-barat', type: 'kabupaten'),
    RegionModel(id: 'reg-pas', name: 'Kabupaten Pasaman', code: 'PAS', slug: 'kab-pasaman', type: 'kabupaten'),
    RegionModel(id: 'reg-pss', name: 'Kabupaten Pesisir Selatan', code: 'PSS', slug: 'kab-pesisir-selatan', type: 'kabupaten'),
    RegionModel(id: 'reg-slk', name: 'Kabupaten Solok', code: 'SLK', slug: 'kab-solok', type: 'kabupaten'),
    RegionModel(id: 'reg-sls', name: 'Kabupaten Solok Selatan', code: 'SLS', slug: 'kab-solok-selatan', type: 'kabupaten'),
    RegionModel(id: 'reg-sjj', name: 'Kabupaten Sijunjung', code: 'SJJ', slug: 'kab-sijunjung', type: 'kabupaten'),
    RegionModel(id: 'reg-dmr', name: 'Kabupaten Dharmasraya', code: 'DMR', slug: 'kab-dharmasraya', type: 'kabupaten'),
    RegionModel(id: 'reg-mtw', name: 'Kabupaten Kepulauan Mentawai', code: 'MTW', slug: 'kab-kepulauan-mentawai', type: 'kabupaten'),
  ];
}
