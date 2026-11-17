import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class NumberCounter extends StatelessWidget {
  final int value;
  final TextStyle? style;
  final Duration duration;

  const NumberCounter({
    super.key,
    required this.value,
    this.style,
    this.duration = const Duration(milliseconds: 600),
  });

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: value.toDouble()),
      duration: duration,
      curve: Curves.easeOutCubic,
      builder: (context, val, _) {
        return Text(
          val.toInt().toString(),
          style: style ??
              GoogleFonts.rajdhani(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
        );
      },
    );
  }
}
