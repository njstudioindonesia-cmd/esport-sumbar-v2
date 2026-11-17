# ADR-M02: Strategi Liquid Glass Native dan Tingkat Efek Adaptif per OS

**Status**: APPROVED  
**Tanggal**: November 2026  

---

## 1. Konteks
Aplikasi mobile ESPORT SUMBAR V3 mengadopsi bahasa visual **Liquid Glass** yang selaras dengan frontend web V3. Namun, rendering efek blur kaca (translucency + backdrop filter) sangat membebani GPU/RAM smartphone kelas menengah ke bawah (RAM 3-4 GB di Indonesia).

## 2. Keputusan Arsitektur
Ditetapkan sistem **Tingkat Efek Adaptif Otomatis** (3 Level):

| Mode Efek | iOS | Android | Kriteria Deteksi Otomatis |
| :--- | :--- | :--- | :--- |
| **Penuh (Full)** | Efek kaca native (`expo-glass-effect` / blur tinggi 40px), specular rim highlight, specular parallax tilt. | Blur terkontrol pada header/tab bar, bayangan halus, specular shader pada kartu 3D. | RAM $\ge 6\text{ GB}$, Battery Saver: OFF, Reduce Motion: OFF. |
| **Standar (Standard)** | Blur sedang (20px), specular statis, tanpa partikel ambient. | Blur ringan hanya pada elemen penting, tanpa blur pada daftar panjang. | RAM $4 - 6\text{ GB}$, atau FPS rata-rata $\ge 50$. |
| **Hemat (Battery/Eco)** | Permukaan translusen solid (`rgba(18,18,63,0.96)`), tanpa blur, animasi fade sederhana. | Permukaan translusen solid, tanpa blur, bayangan minimal. | RAM $< 4\text{ GB}$, Battery Saver: ON, atau Reduce Transparency: ON. |

## 3. Aturan Keras Desain
1. **Maksimal 2 Lapisan Kaca Bertingkat**: Dilarang menumpuk lebih dari 2 lapisan kaca untuk mencegah overdraw GPU.
2. **QuietSurface untuk Formulir**: Layar input formulir dan daftar panjang menggunakan permukaan tenang (solid translusen), bukan kaca tebal.
3. **Kartu TCG Terisolasi**: Kartu esport 3D tidak dikaca-kacakan; frame rarity dan lencana verifikasi memiliki material fisik tegas (emas/perak/bronze/diamond).
