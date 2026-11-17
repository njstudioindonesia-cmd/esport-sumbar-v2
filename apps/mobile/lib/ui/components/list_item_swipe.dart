import 'package:flutter/material.dart';
import '../../core/theme/tokens.dart';
import 'primitives/glass_surface.dart';

class ListItemSwipe extends StatelessWidget {
  final Widget child;
  final VoidCallback onAccept;
  final VoidCallback onReject;
  final String acceptLabel;
  final String rejectLabel;

  const ListItemSwipe({
    super.key,
    required this.child,
    required this.onAccept,
    required this.onReject,
    this.acceptLabel = 'Terima',
    this.rejectLabel = 'Tolak',
  });

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: UniqueKey(),
      direction: DismissDirection.horizontal,
      confirmDismiss: (direction) async {
        if (direction == DismissDirection.startToEnd) {
          HapticTokens.mediumImpact();
          onAccept();
          return false; // Tetap dipertahankan atau dikelola oleh parent
        } else {
          HapticTokens.mediumImpact();
          onReject();
          return false;
        }
      },
      background: Container(
        alignment: Alignment.centerLeft,
        padding: const EdgeInsets.only(left: 20),
        decoration: BoxDecoration(
          color: EsportColors.regional.withValues(alpha: 0.25),
          borderRadius: BorderRadius.circular(RadiusTokens.card),
        ),
        child: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: EsportColors.regional),
            const SizedBox(width: 8),
            Text(
              acceptLabel,
              style: const TextStyle(color: EsportColors.regional, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
      secondaryBackground: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: EsportColors.error.withValues(alpha: 0.25),
          borderRadius: BorderRadius.circular(RadiusTokens.card),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Text(
              rejectLabel,
              style: const TextStyle(color: EsportColors.error, fontWeight: FontWeight.bold),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.cancel_rounded, color: EsportColors.error),
          ],
        ),
      ),
      child: GlassSurface(
        padding: const EdgeInsets.all(14),
        child: child,
      ),
    );
  }
}
