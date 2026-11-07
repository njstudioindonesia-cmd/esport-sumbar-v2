/**
 * Formula Radius Konsentris Liquid Glass 2026:
 * R_anak = max(0, R_induk - Padding)
 *
 * Menjamin kurvatur elemen anak mengikuti dan harmonis dengan kurvatur kontainer induk.
 */
export function calcConcentricRadius(parentRadiusPx: number, paddingPx: number): number {
  return Math.max(0, parentRadiusPx - paddingPx);
}

/**
 * Menghitung objek style inline border-radius untuk nesting konsentris
 */
export function getConcentricStyle(parentRadiusPx: number, paddingPx: number): React.CSSProperties {
  const childRadius = calcConcentricRadius(parentRadiusPx, paddingPx);
  return {
    borderRadius: `${childRadius}px`,
  };
}
