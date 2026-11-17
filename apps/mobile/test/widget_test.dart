import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:esport_sumbar_mobile/ui/features/gallery/component_gallery_screen.dart';

void main() {
  testWidgets('App smoke test - Component Gallery renders cleanly', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: ComponentGalleryScreen()));
    expect(find.text('GALERI SISTEM DESAIN NATIVE'), findsOneWidget);
  });
}
