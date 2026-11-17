import 'package:flutter/material.dart';
import '../../../core/theme/tokens.dart';
import '../../../core/theme/effect_engine.dart';

class SceneBackground extends StatelessWidget {
  final Widget child;

  const SceneBackground({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: EffectEngine.instance,
      builder: (context, _) {
        final tier = EffectEngine.instance.currentTier;

        // Mode Hemat: Warna obsidian solid murni tanpa radial gradient kalkulasi tinggi
        if (tier == EffectTier.powerSaver) {
          return Container(
            color: EsportColors.background,
            child: child,
          );
        }

        // Mode Penuh & Standar: Ambient glow halus bernuansa Midnight Navy & Pink Minang
        return Container(
          decoration: const BoxDecoration(
            color: EsportColors.background,
            gradient: RadialGradient(
              center: Alignment(0.7, -0.6),
              radius: 1.2,
              colors: [
                Color(0x2E00004F), // Brand navy glow
                Color(0x1AFF1752), // Brand pink subtle accent
                EsportColors.background,
              ],
              stops: [0.0, 0.45, 1.0],
            ),
          ),
          child: child,
        );
      },
    );
  }
}
