import 'package:flutter/material.dart';
import '../../core/theme/tokens.dart';
import 'primitives/glass_surface.dart';

class GlassSheet extends StatelessWidget {
  final Widget child;
  final double initialChildSize;
  final double minChildSize;
  final double maxChildSize;

  const GlassSheet({
    super.key,
    required this.child,
    this.initialChildSize = 0.55,
    this.minChildSize = 0.3,
    this.maxChildSize = 0.9,
  });

  static Future<T?> show<T>(
    BuildContext context, {
    required Widget child,
    double initialChildSize = 0.55,
  }) {
    HapticTokens.lightImpact();
    return showModalBottomSheet<T>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => GlassSheet(
        initialChildSize: initialChildSize,
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: initialChildSize,
      minChildSize: minChildSize,
      maxChildSize: maxChildSize,
      builder: (context, scrollController) {
        return GlassSurface(
          borderRadius: RadiusTokens.panel,
          blur: GlassBlur.thick,
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
          child: Column(
            children: [
              // Grab Handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(RadiusTokens.pill),
                  ),
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: child,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
