import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/theme/tokens.dart';
import 'core/theme/effect_engine.dart';
import 'core/services/supabase_service.dart';
import 'core/navigation/navigation_service.dart';
import 'ui/features/shell/main_navigation_shell.dart';
import 'ui/features/auth/splash_screen.dart';
import 'ui/features/auth/onboarding_intro_screen.dart';
import 'ui/features/auth/sign_in_screen.dart';
import 'ui/features/auth/sign_up_screen.dart';
import 'ui/features/onboarding/entity_selection_screen.dart';
import 'ui/features/system/notification_center_screen.dart';
import 'ui/features/system/settings_screen.dart';
import 'ui/features/system/maintenance_screen.dart';
import 'ui/features/system/force_update_screen.dart';
import 'ui/features/system/not_found_screen.dart';
import 'ui/features/gallery/component_gallery_screen.dart';
import 'ui/features/skeleton/connection_test_screen.dart';
import 'ui/features/design_exploration/design_exploration_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Inisialisasi Supabase Realtime Client
  await SupabaseService.initialize();

  // 2. Inisialisasi Mesin Efek Adaptif
  await EffectEngine.instance.initialize();

  // 3. Inisialisasi Deep Linking & Router
  await NavigationService.instance.initialize();

  runApp(const EsportSumbarApp());
}

class EsportSumbarApp extends StatelessWidget {
  const EsportSumbarApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ESPORT SUMBAR V3',
      debugShowCheckedModeBanner: false,
      navigatorKey: NavigationService.instance.navigatorKey,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.inkBase,
        primaryColor: AppColors.brandPink,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.brandPink,
          surface: AppColors.surface1,
          onSurface: AppColors.textPrimary,
          error: AppColors.danger,
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          ThemeData.dark().textTheme,
        ),
      ),
      home: const SplashScreen(),
      routes: {
        '/home': (context) => const MainNavigationShell(),
        '/splash': (context) => const SplashScreen(),
        '/intro': (context) => const OnboardingIntroScreen(),
        '/sign-in': (context) => const SignInScreen(),
        '/sign-up': (context) => const SignUpScreen(),
        '/entity-selection': (context) => const EntitySelectionScreen(),
        '/notifications': (context) => const NotificationCenterScreen(),
        '/settings': (context) => const SettingsScreen(),
        '/gallery': (context) => const ComponentGalleryScreen(),
        '/design-exploration': (context) => const DesignExplorationScreen(),
        '/diagnostics': (context) => const ConnectionTestScreen(),
        '/system/maintenance': (context) => const MaintenanceScreen(),
        '/system/update': (context) => const ForceUpdateScreen(),
        '/404': (context) => const NotFoundScreen(),
      },
      onUnknownRoute: (settings) => MaterialPageRoute(
        builder: (context) => const NotFoundScreen(),
      ),
    );
  }
}
