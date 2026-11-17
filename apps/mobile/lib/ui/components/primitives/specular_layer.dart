import 'package:flutter/material.dart';
import '../../../core/theme/effect_engine.dart';

class SpecularLayer extends StatelessWidget {
  final Offset position;
  final double radius;
  final double opacity;

  const SpecularLayer({
    super.key,
    required this.position,
    this.radius = 160.0,
    this.opacity = 0.25,
  });

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: EffectEngine.instance,
      builder: (context, _) {
        final tier = EffectEngine.instance.currentTier;

        // Pada Mode Hemat atau Standar hemat, pantulan specular dinonaktifkan
        if (tier != EffectTier.full) {
          return const SizedBox.shrink();
        }

        return Positioned(
          left: position.dx - radius,
          top: position.dy - radius,
          width: radius * 2,
          height: radius * 2,
          child: IgnorePointer(
            child: Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    Colors.white.withValues(alpha: opacity),
                    Colors.white.withValues(alpha: 0.0),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
