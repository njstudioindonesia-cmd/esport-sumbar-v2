import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';
import 'primitives/glass_surface.dart';

enum GlassButtonVariant {
  primary,   // Brand Pink (#FF1752)
  gold,      // Status Gold (#D4AF37)
  secondary, // Matte Surface 2 (#14143A)
  outline,   // Thin Rim Border
  ghost,     // Transparent Surface
  danger,    // Functional Error Red (#F04438)
}

class GlassButton extends StatefulWidget {
  final String label;
  final IconData? icon;
  final VoidCallback? onPressed;
  final GlassButtonVariant variant;
  final bool isLoading;
  final double? width;
  final double height;
  final double borderRadius;
  final EdgeInsetsGeometry? padding;

  const GlassButton({
    super.key,
    required this.label,
    this.icon,
    this.onPressed,
    this.variant = GlassButtonVariant.primary,
    this.isLoading = false,
    this.width,
    this.height = 48.0,
    this.borderRadius = RadiusTokens.button,
    this.padding,
  });

  @override
  State<GlassButton> createState() => _GlassButtonState();
}

class _GlassButtonState extends State<GlassButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final isEnabled = widget.onPressed != null && !widget.isLoading;

    Color bgColor;
    Color fgColor;
    Color? borderColor;

    switch (widget.variant) {
      case GlassButtonVariant.primary:
        bgColor = isEnabled ? AppColors.brandPink : AppColors.brandPink.withValues(alpha: 0.4);
        fgColor = Colors.white;
        break;
      case GlassButtonVariant.gold:
        bgColor = isEnabled ? AppColors.gold : AppColors.gold.withValues(alpha: 0.4);
        fgColor = Colors.black;
        break;
      case GlassButtonVariant.secondary:
        bgColor = AppColors.surface2;
        fgColor = AppColors.textPrimary;
        borderColor = AppColors.borderSubtle;
        break;
      case GlassButtonVariant.outline:
        bgColor = Colors.transparent;
        fgColor = AppColors.textPrimary;
        borderColor = isEnabled ? Colors.white.withValues(alpha: 0.25) : Colors.white.withValues(alpha: 0.1);
        break;
      case GlassButtonVariant.ghost:
        bgColor = Colors.transparent;
        fgColor = AppColors.textSecondary;
        borderColor = Colors.transparent;
        break;
      case GlassButtonVariant.danger:
        bgColor = isEnabled ? AppColors.danger : AppColors.danger.withValues(alpha: 0.4);
        fgColor = Colors.white;
        break;
    }

    Widget content = Row(
      mainAxisSize: widget.width == null ? MainAxisSize.min : MainAxisSize.max,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (widget.isLoading) ...[
          SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2.2,
              valueColor: AlwaysStoppedAnimation<Color>(fgColor),
            ),
          ),
          const SizedBox(width: 10),
        ] else if (widget.icon != null) ...[
          Icon(widget.icon, size: 18, color: fgColor),
          const SizedBox(width: 8),
        ],
        Flexible(
          child: Text(
            widget.label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: fgColor,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );

    return AnimatedScale(
      scale: _isPressed ? 0.97 : 1.0,
      duration: MotionTokens.fast,
      curve: MotionTokens.curveSnappy,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: isEnabled ? (_) => setState(() => _isPressed = true) : null,
        onTap: isEnabled
            ? () {
                setState(() => _isPressed = false);
                HapticTokens.lightImpact();
                widget.onPressed?.call();
              }
            : null,
        onTapUp: isEnabled ? (_) => setState(() => _isPressed = false) : null,
        onTapCancel: () => setState(() => _isPressed = false),
        child: Container(
          width: widget.width,
          height: widget.height,
          padding: widget.padding ?? const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(widget.borderRadius),
            border: borderColor != null ? Border.all(color: borderColor, width: 1) : null,
            boxShadow: isEnabled
                ? const [
                    BoxShadow(
                      color: Color(0x28000000),
                      blurRadius: 4,
                      offset: Offset(0, 2),
                    )
                  ]
                : null,
          ),
          child: Center(child: content),
        ),
      ),
    );
  }
}
