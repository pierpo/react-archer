import { resolveAutoAnchor } from './rectHelper';

// Minimal DOMRect factory — only the fields resolveAutoAnchor reads.
const rect = (left: number, top: number, width = 100, height = 50): DOMRect =>
  ({ left, top, width, height }) as DOMRect;

describe('resolveAutoAnchor', () => {
  // The "own" element is centered at (100, 100).
  const own = rect(50, 75);

  it('anchors to the bottom when the other element is below', () => {
    const other = rect(50, 375); // center (100, 400) — straight down
    expect(resolveAutoAnchor(own, other)).toEqual('bottom');
  });

  it('anchors to the top when the other element is above', () => {
    const other = rect(50, -225); // center (100, -200) — straight up
    expect(resolveAutoAnchor(own, other)).toEqual('top');
  });

  it('anchors to the right when the other element is to the right', () => {
    const other = rect(350, 75); // center (400, 100) — straight right
    expect(resolveAutoAnchor(own, other)).toEqual('right');
  });

  it('anchors to the left when the other element is to the left', () => {
    const other = rect(-250, 75); // center (-200, 100) — straight left
    expect(resolveAutoAnchor(own, other)).toEqual('left');
  });

  describe('on a perfect diagonal (equal horizontal and vertical distance)', () => {
    // center (200, 200): dx = dy = 100 relative to own's center (100, 100).
    const diagonal = rect(150, 175);

    it("resolves to the vertical axis ('bottom')", () => {
      expect(resolveAutoAnchor(own, diagonal)).toEqual('bottom');
    });
  });

  it('falls back to middle when a rect is missing', () => {
    expect(resolveAutoAnchor(null, own)).toEqual('middle');
    expect(resolveAutoAnchor(own, undefined)).toEqual('middle');
  });
});
