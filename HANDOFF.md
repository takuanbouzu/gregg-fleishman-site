# Handoff — Lost Triangle 2D construction: rebuild geometry from the artist's source

Branch: `claude/dazzling-galileo-dfi8wz` · Draft PR: **#6**
(`https://github.com/takuanbouzu/gregg-fleishman-site/pull/6`)

This handoff is scoped to **one task**: making the animated 2D construction on
`lost-triangle-construction.html` match Gregg's *actual* base drawing instead of
the hand-eyeballed pixel trace it was built from.

---

## 1. The problem

`lost-triangle-construction.html` draws the `1 : √2 : √3` figure from pixel
coordinates a previous pass "measured from `lost-triangle-color.png`". They were
wrong:

- the "unit square" was `287 × 243 px` — **not square**;
- it floated above the rhombus with no real geometric relationship to it;
- the rhombus, circles, and √3 triangle were all eyeballed.

Gregg flagged it directly: *"The square is incorrect… needs to be rotated so that
the diagonal coincides with the long axis of the rhombus. What you drew is not
even square."* He then supplied his real CAD drawing as the source of truth (§3).

---

## 2. What's been done so far (and the gotcha)

Commit `6ebc75a` rebuilt the square as a **true** square tipped 45° so its
diagonal lies on the rhombus long axis. **This matched Gregg's verbal description
but NOT his source file.** When the actual drawing arrived (§3) it showed the
square is **axis-aligned**, not tipped.

> ⚠️ **Next owner: the tipped-square commit `6ebc75a` should be superseded by a
> faithful rebuild from the source SVG (§3 / §4). Do not treat it as correct.**

The React motion graphic on `lost-triangle.html` is already on this branch and is
unrelated to this task — leave it alone.

---

## 3. The authoritative source — NEW line-drawing source for this task

Gregg's master drawing is now committed in the repo:

| File | What it is |
|------|------------|
| `assets/sources/lost-triangle-starting-lines.svg` | **The line-drawing source.** 2D vector export of the starting construction lines. Use this for exact coordinates. |
| `assets/sources/GREG_TRIANGLE_BASE_DRAWING.3dm` | The Rhino master (3D). 3.7 MB binary — reference only; the SVG is derived from it. |

The SVG verbatim (also the file above):

```svg
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" width="612pt" height="792pt" viewBox="0 0 612 792" xmlns="http://www.w3.org/2000/svg">
  <defs />
  <g id="Pyramid">
    <g id="Pyramid::edge">
      <path d="M215.99683,341.99683 L287.99683,413.99683" .../>   <!-- square diagonal TL->BR -->
      <circle cx="288" cy="414" r="50.91" .../>                    <!-- circle @ square BR / rhombus centre -->
      <circle cx="360" cy="414" r="50.92" .../>                    <!-- circle @ rhombus right vertex -->
      <path d="M215.99683,413.99683 L288.0058,342.0058" .../>      <!-- square diagonal BL->TR -->
      <path d="M215.99683,413.99683 L287.99683,413.99683 L287.99683,341.99683 L215.99683,341.99683 z" .../> <!-- the SQUARE -->
      <circle cx="252" cy="378" r="50.91" .../>                    <!-- circle @ square centre (circumscribes square) -->
    </g>
  </g>
  <g id="Layer_01">                                                 <!-- the √2 rhombus -->
    <path d="M215.99683,413.99683 L287.99683,363.0915"  .../>      <!-- left -> top -->
    <path d="M359.99683,413.99683 L287.99683,464.90216" .../>      <!-- right -> bottom -->
    <path d="M287.99683,363.0915  L359.99683,413.99683" .../>      <!-- top -> right -->
    <path d="M215.99683,413.99683 L287.99683,464.90216" .../>      <!-- left -> bottom -->
    <path d="M287.99683,413.99683 L287.99683,464.90216" .../>      <!-- centre -> bottom (short-axis half) -->
  </g>
</svg>
```

---

## 4. Decoded geometry (this is the spec to build to)

SVG user units; y is **down** (SVG convention).

**Unit square** — axis-aligned, edge = **72**:
```
TL (216, 342)   TR (288, 342)
BL (216, 414)   BR (288, 414)
```
- Diagonals TL↔BR and BL↔TR (length 72√2 ≈ 101.82) are the **√2 face diagonals**.

**√2 rhombus** — `Layer_01`:
```
left  (216, 414)   = square BL corner   (= one end of the long axis)
top   (288, 363.09)
right (360, 414)
bottom(288, 464.90)
centre(288, 414)   = square BR corner
```
- long diagonal (horizontal, left↔right) = **144** = `2 × edge`
- short diagonal (vertical, top↔bottom) = **101.81** = `edge × √2`
- ratio long : short = **√2 : 1** ✓ (rhombic-dodecahedron face)

**Key relationships (the whole point of the drawing):**
- The rhombus **long axis is horizontal**, collinear with the square's **bottom-edge line** (y = 414).
- The rhombus **centre = the square's bottom-right corner**; its **left vertex = the square's bottom-left corner**.
- All three construction circles share **r = 50.91 = ½ the square diagonal = 72/√2**, centred at: the square centre `(252,378)` (circumscribes the square), the square BR / rhombus centre `(288,414)`, and the rhombus right vertex `(360,414)`.

**Not in the source:** the magenta **√3 "Lost Triangle"** payoff. It must be
*derived* from this base (the √3 is one unit lifted off the √2 face diagonal), not
re-eyeballed. Confirm the intended √3 vertices with Gregg before drawing it.

---

## 5. What to do next

1. Replace the eyeballed constants in `lost-triangle-construction.html`
   (`SQ`, `CIR`, `BLUE`/rhombus) with the §4 coordinates, transformed into the
   page's `viewBox`. Cleanest: set the SVG `viewBox` to frame the source bbox
   (`x≈[201,411]`, `y≈[327,465]`) directly so the numbers stay 1:1 with the source.
2. Keep the GSAP draw order (square → diagonals → circles → rhombus → √3), but
   drive every point from §4 — no magic pixels.
3. Derive the √3 triangle from the base; get Gregg's sign-off on its placement.
4. Re-run the headless frame checks (Playwright scripts in the session scratchpad)
   and compare against `assets/sources/lost-triangle-starting-lines.svg` rendered
   at the same crop.
5. Revisit commit `6ebc75a` — its tipped square is wrong per §2/§4.

---

## 6. Verify locally

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# open http://localhost:8000/lost-triangle-construction.html
# source reference: http://localhost:8000/assets/sources/lost-triangle-starting-lines.svg
```

This page is an **orphaned deep-dive** (reachable by URL, not in the nav). The
canonical Lost Triangle experience is the computed React graphic at
`lost-triangle.html`; this construction page is the hand-drawn companion.
