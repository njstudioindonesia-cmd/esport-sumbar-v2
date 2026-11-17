class ProfileModel {
  final String id;
  final String accountId;
  final String entityType;
  final String esportId;
  final String slug;
  final String displayName;
  final String? ign;
  final String regionId;
  final String regionName;
  final String regionCode;
  final String? mainGameId;
  final String? mainGameName;
  final String? roleName;
  final String? avatarUrl;
  final String? coverUrl;
  final String? bio;
  final String rarityTier;
  final int completenessScore;
  final String verificationStatus;
  final String? verifiedBadgeNo;
  final DateTime createdAt;

  ProfileModel({
    required this.id,
    required this.accountId,
    required this.entityType,
    required this.esportId,
    required this.slug,
    required this.displayName,
    this.ign,
    required this.regionId,
    required this.regionName,
    required this.regionCode,
    this.mainGameId,
    this.mainGameName,
    this.roleName,
    this.avatarUrl,
    this.coverUrl,
    this.bio,
    required this.rarityTier,
    required this.completenessScore,
    required this.verificationStatus,
    this.verifiedBadgeNo,
    required this.createdAt,
  });

  factory ProfileModel.fromJson(Map<String, dynamic> json) {
    return ProfileModel(
      id: json['id'] as String? ?? '',
      accountId: json['account_id'] as String? ?? '',
      entityType: json['entity_type'] as String? ?? 'player',
      esportId: json['esport_id'] as String? ?? 'ESP-SB-0000',
      slug: json['slug'] as String? ?? '',
      displayName: json['display_name'] as String? ?? 'Unnamed Athlete',
      ign: json['ign'] as String?,
      regionId: json['region_id'] as String? ?? '',
      regionName: json['region_name'] as String? ?? 'Sumatera Barat',
      regionCode: json['region_code'] as String? ?? 'SB',
      mainGameId: json['main_game_id'] as String?,
      mainGameName: json['main_game_name'] as String?,
      roleName: json['role_name'] as String?,
      avatarUrl: json['avatar_url'] as String?,
      coverUrl: json['cover_url'] as String?,
      bio: json['bio'] as String?,
      rarityTier: json['rarity_tier'] as String? ?? 'rookie',
      completenessScore: (json['completeness_score'] as num?)?.toInt() ?? 0,
      verificationStatus: json['verification_status'] as String? ?? 'unverified',
      verifiedBadgeNo: json['verified_badge_no'] as String?,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'account_id': accountId,
      'entity_type': entityType,
      'esport_id': esportId,
      'slug': slug,
      'display_name': displayName,
      'ign': ign,
      'region_id': regionId,
      'region_name': regionName,
      'region_code': regionCode,
      'main_game_id': mainGameId,
      'main_game_name': mainGameName,
      'role_name': roleName,
      'avatar_url': avatarUrl,
      'cover_url': coverUrl,
      'bio': bio,
      'rarity_tier': rarityTier,
      'completeness_score': completenessScore,
      'verification_status': verificationStatus,
      'verified_badge_no': verifiedBadgeNo,
      'created_at': createdAt.toIso8601String(),
    };
  }

  bool get isVerified => verificationStatus == 'verified';
}
