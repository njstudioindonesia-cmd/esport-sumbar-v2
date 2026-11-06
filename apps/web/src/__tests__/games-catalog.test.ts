import { describe, it, expect } from "vitest";
import { OFFICIAL_GAMES, findGameByIdOrSlug, getGenreLabel } from "@/data/games";

describe("Katalog Game Dinamis V3 & Integrasi Honor of Kings (Mandat 5)", () => {
  it("harus menyertakan Honor of Kings (HOK) sebagai game resmi aktif", () => {
    const hok = OFFICIAL_GAMES.find((g) => g.id === "game-hok");
    expect(hok).toBeDefined();
    expect(hok?.name).toBe("Honor of Kings");
    expect(hok?.shortName).toBe("HOK");
    expect(hok?.genre).toBe("moba");
    expect(hok?.platform).toBe("mobile");
    expect(hok?.isActive).toBe(true);

    // Verifikasi 5 role resmi HOK
    expect(hok?.roles).toEqual([
      "Clash Lane",
      "Jungle",
      "Mid Lane",
      "Farm Lane",
      "Roam",
    ]);

    // Verifikasi rank tier HOK
    expect(hok?.ranks).toContain("Bronze");
    expect(hok?.ranks).toContain("Master");
    expect(hok?.ranks).toContain("Grandmaster");
    expect(hok?.ranks).toContain("Mythic");
  });

  it("harus memiliki 11 game resmi aktif sesuai Bagian 3.5 & Mandat 7", () => {
    expect(OFFICIAL_GAMES.length).toBe(11);
    const activeGames = OFFICIAL_GAMES.filter((g) => g.isActive);
    expect(activeGames.length).toBe(11);

    const ids = OFFICIAL_GAMES.map((g) => g.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    expect(ids).toContain("game-hok");
    expect(ids).toContain("game-mlbb");
    expect(ids).toContain("game-ff");
    expect(ids).toContain("game-pubgm");
    expect(ids).toContain("game-val");
    expect(ids).toContain("game-codm");
    expect(ids).toContain("game-wildrift");
    expect(ids).toContain("game-pokemon");
    expect(ids).toContain("game-cs2");
    expect(ids).toContain("game-dota2");
    expect(ids).toContain("game-efootball");
  });

  it("findGameByIdOrSlug harus dapat menemukan game baik via ID maupun slug", () => {
    const byId = findGameByIdOrSlug("game-hok");
    const bySlug = findGameByIdOrSlug("honor-of-kings");
    expect(byId).toBeDefined();
    expect(bySlug).toBeDefined();
    expect(byId?.id).toBe("game-hok");
    expect(bySlug?.id).toBe("game-hok");
  });

  it("getGenreLabel harus mengembalikan label genre yang ramah pengguna", () => {
    expect(getGenreLabel("moba")).toBe("MOBA");
    expect(getGenreLabel("battle_royale")).toBe("Battle Royale");
    expect(getGenreLabel("fps")).toBe("Tactical Shooter");
    expect(getGenreLabel("sports")).toBe("Olahraga Elektronik");
  });
});
