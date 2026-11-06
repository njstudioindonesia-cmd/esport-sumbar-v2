/**
 * OpenAPI 3.0.0 Specification for ESPORT SUMBAR V3 Microservices Contracts
 */

export const OPENAPI_V1_SPEC = {
  openapi: "3.0.3",
  info: {
    title: "ESPORT SUMBAR Platform API",
    version: "1.0.0",
    description:
      "Spesifikasi Kontrak Resmi API V3 ESPORT SUMBAR. Melayani komunikasi BFF, antarmuka web, dan pertukaran data antar-layanan independen.",
    contact: {
      name: "Tim Engineering ESPORT SUMBAR",
      url: "https://esportsumbar.com",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "Gateway BFF Server",
    },
  ],
  paths: {
    "/profiles": {
      get: {
        summary: "Daftar profil publik",
        description: "Mengambil daftar profil publik terverifikasi dan aktif dengan pagination.",
        parameters: [
          { name: "entity_type", in: "query", schema: { type: "string" } },
          { name: "region_code", in: "query", schema: { type: "string" } },
          { name: "game_id", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": {
            description: "Daftar profil berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    profiles: { type: "array", items: { $ref: "#/components/schemas/PublicProfile" } },
                    total: { type: "integer" },
                    page: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/ecosystem": {
      get: {
        summary: "Dasbor ekosistem pengguna",
        description: "Mengambil relasi aktif, permohonan masuk, permohonan keluar, dan riwayat.",
        responses: {
          "200": { description: "Sukses mengambil ekosistem" },
          "401": { description: "Tidak terautentikasi" },
        },
      },
    },
    "/games": {
      get: {
        summary: "Katalog game resmi",
        description: "Mengambil daftar game dinamis aktif beserta role dan rank.",
        responses: {
          "200": { description: "Sukses mengambil katalog game" },
        },
      },
    },
    "/media/upload-signature": {
      post: {
        summary: "Minta URL tanda tangan unggah berkas",
        description: "Memvalidasi tipe mime dan ukuran file sebelum mengeluarkan signed URL ke storage.",
        responses: {
          "200": { description: "Signed URL diterbitkan" },
          "400": { description: "Tipe berkas atau ukuran tidak diizinkan" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      PublicProfile: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          displayName: { type: "string" },
          ign: { type: "string", nullable: true },
          entityType: {
            type: "string",
            enum: ["player", "coach", "team", "community", "venue", "school", "campus"],
          },
          esportId: { type: "string" },
          slug: { type: "string" },
          rarityTier: { type: "string", enum: ["rookie", "contender", "elite", "legend"] },
          verificationStatus: { type: "string" },
        },
      },
    },
  },
};
