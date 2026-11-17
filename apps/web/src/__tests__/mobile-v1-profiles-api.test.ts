import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getGames } from "@/app/api/v1/catalog/games/route";
import { GET as getRegions } from "@/app/api/v1/catalog/regions/route";
import { POST as createProfileRoute, GET as getProfilesRoute } from "@/app/api/v1/profiles/route";
import { GET as getMeProfileRoute } from "@/app/api/v1/profiles/me/route";

describe("Mobile V1 Catalog & Profiles BFF Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. GET /api/v1/catalog/games harus mengembalikan katalog game aktif dengan roles", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/catalog/games");
    const res = await getGames(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThanOrEqual(1);

    const mlbb = json.data.find((g: any) => g.shortName === "MLBB" || g.id === "game-mlbb");
    expect(mlbb).toBeDefined();
    expect(mlbb.genre).toBe("moba");
  });

  it("2. GET /api/v1/catalog/regions harus mengembalikan 19 kota & kabupaten Sumatera Barat", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/catalog/regions");
    const res = await getRegions(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBe(19);

    const padang = json.data.find((r: any) => r.code === "PDG" || r.name === "Kota Padang");
    expect(padang).toBeDefined();
  });

  it("3. POST /api/v1/profiles harus menolak data formulir yang tidak valid (validasi Zod)", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/profiles", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-test-account-id": "11111111-2222-3333-4444-555555555555",
      },
      body: JSON.stringify({
        displayName: "A", // Terlalu pendek (< 2)
        entityType: "invalid_type",
      }),
    });

    const res = await createProfileRoute(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("4. POST /api/v1/profiles berhasil membuat profil untuk akun baru", async () => {
    const testAccountId = "a1111111-2222-3333-4444-555555555555";
    const req = new NextRequest("http://localhost:3000/api/v1/profiles", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-test-account-id": testAccountId,
      },
      body: JSON.stringify({
        displayName: "Rizky Minang Player",
        ign: "PHOENIX",
        entityType: "player",
        regionId: "reg-pdg",
        mainGameId: "game-mlbb",
        bio: "Player kompetitif Mobile Legends Kota Padang",
        attributes: {
          whatsapp: "+6281234567890",
          rolePreference: "Jungler",
        },
      }),
    });

    const res = await createProfileRoute(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.displayName).toBe("Rizky Minang Player");
    expect(json.data.entityType).toBe("player");
    expect(json.data.esportId).toBeDefined();
  });

  it("5. POST /api/v1/profiles menolak pembuatan profil kedua (Satu Akun Satu Bidang - 409 Conflict)", async () => {
    const testAccountId = "a1111111-2222-3333-4444-555555555555"; // akun yang sama
    const req = new NextRequest("http://localhost:3000/api/v1/profiles", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-test-account-id": testAccountId,
      },
      body: JSON.stringify({
        displayName: "Rizky Pelatih",
        entityType: "coach",
        regionId: "reg-pdg",
      }),
    });

    const res = await createProfileRoute(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("PROFILE_ALREADY_EXISTS");
    expect(json.error.message).toContain("Satu akun hanya untuk satu bidang");
  });

  it("6. GET /api/v1/profiles/me mengembalikan profil yang baru saja dibuat", async () => {
    const testAccountId = "a1111111-2222-3333-4444-555555555555";
    const req = new NextRequest("http://localhost:3000/api/v1/profiles/me", {
      headers: {
        "x-test-account-id": testAccountId,
      },
    });

    const res = await getMeProfileRoute(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.profile).toBeDefined();
    expect(json.data.profile.displayName).toBe("Rizky Minang Player");
  });
});
