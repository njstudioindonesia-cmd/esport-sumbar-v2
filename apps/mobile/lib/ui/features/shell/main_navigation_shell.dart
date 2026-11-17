import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/navigation/navigation_service.dart';
import '../../components/glass_tab_bar.dart';
import '../home/home_screen.dart';
import '../directory/directory_screen.dart';
import '../card/card_wallet_screen.dart';
import '../ecosystem/ecosystem_screen.dart';
import '../profile/profile_screen.dart';

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  DateTime? _lastBackPressTime;

  static const List<Widget> _screens = [
    HomeScreen(),
    DirectoryScreen(),
    CardWalletScreen(),
    EcosystemScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: NavigationService.instance.currentTabNotifier,
      builder: (context, currentTab, _) {
        return PopScope(
          canPop: false,
          onPopInvokedWithResult: (didPop, result) {
            if (didPop) return;

            // Jika tidak di Tab 0 (Beranda), tekan back akan mengembalikan ke Tab 0
            if (currentTab != 0) {
              NavigationService.instance.switchTab(0);
              return;
            }

            // Jika di Tab 0, tekan 2x untuk keluar
            final now = DateTime.now();
            if (_lastBackPressTime == null ||
                now.difference(_lastBackPressTime!) > const Duration(seconds: 2)) {
              _lastBackPressTime = now;
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Tekan sekali lagi untuk keluar dari aplikasi.'),
                  duration: Duration(seconds: 2),
                ),
              );
              return;
            }

            // Keluar aplikasi Android
            SystemNavigator.pop();
          },
          child: Scaffold(
            body: Stack(
              children: [
                // Lapisan Layar Tab (IndexedStack menjaga state & posisi scroll)
                IndexedStack(
                  index: currentTab,
                  children: _screens,
                ),

                // Tab Bar Kaca Melayang di Bawah
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  child: GlassTabBar(
                    currentIndex: currentTab,
                    onTabSelected: (index) {
                      NavigationService.instance.switchTab(index);
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
