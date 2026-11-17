import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/colors.dart';
import '../../../core/theme/tokens.dart';
import '../../../core/services/catalog_service.dart';
import '../../../data/models/catalog_models.dart';
import '../../../data/models/profile_model.dart';
import '../../../data/repositories/profile_repository.dart';
import '../../components/glass_button.dart';
import '../../components/glass_card.dart';
import '../../components/glass_input.dart';
import '../../components/glass_header.dart';
import '../../components/glass_switch.dart';
import 'card_birth_screen.dart';

class WizardScreen extends StatefulWidget {
  final String entityType;
  final String entityTitle;

  const WizardScreen({
    super.key,
    required this.entityType,
    required this.entityTitle,
  });

  @override
  State<WizardScreen> createState() => _WizardScreenState();
}

class _WizardScreenState extends State<WizardScreen> {
  final CatalogService _catalogService = CatalogService();
  final ProfileRepository _profileRepo = ProfileRepository();

  int _currentStep = 0;
  bool _isLoading = false;
  String? _errorMessage;

  // Controllers Identitas
  final _nameController = TextEditingController();
  final _ignController = TextEditingController();
  final _bioController = TextEditingController();

  // Controllers Kontak & Lokasi
  final _phoneController = TextEditingController(text: '+62');
  final _addressController = TextEditingController();

  // Controllers Wali (<18)
  final _birthYearController = TextEditingController();
  final _guardianNameController = TextEditingController();
  final _guardianPhoneController = TextEditingController(text: '+62');

  // Privasi Field-Level
  bool _isPhonePublic = false;
  bool _isBioPublic = true;

  // Pilihan Katalog
  List<RegionModel> _regions = [];
  List<GameModel> _games = [];
  RegionModel? _selectedRegion;
  GameModel? _selectedGame;
  String? _selectedRole;

  @override
  void initState() {
    super.initState();
    _loadCatalogAndDraft();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _ignController.dispose();
    _bioController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _birthYearController.dispose();
    _guardianNameController.dispose();
    _guardianPhoneController.dispose();
    super.dispose();
  }

  Future<void> _loadCatalogAndDraft() async {
    final regionsFuture = _catalogService.getRegions();
    final gamesFuture = _catalogService.getGames();

    final results = await Future.wait([regionsFuture, gamesFuture]);

    if (!mounted) return;

    setState(() {
      _regions = results[0] as List<RegionModel>;
      _games = results[1] as List<GameModel>;

      if (_regions.isNotEmpty) {
        _selectedRegion = _regions.firstWhere(
          (r) => r.code == 'PDG',
          orElse: () => _regions.first,
        );
      }
      if (_games.isNotEmpty) {
        _selectedGame = _games.firstWhere(
          (g) => g.shortName == 'MLBB',
          orElse: () => _games.first,
        );
        if (_selectedGame!.roles.isNotEmpty) {
          _selectedRole = _selectedGame!.roles.first;
        }
      }
    });

    // Pulihkan draf jika tersedia
    final draft = _profileRepo.getDraft(widget.entityType);
    if (draft != null) {
      if (draft['displayName'] != null) _nameController.text = draft['displayName'] as String;
      if (draft['ign'] != null) _ignController.text = draft['ign'] as String;
      if (draft['bio'] != null) _bioController.text = draft['bio'] as String;
      if (draft['phone'] != null) _phoneController.text = draft['phone'] as String;
    }
  }

  void _saveCurrentDraft() {
    _profileRepo.saveDraft(widget.entityType, {
      'displayName': _nameController.text,
      'ign': _ignController.text,
      'bio': _bioController.text,
      'phone': _phoneController.text,
      'regionId': _selectedRegion?.id,
      'gameId': _selectedGame?.id,
      'role': _selectedRole,
    });
  }

  bool _isMinor() {
    final year = int.tryParse(_birthYearController.text.trim());
    if (year == null) return false;
    final currentYear = DateTime.now().year;
    return (currentYear - year) < 18;
  }

  void _nextStep() {
    HapticTokens.lightImpact();
    setState(() => _errorMessage = null);

    if (_currentStep == 0) {
      if (_nameController.text.trim().length < 2) {
        setState(() => _errorMessage = 'Nama wajib diisi minimal 2 karakter.');
        return;
      }
    } else if (_currentStep == 1) {
      final phone = _phoneController.text.trim();
      if (!phone.startsWith('+62') && !phone.startsWith('08')) {
        setState(() => _errorMessage = 'Nomor WhatsApp wajib menggunakan format +62 atau 08.');
        return;
      }
    } else if (_currentStep == 3) {
      if (_isMinor()) {
        if (_guardianNameController.text.trim().isEmpty) {
          setState(() => _errorMessage = 'Pengguna di bawah 18 tahun wajib mencantumkan nama wali.');
          return;
        }
      }
    }

    _saveCurrentDraft();

    if (_currentStep < 3) {
      setState(() => _currentStep++);
    } else {
      _submitForm();
    }
  }

