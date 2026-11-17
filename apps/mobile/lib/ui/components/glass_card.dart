import 'package:flutter/material.dart';
import '../../core/theme/tokens.dart';
import 'primitives/glass_surface.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final VoidCallback? onTap;
  final GlassBlur blur;

  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.margin,
    this.borderRadius = RadiusTokens.card,
    this.onTap,
    this.blur = GlassBlur.regular,
  });

  @override
  Widget build(BuildContext context) {
    return GlassSurface(
      margin: margin,
      padding: padding,
      borderRadius: borderRadius,
      blur: blur,
      hasRim: true,
      enableScrim: true,
      onTap: onTap,
      child: child,
    );
  }
}
