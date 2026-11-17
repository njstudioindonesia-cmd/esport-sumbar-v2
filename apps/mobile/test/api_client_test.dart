import 'package:flutter_test/flutter_test.dart';
import 'package:esport_sumbar_mobile/core/network/api_client.dart';

void main() {
  group('Mobile API Client & BFF Base URL Tests', () {
    test('baseUrl harus mengembalikan endpoint yang valid', () {
      final url = ApiClient.baseUrl;
      expect(url, isNotEmpty);
      expect(url.startsWith('http'), isTrue);
    });

    test('getSystemVersion harus menangani respons secara anggun saat backend offline', () async {
      final result = await ApiClient.instance.getSystemVersion();
      expect(result, isNotNull);
      expect(result.containsKey('success'), isTrue);
    });

    test('getSystemHealth harus menangani status kesiapan layanan', () async {
      final result = await ApiClient.instance.getSystemHealth();
      expect(result, isNotNull);
      expect(result.containsKey('success'), isTrue);
    });
  });
}
