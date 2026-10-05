# àrèwà · Atelier Sénateur
### Luxury Nigerian Senator Attire Catalogue & Interactive Fashion Gallery

An interactive 3D luxury fashion catalogue built with **Next.js (App Router)** and **Vanilla CSS**, replicating high-fashion showroom rail browsing adapted for bespoke **Nigerian Senator attire**.

---

## ✨ Features

- **Realistic Showroom Rail**: Authentic horizontal metallic rail rod with end finials and soft boundary fade masking; hangers are physically seated on the rod at all times.
- **Natural Wardrobe Angling**: Clothes rest angled along the rail (~40% towards front) showing depth and tailored silhouette lines.
- **Interactive Back-to-Front Scrubbing**: Moving the cursor back and forth across any piece dynamically swivels it between the front agbada neckline and intricate back embroidery in real-time.
- **60FPS Organic Spring Physics**: Continuous lerp animation loop (`requestAnimationFrame`) delivering natural ease-in and ease-out acceleration and deceleration without snapping.
- **Forward & Backward Navigation Spin**: Navigation controls (`<` and `>` arrow buttons, color dots, keyboard arrows) smoothly swivel newly selected pieces to the front while easing previous ones back to the wardrobe angle.
- **Individual Item Inspection**: Dedicated detail mode with 100% front alignment, physical size adjustments (`XS` to `XXL`), 3D drag-to-turn, front/back view toggling, and deep URL linking (`?piece=...`).
- **Atelier Commission Modal**: Integrated measurement and delivery form for bespoke tailoring commissions.
- **Web Audio Sound Design**: Subtle metallic rail clinks and fabric swooshes synthesized via the Web Audio API.
- **Fully Responsive**: Fluid layout adapted across desktop, tablet, and mobile devices.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation
```bash
git clone https://github.com/MarVemmX/clothing-gallery.git
cd clothing-gallery
npm install
```

### Running Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (Turbopack)
- **Styling**: Vanilla CSS (Custom Design System, 3D Transforms, Glassmorphism)
- **Typography**: Plus Jakarta Sans, Cormorant Garamond, Syne (via `next/font`)
- **Audio**: Web Audio API Sound Synthesizer
