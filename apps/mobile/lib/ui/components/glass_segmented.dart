import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';

class GlassSegmented<T> extends StatelessWidget {
  final List<T> values;
  final List<String> labels;
  final T selectedValue;
  final ValueChanged<T> onSelected;

  const GlassSegmented({
    super.key,
    required this.values,
    required this.labels,
    required this.selectedValue,
    required this.onSelected,
  }) : assert(values.length == labels.length);

  @override
  Widget build(BuildContext context) {
    final selectedIndex = values.indexOf(selectedValue);

    return Container(
      height: 44,
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        color: AppColors.surface2,
        borderRadius: BorderRadius.circular(RadiusTokens.pill),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final itemWidth = constraints.maxWidth / values.length;

          return Stack(
            children: [
              // Lensa indikator aktif (Permukaan Matte Terangkat, Tanpa Gold)
              AnimatedPositioned(
                duration: MotionTokens.fast,
                curve: MotionTokens.curveFluid,
                left: selectedIndex * itemWidth,
                top: 0,
                width: itemWidth,
                height: constraints.maxHeight,
                child: Container(
                  decoration: BoxDecoration(
                    color: AppColors.surface3,
                    borderRadius: BorderRadius.circular(RadiusTokens.pill),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.15),
                      width: 1.0,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x33000000),
                        blurRadius: 4,
                        offset: Offset(0, 1),
                      ),
                    ],
                  ),
                ),
              ),

              // Item tombol segmen
              Row(
                children: List.generate(values.length, (index) {
                  final isSelected = index == selectedIndex;
                  return Expanded(
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () {
                        HapticTokens.selection();
                        onSelected(values[index]);
                      },
                      child: Center(
                        child: Text(
                          labels[index],
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 13,
                            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                            color: isSelected ? AppColors.textPrimary : AppColors.textSecondary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ],
          );
        },
      ),
    );
  }
}
