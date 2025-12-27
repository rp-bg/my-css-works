# My CSS Works

A small collection of CSS experiments and micro-projects to practice layout, animation, and interaction patterns.

## Overview

- **Purpose:** A personal playground of compact CSS demos covering form animations, scroll-driven layouts, typewriter effects, and techniques for transforming chaotic content into ordered layouts.
- **How to view:** Open [index.html](index.html) in a browser, or run a simple HTTP server (see instructions below) to explore the demos with correct asset paths.

## Projects

- **Form Animation** — [form-animation/index.html](form-animation/index.html)
	- What: Animated sign-in form with floating labels and polished focus states.
	- Features: label transitions, input styling, small accessible form markup.

- **Scroll Effect** — [scroll-effect/index.html](scroll-effect/index.html)
	- What: A split layout demonstrating scroll-driven panels where the left column stays sticky and updates content while the right column scrolls.
	- Features: full-viewport panels, sticky left column, image/content swaps tied to scroll.

- **Typewriter Text** — [typewriter-text/index.html](typewriter-text/index.html)
	- What: A simple typewriter-style reveal on text using CSS keyframe animation.
	- Features: purely CSS-driven text reveal for headings.

- **Content Chaos to Order** — [content-chaos-to-order/index.html](content-chaos-to-order/index.html)
	- What: Demonstrates transforming a group of scattered elements into an ordered layout (grid/sequence) with CSS.
	- Features: arranging elements, transitions/transform techniques.

- **Scroll to Order** — [scroll-to-order/index.html](scroll-to-order/index.html)
	- What: A sibling demo to "Content Chaos to Order" that focuses on using scroll or interaction to trigger the reordering of elements.

## How to run locally

Option 1 — Quick (open in browser)

 - Double-click `index.html` or open it with your browser. Note: some demos use external images and relative paths; running a local HTTP server is recommended.

Option 2 — Simple HTTP server (recommended)

Run one of the commands from the project root in a terminal:

```bash
# Python 3
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

Option 3 — VS Code Live Server

- If you use VS Code, install the Live Server extension and click "Go Live" to preview the demos.

## Contributing

- These are small personal experiments. If you'd like to suggest improvements (README fixes, clearer comments, better accessibility), open an issue or submit a pull request.

## Notes & Next steps

- Consider adding short GIF previews for each demo in the README.
- Add brief comments in each `style.css` demonstrating key techniques and trade-offs.

---

Last updated: December 2025
