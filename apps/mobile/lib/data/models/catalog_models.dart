class GameRoleModel {
  final String id;
  final String roleName;
  final String? description;
  final int sortOrder;

  const GameRoleModel({
    required this.id,
    required this.roleName,
    this.description,
    required this.sortOrder,
  });

  factory GameRoleModel.fromJson(Map<String, dynamic> json) {
    return GameRoleModel(
      id: json['id'] as String? ?? '',
      roleName: json['roleName'] as String? ?? json['role_name'] as String? ?? '',
      description: json['description'] as String?,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? (json['sort_order'] as num?)?.toInt() ?? 0,
    );
  }
}

class GameModel {
  final String id;
  final String name;
  final String shortName;
  final String slug;
  final String genre;
  final String platform;
  final List<String> roles;
  final List<GameRoleModel> rolesList;
  final List<String> ranks;
  final bool isActive;

  const GameModel({
    required this.id,
    required this.name,
    required this.shortName,
    required this.slug,
    required this.genre,
    required this.platform,
    this.roles = const [],
    this.rolesList = const [],
    this.ranks = const [],
    this.isActive = true,
  });

  factory GameModel.fromJson(Map<String, dynamic> json) {
    final rawRoles = json['roles'] as List<dynamic>? ?? [];
    final rawRolesList = json['rolesList'] as List<dynamic>? ?? [];
    final rawRanks = json['ranks'] as List<dynamic>? ?? [];

    return GameModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      shortName: json['shortName'] as String? ?? json['short_name'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      genre: json['genre'] as String? ?? 'moba',
      platform: json['platform'] as String? ?? 'mobile',
      roles: rawRoles.map((e) => e.toString()).toList(),
      rolesList: rawRolesList.map((e) => GameRoleModel.fromJson(e as Map<String, dynamic>)).toList(),
      ranks: rawRanks.map((e) => e.toString()).toList(),
      isActive: json['isActive'] as bool? ?? json['is_active'] as bool? ?? true,
    );
  }
}

class RegionModel {
  final String id;
  final String name;
  final String code;
  final String slug;
  final String type; // 'kota' | 'kabupaten'
  final bool isPilot;

  const RegionModel({
    required this.id,
    required this.name,
    required this.code,
    required this.slug,
    required this.type,
    this.isPilot = false,
  });

  factory RegionModel.fromJson(Map<String, dynamic> json) {
    return RegionModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      code: json['code'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      type: json['type'] as String? ?? 'kabupaten',
      isPilot: json['isPilot'] as bool? ?? json['is_pilot'] as bool? ?? false,
    );
  }
}
