/** Deterministic, library-free QR-style matrix for certificate previews (NOT a scannable QR code). */

export const QR_SIZE = 11;

/** `size × size` booleans (row-major): three corner "finder" blocks + pseudo-random modules seeded by `seed`. */
export function qrMatrix(seed: string, size = QR_SIZE): boolean[] {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  h |= 1;
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
  const corners: [number, number][] = [
    [0, 0],
    [0, size - 4],
    [size - 4, 0],
  ];
  const cells: boolean[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const zone = corners.find(([r0, c0]) => r >= r0 && r < r0 + 4 && c >= c0 && c < c0 + 4);
      if (zone) {
        // 3×3 solid finder with a 1-cell quiet gap towards the centre.
        const [r0, c0] = zone;
        const lr = r0 === 0 ? r : r - r0 - 1;
        const lc = c0 === 0 ? c : c - c0 - 1;
        cells.push(lr >= 0 && lr < 3 && lc >= 0 && lc < 3);
      } else {
        cells.push(rand() > 0.5);
      }
    }
  }
  return cells;
}

export default qrMatrix;
