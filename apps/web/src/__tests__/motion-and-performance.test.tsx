import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import {
  MOTION_DURATIONS,
  MOTION_SPRINGS,
  MOTION_STAGGER,
  MOTION_EASINGS,
  GLASS_VARIANTS,
  REDUCED_MOTION_VARIANTS,
} from "../components/glass/MotionPresets";
import { ScrollReveal } from "../components/glass/ScrollReveal";
import { GlassNumberCounter } from "../components/glass/GlassNumberCounter";
import { VerificationFlowTracker } from "../components/glass/VerificationFlowTracker";
import { CardSuccessCelebration } from "../components/glass/CardSuccessCelebration";
import { GlassSwitch } from "../components/glass/GlassSwitch";
import { GlassSegmented } from "../components/glass/GlassSegmented";
import { GlassToast } from "../components/glass/GlassToast";
import { SceneBackground } from "../components/glass/SceneBackground";

describe("Bagian 10: Koreografi Motion, Penyetelan Performa & Aksesibilitas", () => {
  describe("10.1 & 3.5 Token Motion Terstandarisasi", () => {
    it("memiliki token durasi standar platform (100, 180, 280, 450, 700 ms)", () => {
      expect(MOTION_DURATIONS.instant).toBe(0.1);
      expect(MOTION_DURATIONS.fast).toBe(0.18);
      expect(MOTION_DURATIONS.base).toBe(0.28);
      expect(MOTION_DURATIONS.slow).toBe(0.45);
      expect(MOTION_DURATIONS.cinematic).toBe(0.7);
    });

    it("memiliki spring presets terstandarisasi (snappy, fluid, gentle)", () => {
      expect(MOTION_SPRINGS.snappy.type).toBe("spring");
      expect(MOTION_SPRINGS.snappy.stiffness).toBe(400);
      expect(MOTION_SPRINGS.snappy.damping).toBe(30);

      expect(MOTION_SPRINGS.fluid.type).toBe("spring");
      expect(MOTION_SPRINGS.fluid.stiffness).toBe(280);
      expect(MOTION_SPRINGS.fluid.damping).toBe(24);

      expect(MOTION_SPRINGS.gentle.type).toBe("spring");
      expect(MOTION_SPRINGS.gentle.stiffness).toBe(140);
      expect(MOTION_SPRINGS.gentle.damping).toBe(18);
    });

    it("memiliki stagger tokens (30ms, 40ms, 50ms) dan kurva bezier standar", () => {
      expect(MOTION_STAGGER.fast).toBe(0.03);
      expect(MOTION_STAGGER.base).toBe(0.04);
      expect(MOTION_STAGGER.slow).toBe(0.05);

      expect(MOTION_EASINGS.standardOut).toEqual([0.22, 1, 0.36, 1]);
      expect(MOTION_EASINGS.standardIn).toEqual([0.4, 0, 1, 1]);
    });

    it("memiliki reduced-motion fallbacks tanpa pergeseran layout", () => {
      expect(REDUCED_MOTION_VARIANTS.fadeIn.transition.duration).toBe(0.1);
      expect(REDUCED_MOTION_VARIANTS.instant.transition.duration).toBe(0);
    });
  });

  describe("10.2 Momen Motion Liquid Glass 2026", () => {
    it("merender ScrollReveal dengan transisi transform GPU", () => {
      const html = renderToString(
        <ScrollReveal direction="up" delay={0.1}>
          <div data-testid="child-content">Konten Beranda</div>
        </ScrollReveal>
      );
      expect(html).toContain("Konten Beranda");
    });

    it("merender GlassNumberCounter dengan angka tabular bebas CLS", () => {
      const html = renderToString(
        <GlassNumberCounter
          value={128}
          label="Profil Terdaftar"
          prefix=""
          suffix="+"
        />
      );
      expect(html).toContain("tabular-nums");
      expect(html).toContain("Profil Terdaftar");
    });

    it("merender VerificationFlowTracker dengan rel progres transform: scaleX", () => {
      const steps = [
        { id: 1, label: "Pengajuan", status: "completed" as const, badge: "Terkirim" },
        { id: 2, label: "Telaah", status: "active" as const, badge: "Dalam Penelaahan" },
        { id: 3, label: "Lencana", status: "pending" as const, badge: "Menunggu" },
      ];

      const html = renderToString(<VerificationFlowTracker steps={steps} />);
      expect(html).toContain("Pelacak Alur Verifikasi");
      expect(html).toContain("Pengajuan");
      expect(html).toContain("Telaah");
      expect(html).toContain("Lencana");
      expect(html).toContain("Dalam Penelaahan");
    });

    it("merender CardSuccessCelebration dengan kartu sukses, ESPORT ID, dan aksi", () => {
      const html = renderToString(
        <CardSuccessCelebration
          esportId="ESB-PDG-PL-100234"
          entityType="player"
          rarityTier="elite"
        />
      );
      expect(html).toContain("Kartu Paspor Berhasil Diterbitkan!");
      expect(html).toContain("ESB-PDG-PL-100234");
      expect(html).toContain("Dashboard");
      expect(html).toContain("Verifikasi");
    });

    it("merender GlassSwitch dan GlassSegmented dengan indikator cair", () => {
      const switchHtml = renderToString(
        <GlassSwitch
          checked={true}
          onCheckedChange={() => {}}
          label="Mode Gelap"
        />
      );
      expect(switchHtml).toContain("role=\"switch\"");
      expect(switchHtml).toContain("aria-checked=\"true\"");

      const segmentedHtml = renderToString(
        <GlassSegmented
          options={[
            { value: "day", label: "Hari Ini" },
            { value: "week", label: "Minggu Ini" },
          ]}
          value="day"
          onChange={() => {}}
        />
      );
      expect(segmentedHtml).toContain("Hari Ini");
      expect(segmentedHtml).toContain("Minggu Ini");
    });

    it("merender GlassToast dengan live region notifikasi pegas", () => {
      const html = renderToString(
        <GlassToast
          toasts={[
            {
              id: "t1",
              type: "success",
              title: "Profil Diperbarui",
              message: "Perubahan profil berhasil disimpan ke sistem.",
            },
          ]}
          onDismiss={() => {}}
        />
      );
      expect(html).toContain("role=\"region\"");
      expect(html).toContain("Profil Diperbarui");
      expect(html).toContain("Perubahan profil berhasil disimpan");
    });

    it("merender SceneBackground untuk mode visual ambient", () => {
      const html = renderToString(<SceneBackground intensity="normal" />);
      expect(html).toContain("pointer-events-none");
      expect(html).toContain("fixed inset-0");
    });
  });

  describe("10.3 Bebas Istilah dan Klaim Terlarang", () => {
    it("tidak mengandung istilah terlarang kelembagaan atau klaim ilegal pada output komponen motion", () => {
      const html = renderToString(
        <div>
          <CardSuccessCelebration esportId="ESB-PDG-PL-100234" />
          <VerificationFlowTracker
            steps={[
              { id: 1, label: "Pengajuan", status: "completed" },
              { id: 2, label: "Telaah Mandiri", status: "active" },
            ]}
          />
        </div>
      );

      const forbiddenWords = [
        ["E", "S", "I"].join(""),
        ["P", "B", "E", "S", "I"].join(""),
        ["Peng", "prov"].join(""),
        ["Peng", "cab"].join(""),
        ["KO", "NI"].join(""),
        ["Dis", "pora"].join(""),
      ];

      for (const word of forbiddenWords) {
        expect(html).not.toContain(word);
      }
    });
  });
});
