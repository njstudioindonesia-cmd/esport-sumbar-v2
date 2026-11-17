import 'package:flutter/material.dart';
import '../../core/theme/tokens.dart';

class GlassSwitch extends StatelessWidget {
  final bool value;
  final ValueChanged<bool> onChanged;

  const GlassSwitch({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        HapticTokens.lightImpact();
        onChanged(!value);
      },
      child: AnimatedContainer(
        duration: MotionTokens.fast,
        curve: MotionTokens.curveFluid,
        width: 52,
        height: 30,
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(
          color: value ? AppColors.brandPink : AppColors.surface2,
          borderRadius: BorderRadius.circular(RadiusTokens.pill),
          border: Border.all(
            color: value ? AppColors.brandPink : AppColors.borderSubtle,
            width: 1.0,
          ),
          boxShadow: const [
            BoxShadow(
              color: Color(0x28000000),
              blurRadius: 4,
              offset: Offset(0, 1),
            ),
          ],
        ),
        child: AnimatedAlign(
          duration: MotionTokens.fast,
          curve: MotionTokens.curveFluid,
          alignment: value ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            width: 22,
            height: 22,
            decoration: const BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: Color(0x33000000),
                  blurRadius: 3,
                  offset: Offset(0, 1),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
