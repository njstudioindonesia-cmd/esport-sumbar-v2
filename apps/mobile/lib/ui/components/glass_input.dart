import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';

class GlassInput extends StatefulWidget {
  final String? label;
  final String? hint;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final bool obscureText;
  final TextInputType keyboardType;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final String? errorText;
  final bool enabled;
  final int maxLines;

  const GlassInput({
    super.key,
    this.label,
    this.hint,
    String? hintText,
    this.controller,
    this.onChanged,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.prefixIcon,
    this.suffixIcon,
    this.errorText,
    this.enabled = true,
    this.maxLines = 1,
  }) : assert(hint == null || hintText == null, 'Cannot provide both hint and hintText');

  @override
  State<GlassInput> createState() => _GlassInputState();
}

class _GlassInputState extends State<GlassInput> {
  final FocusNode _focusNode = FocusNode();
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(() {
      setState(() => _isFocused = _focusNode.hasFocus);
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: widget.errorText != null
                  ? AppColors.danger
                  : (_isFocused ? AppColors.brandPink : AppColors.textSecondary),
            ),
          ),
          const SizedBox(height: 6),
        ],
        Container(
          decoration: BoxDecoration(
            color: AppColors.surface2,
            borderRadius: BorderRadius.circular(RadiusTokens.input),
            border: Border.all(
              color: widget.errorText != null
                  ? AppColors.danger
                  : (_isFocused ? AppColors.brandPink : AppColors.borderSubtle),
              width: _isFocused ? 1.5 : 1.0,
            ),
          ),
          child: TextField(
            focusNode: _focusNode,
            controller: widget.controller,
            onChanged: widget.onChanged,
            obscureText: widget.obscureText,
            keyboardType: widget.keyboardType,
            enabled: widget.enabled,
            maxLines: widget.maxLines,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              color: AppColors.textPrimary,
            ),
            cursorColor: AppColors.brandPink,
            decoration: InputDecoration(
              hintText: widget.hint,
              hintStyle: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                color: AppColors.textTertiary,
              ),
              prefixIcon: widget.prefixIcon,
              suffixIcon: widget.suffixIcon,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              border: InputBorder.none,
            ),
          ),
        ),
        if (widget.errorText != null) ...[
          const SizedBox(height: 4),
          Text(
            widget.errorText!,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: AppColors.danger,
            ),
          ),
        ],
      ],
    );
  }
}
