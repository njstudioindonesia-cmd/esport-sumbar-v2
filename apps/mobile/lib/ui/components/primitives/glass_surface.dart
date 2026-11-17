import 'dart:ui';
import 'package:flutter/material.dart';
import '../../../core/theme/tokens.dart';
import '../../../core/theme/effect_engine.dart';

enum GlassBlur { thin, regular, thick }

class GlassSurface extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final GlassBlur blur;
  final Color? backgroundColor;
  final bool hasRim;
  final bool enableScrim;
  final VoidCallback? onTap;

  const GlassSurface({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius = RadiusTokens.card,
    this.blur = GlassBlur.regular,
    this.backgroundColor,
    this.hasRim = true,
    this.enableScrim = true,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: EffectEngine.instance,
      builder: (context, _) {
        final tier = EffectEngine.instance.currentTier;

        // 1. Mode Hemat (Power Saver): Tanpa BackdropFilter, render solid super cepat
        if (tier == EffectTier.powerSaver) {
          Widget content = Container(
            width: width,
            height: height,
            margin: margin,
            padding: padding,
            decoration: BoxDecoration(
              color: backgroundColor ?? GlassTokens.solidSurface,
              borderRadius: BorderRadius.circular(borderRadius),
              border: Border.all(
                color: EsportColors.borderSubtle,
                width: 1.0,
              ),
            ),
            child: child,
          );

          if (onTap != null) {
            return GestureDetector(
              onTap: () {
                HapticTokens.lightImpact();
                onTap!();
              },
              child: content,
            );
          }
          return content;
        }

        // 2. Mode Penuh & Standar: Glassmorphism adaptif
        final double sigma = tier == EffectTier.standard
            ? GlassTokens.blurThin
            : (blur == GlassBlur.thick
                ? GlassTokens.blurThick
                : (blur == GlassBlur.thin ? GlassTokens.blurThin : GlassTokens.blurRegular));

        final Color bg = backgroundColor ??
            (blur == GlassBlur.thick
                ? GlassTokens.bgThick
                : (blur == GlassBlur.thin ? GlassTokens.bgThin : GlassTokens.bgRegular));

        Widget glassBox = ClipRRect(
          borderRadius: BorderRadius.circular(borderRadius),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: sigma, sigmaY: sigma),
            child: Container(
              width: width,
              height: height,
              padding: padding,
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(borderRadius),
                border: hasRim
                    ? Border.all(
                        color: Colors.white.withAlpha(tier == EffectTier.full ? 40 : 25),
                        width: 1.0,
                      )
                    : null,
                gradient: hasRim && tier == EffectTier.full
                    ? LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Colors.white.withAlpha(35),
                          Colors.white.withAlpha(8),
                          Colors.white.withAlpha(2),
                          Colors.white.withAlpha(20),
                        ],
                        stops: const [0.0, 0.3, 0.7, 1.0],
                      )
                    : null,
              ),
              child: enableScrim
                  ? Container(
                      decoration: BoxDecoration(
                        color: GlassTokens.scrim,
                        borderRadius: BorderRadius.circular(
                          RadiusTokens.inner(borderRadius, 1.0),
                        ),
                      ),
                      child: child,
                    )
                  : child,
            ),
          ),
        );

        if (margin != null) {
          glassBox = Padding(padding: margin!, child: glassBox);
        }

        if (onTap != null) {
          return GestureDetector(
            onTap: () {
              HapticTokens.lightImpact();
              onTap!();
            },
            child: glassBox,
          );
        }

        return glassBox;
      },
    );
  }
}
