import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';
import 'glass_sheet.dart';

class GlassSelect<T> extends StatelessWidget {
  final String label;
  final String? placeholder;
  final T? value;
  final List<T> items;
  final String Function(T item) itemLabel;
  final ValueChanged<T> onSelected;

  const GlassSelect({
    super.key,
    required this.label,
    this.placeholder = 'Pilih salah satu...',
    required this.value,
    required this.items,
    required this.itemLabel,
    required this.onSelected,
  });

  void _showPicker(BuildContext context) {
    HapticTokens.lightImpact();
    GlassSheet.show(
      context,
      initialChildSize: 0.5,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: ListView.separated(
              itemCount: items.length,
              separatorBuilder: (_, __) => Divider(
                height: 1,
                thickness: 0.5,
                color: Colors.white.withValues(alpha: 0.06),
              ),
              itemBuilder: (context, index) {
                final item = items[index];
                final isSelected = item == value;

                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                  title: Text(
                    itemLabel(item),
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 14,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
                      color: isSelected ? AppColors.brandPink : AppColors.textPrimary,
                    ),
                  ),
                  trailing: isSelected
                      ? const Icon(Icons.check_rounded, color: AppColors.brandPink, size: 20)
                      : null,
                  onTap: () {
                    HapticTokens.selection();
                    onSelected(item);
                    Navigator.of(context).pop();
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 6),
        GestureDetector(
          onTap: () => _showPicker(context),
          child: Container(
            height: 48,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: AppColors.surface2,
              borderRadius: BorderRadius.circular(RadiusTokens.input),
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    value != null ? itemLabel(value as T) : (placeholder ?? ''),
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 14,
                      fontWeight: value != null ? FontWeight.w500 : FontWeight.w400,
                      color: value != null ? AppColors.textPrimary : AppColors.textTertiary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const Icon(
                  Icons.keyboard_arrow_down_rounded,
                  size: 20,
                  color: AppColors.textTertiary,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
