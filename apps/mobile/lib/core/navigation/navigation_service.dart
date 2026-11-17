import 'dart:async';
import 'package:flutter/material.dart';
import 'package:app_links/app_links.dart';

class NavigationService {
  NavigationService._();
  static final NavigationService instance = NavigationService._();

  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  late final AppLinks _appLinks;
  StreamSubscription<Uri>? _linkSubscription;

  final ValueNotifier<int> currentTabNotifier = ValueNotifier<int>(0);

  // Inisialisasi Deep Linking
  Future<void> initialize() async {
    _appLinks = AppLinks();

    // 1. Tangani initial link saat cold start
    try {
      final initialUri = await _appLinks.getInitialLink();
      if (initialUri != null) {
        handleUri(initialUri);
      }
    } catch (e) {
      debugPrint('[NavigationService] Error getting initial link: $e');
    }

    // 2. Dengarkan stream link saat aplikasi sedang berjalan (warm/hot)
    _linkSubscription = _appLinks.uriLinkStream.listen(
      (uri) {
        handleUri(uri);
      },
      onError: (err) {
        debugPrint('[NavigationService] Deep link stream error: $err');
      },
    );
  }

  void handleUri(Uri uri) {
    debugPrint('[NavigationService] Received Deep Link: $uri');

    // Validasi skema: Hanya terima esportsumbar:// atau domain terpercaya esportsumbar.com
    final isCustomScheme = uri.scheme == 'esportsumbar';
    final isUniversalLink = (uri.scheme == 'https' || uri.scheme == 'http') &&
        (uri.host == 'esportsumbar.com' || uri.host == 'www.esportsumbar.com');

    if (!isCustomScheme && !isUniversalLink) {
      debugPrint('[NavigationService] Rejected invalid deep link origin: $uri');
      return;
    }

    String path = uri.path;
    if (isUniversalLink && path.startsWith('/app')) {
      path = path.replaceFirst('/app', '');
    }

    // Normalisasi jalur jika berasal dari esportsumbar://path atau esportsumbar://host
    if (isCustomScheme && path.isEmpty && uri.host.isNotEmpty) {
      path = '/${uri.host}';
    }

    debugPrint('[NavigationService] Resolved internal path: $path');

    switch (path) {
      case '':
      case '/':
      case '/home':
        switchTab(0);
        break;
      case '/explore':
        switchTab(1);
        break;
      case '/card':
        switchTab(2);
        break;
      case '/ecosystem':
        switchTab(3);
        break;
      case '/profile':
        switchTab(4);
        break;
      case '/notifications':
        navigateTo('/notifications');
        break;
      case '/intro':
        navigateTo('/intro');
        break;
      case '/sign-in':
        navigateTo('/sign-in');
        break;
      case '/sign-up':
        navigateTo('/sign-up');
        break;
      case '/entity-selection':
        navigateTo('/entity-selection');
        break;
      case '/settings':
        navigateTo('/settings');
        break;
      case '/design-exploration':
        navigateTo('/design-exploration');
        break;
      case '/system/maintenance':
        navigateTo('/system/maintenance');
        break;
      case '/system/update':
        navigateTo('/system/update');
        break;
      default:
        if (path.startsWith('/p/')) {
          // Profil spesifik
          final slug = path.replaceFirst('/p/', '');
          navigateTo('/profile/$slug');
        } else {
          navigateTo('/404');
        }
        break;
    }
  }

  void switchTab(int index) {
    currentTabNotifier.value = index;
    // Jika ada modal/screen di atas navigation shell, pop sampai root
    navigatorKey.currentState?.popUntil((route) => route.isFirst);
  }

  void navigateTo(String routeName, {Object? arguments}) {
    navigatorKey.currentState?.pushNamed(routeName, arguments: arguments);
  }

  void dispose() {
    _linkSubscription?.cancel();
    currentTabNotifier.dispose();
  }
}