  void _prevStep() {
    HapticTokens.lightImpact();
    setState(() => _errorMessage = null);
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    } else {
      Navigator.of(context).pop();
    }
  }

  Future<void> _submitForm() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final attributes = <String, dynamic>{
        'whatsapp': _phoneController.text.trim(),
        'isPhonePublic': _isPhonePublic,
        'isBioPublic': _isBioPublic,
      };

      if (widget.entityType == 'venue') {
        attributes['address'] = _addressController.text.trim();
      }

      if (_isMinor()) {
        attributes['guardian'] = {
          'name': _guardianNameController.text.trim(),
          'phone': _guardianPhoneController.text.trim(),
        };
      }

      final profile = await _profileRepo.createProfile(
        entityType: widget.entityType,
        displayName: _nameController.text.trim(),
        ign: _ignController.text.trim().isNotEmpty ? _ignController.text.trim() : null,
        regionId: _selectedRegion?.id ?? 'reg-pdg',
        mainGameId: _selectedGame?.id,
        roleName: _selectedRole,
        bio: _bioController.text.trim().isNotEmpty ? _bioController.text.trim() : null,
        attributes: attributes,
      );

      if (!mounted) return;

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => CardBirthScreen(profile: profile)),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: GlassHeader(
        title: 'FORMULIR ${widget.entityTitle.toUpperCase()}',
        subtitle: 'Tahap ${_currentStep + 1} dari 4: ${_getStepTitle()}',
        showBackButton: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Pratinjau Kartu Hidup (Floating Mini Card Preview)
            _buildLiveCardPreview(),

            // Indikator Progres 4 Tahap
            _buildStepIndicator(),

            // Form Konten per Tahap
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildStepContent(),
                    if (_errorMessage != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: EsportColors.error.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(RadiusTokens.md),
                          border: Border.all(color: EsportColors.error.withValues(alpha: 0.5)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline_rounded, color: EsportColors.error, size: 18),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: GoogleFonts.inter(fontSize: 12, color: Colors.white),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),

            // Tombol Navigasi Bawah
            _buildBottomButtons(),
          ],
        ),
      ),
    );
  }

  String _getStepTitle() {
    switch (_currentStep) {
      case 0:
        return 'Identitas Profil';
      case 1:
        return 'Domisili & Kontak';
      case 2:
        return 'Spesialisasi Game';
      case 3:
        return 'Privasi & Verifikasi';
      default:
        return '';
    }
  }

  Widget _buildLiveCardPreview() {
    final displayName = _nameController.text.trim().isNotEmpty ? _nameController.text.trim() : 'NAMA PROFIL';
    final ign = _ignController.text.trim().isNotEmpty ? _ignController.text.trim() : 'IGN / TAG';
    final regionName = _selectedRegion?.name ?? 'KOTA PADANG';
    final gameName = _selectedGame?.shortName ?? 'ESPORT';
    final role = _selectedRole ?? 'KOMPETITIF';

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: EsportColors.surfaceLight,
        borderRadius: BorderRadius.circular(RadiusTokens.lg),
        border: Border.all(color: EsportColors.gold.withValues(alpha: 0.4)),
        boxShadow: [
          BoxShadow(
            color: EsportColors.gold.withValues(alpha: 0.1),
            blurRadius: 16,
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: EsportColors.gold.withValues(alpha: 0.15),
              shape: BoxShape.circle,
              border: Border.all(color: EsportColors.gold, width: 1.5),
            ),
            child: Center(
              child: Text(
                displayName.isNotEmpty ? displayName[0].toUpperCase() : 'E',
                style: const TextStyle(color: EsportColors.gold, fontWeight: FontWeight.bold, fontSize: 18),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        ign,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.rajdhani(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: EsportColors.gold.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'ROOKIE',
                        style: GoogleFonts.inter(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: EsportColors.gold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  '$displayName • $regionName',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(fontSize: 11, color: EsportColors.textSecondary),
                ),
                Text(
                  '$gameName • $role',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(fontSize: 10, color: EsportColors.gold),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Row(
        children: List.generate(4, (index) {
          final isCompleted = index < _currentStep;
          final isCurrent = index == _currentStep;
          final Color color = isCurrent
              ? EsportColors.gold
              : isCompleted
                  ? EsportColors.verified
                  : EsportColors.surfaceLight;

          return Expanded(
            child: Container(
              height: 4,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return _buildStep1Identity();
      case 1:
        return _buildStep2LocationContact();
      case 2:
        return _buildStep3GameRole();
      case 3:
        return _buildStep4PrivacyVerification();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildStep1Identity() {
    final isOrg = ['team', 'venue', 'community', 'school', 'academy'].contains(widget.entityType);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          isOrg ? 'Identitas Organisasi / Lembaga' : 'Identitas Pribadi & Kompetitif',
          style: GoogleFonts.rajdhani(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 6),
        Text(
          'Data publik yang akan tercantum pada kartu profil Anda.',
          style: GoogleFonts.inter(fontSize: 12, color: EsportColors.textSecondary),
        ),
        const SizedBox(height: 20),
        GlassInput(
          label: isOrg ? 'Nama Terdaftar Entitas / Lembaga' : 'Nama Lengkap',
          hint: isOrg ? 'contoh: Padang Thunder Esports' : 'contoh: Fauzan Pratama',
          prefixIcon: Icon(isOrg ? Icons.business_rounded : Icons.person_outline_rounded, color: EsportColors.gold, size: 18),
          controller: _nameController,
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 16),
        GlassInput(
          label: isOrg ? 'Singkatan / Tag In-Game' : 'In-Game Name (IGN)',
          hint: isOrg ? 'contoh: PTH' : 'contoh: VIPER',
          prefixIcon: const Icon(Icons.badge_outlined, color: EsportColors.gold, size: 18),
          controller: _ignController,
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 16),
        GlassInput(
          label: 'Bio / Deskripsi Singkat',
          hint: 'Tuliskan deskripsi ringkas atau pencapaian...',
          prefixIcon: const Icon(Icons.notes_rounded, color: EsportColors.gold, size: 18),
          controller: _bioController,
          maxLines: 3,
        ),
      ],
    );
  }

  Widget _buildStep2LocationContact() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Domisili Wilayah & Kontak',
          style: GoogleFonts.rajdhani(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 6),
        Text(
          'Pilih Kota atau Kabupaten basis Anda di Sumatera Barat.',
          style: GoogleFonts.inter(fontSize: 12, color: EsportColors.textSecondary),
        ),
        const SizedBox(height: 20),

        // Dropdown Wilayah
        Text(
          'Kota / Kabupaten (Sumatera Barat)',
          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: EsportColors.surfaceLight,
            borderRadius: BorderRadius.circular(RadiusTokens.md),
            border: Border.all(color: Colors.white24),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<RegionModel>(
              isExpanded: true,
              value: _selectedRegion,
              dropdownColor: EsportColors.surface,
              icon: const Icon(Icons.arrow_drop_down, color: EsportColors.gold),
              items: _regions.map((r) {
                return DropdownMenuItem<RegionModel>(
                  value: r,
                  child: Text(
                    '${r.name} (${r.code})',
                    style: GoogleFonts.inter(fontSize: 13, color: Colors.white),
                  ),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) {
                  setState(() => _selectedRegion = val);
                }
              },
            ),
          ),
        ),

        const SizedBox(height: 16),

        // WhatsApp Format +62
        GlassInput(
          label: 'Nomor Kontak WhatsApp (+62)',
          hint: '+6281234567890',
          prefixIcon: const Icon(Icons.chat_rounded, color: EsportColors.gold, size: 18),
          controller: _phoneController,
          keyboardType: TextInputType.phone,
        ),

        if (widget.entityType == 'venue') ...[
          const SizedBox(height: 16),
          GlassInput(
            label: 'Alamat Lengkap / Patokan Lokasi Arena',
            hint: 'Jl. Khatib Sulaiman No. 12, Padang...',
            prefixIcon: const Icon(Icons.location_on_outlined, color: EsportColors.gold, size: 18),
            controller: _addressController,
            maxLines: 2,
          ),
        ],
      ],
    );
  }

  Widget _buildStep3GameRole() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Spesialisasi Game & Divisi',
          style: GoogleFonts.rajdhani(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 6),
        Text(
          'Katalog game dinamis aktif dari platform ESPORT SUMBAR.',
          style: GoogleFonts.inter(fontSize: 12, color: EsportColors.textSecondary),
        ),
        const SizedBox(height: 20),

        // Dropdown Game
        Text(
          'Game Utama',
          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: EsportColors.surfaceLight,
            borderRadius: BorderRadius.circular(RadiusTokens.md),
            border: Border.all(color: Colors.white24),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<GameModel>(
              isExpanded: true,
              value: _selectedGame,
              dropdownColor: EsportColors.surface,
              icon: const Icon(Icons.arrow_drop_down, color: EsportColors.gold),
              items: _games.map((g) {
                return DropdownMenuItem<GameModel>(
                  value: g,
                  child: Text(
                    '${g.name} (${g.genre.toUpperCase()})',
                    style: GoogleFonts.inter(fontSize: 13, color: Colors.white),
                  ),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) {
                  setState(() {
                    _selectedGame = val;
                    if (val.roles.isNotEmpty) {
                      _selectedRole = val.roles.first;
                    } else {
                      _selectedRole = null;
                    }
                  });
                }
              },
            ),
          ),
        ),

        const SizedBox(height: 16),

        // Dropdown Role Dinamis
        if (_selectedGame != null && _selectedGame!.roles.isNotEmpty) ...[
          Text(
            'Peran / Posisi Divisi',
            style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: EsportColors.surfaceLight,
              borderRadius: BorderRadius.circular(RadiusTokens.md),
              border: Border.all(color: Colors.white24),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                isExpanded: true,
                value: _selectedRole,
                dropdownColor: EsportColors.surface,
                icon: const Icon(Icons.arrow_drop_down, color: EsportColors.gold),
                items: _selectedGame!.roles.map((r) {
                  return DropdownMenuItem<String>(
                    value: r,
                    child: Text(r, style: GoogleFonts.inter(fontSize: 13, color: Colors.white)),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedRole = val);
                },
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildStep4PrivacyVerification() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Privasi & Kepatuhan Usia',
          style: GoogleFonts.rajdhani(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 6),
        Text(
          'Kendali penuh terhadap keterbukaan data Anda (UU PDP & Kebijakan Toko).',
          style: GoogleFonts.inter(fontSize: 12, color: EsportColors.textSecondary),
        ),
        const SizedBox(height: 20),

        // Toggle Kontak WhatsApp
        GlassCard(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              const Icon(Icons.lock_outline_rounded, color: EsportColors.gold, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Tampilkan Nomor WhatsApp Publik',
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white)),
                    const SizedBox(height: 2),
                    Text('Jika dinonaktifkan, kontak disembunyikan dari profil publik.',
                        style: GoogleFonts.inter(fontSize: 11, color: EsportColors.textSecondary)),
                  ],
                ),
              ),
              GlassSwitch(
                value: _isPhonePublic,
                onChanged: (val) => setState(() => _isPhonePublic = val),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Tahun Kelahiran (Perlindungan Minor < 18)
        GlassInput(
          label: 'Tahun Kelahiran (Opsional)',
          hint: 'contoh: 2008',
          prefixIcon: const Icon(Icons.calendar_today_rounded, color: EsportColors.gold, size: 18),
          controller: _birthYearController,
          keyboardType: TextInputType.number,
          onChanged: (_) => setState(() {}),
        ),

        if (_isMinor()) ...[
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: EsportColors.brandPink.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(RadiusTokens.md),
              border: Border.all(color: EsportColors.brandPink.withValues(alpha: 0.4)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.family_restroom_rounded, color: EsportColors.brandPink, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'Persetujuan Orang Tua / Wali',
                      style: GoogleFonts.rajdhani(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Berdasarkan tahun lahir, usia Anda di bawah 18 tahun. Sesuai kebijakan perlindungan pelajar, mohon lengkapi persetujuan wali.',
                  style: GoogleFonts.inter(fontSize: 11, height: 1.4, color: EsportColors.textSecondary),
                ),
                const SizedBox(height: 12),
                GlassInput(
                  label: 'Nama Lengkap Wali',
                  hint: 'Nama orang tua atau pembina',
                  controller: _guardianNameController,
                ),
                const SizedBox(height: 12),
                GlassInput(
                  label: 'Nomor WhatsApp Wali (+62)',
                  hint: '+6281234567890',
                  controller: _guardianPhoneController,
                  keyboardType: TextInputType.phone,
                ),
              ],
            ),
          ),
        ],

        const SizedBox(height: 20),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: EsportColors.verified.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(RadiusTokens.md),
            border: Border.all(color: EsportColors.verified.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              const Icon(Icons.shield_outlined, color: EsportColors.verified, size: 20),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Data aman: Tidak ada permintaan KTP, NIK, atau KK. Sesuai standar UU Perlindungan Data Pribadi.',
                  style: GoogleFonts.inter(fontSize: 11, height: 1.3, color: Colors.white70),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBottomButtons() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: EsportColors.surface,
        border: Border(top: BorderSide(color: Colors.white.withValues(alpha: 0.08))),
      ),
      child: Row(
        children: [
          if (_currentStep > 0) ...[
            Expanded(
              flex: 1,
              child: GlassButton(
                label: 'Kembali',
                variant: GlassButtonVariant.ghost,
                onPressed: _prevStep,
              ),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            flex: 2,
            child: GlassButton(
              label: _currentStep == 3 ? 'Terbitkan Kartu' : 'Lanjutkan',
              variant: GlassButtonVariant.primary,
              isLoading: _isLoading,
              icon: _currentStep == 3 ? Icons.credit_card_rounded : Icons.arrow_forward_rounded,
              onPressed: _nextStep,
            ),
          ),
        ],
      ),
    );
  }
}
