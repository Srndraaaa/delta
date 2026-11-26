# Delta Feed

**Research News for the Latest Agentic AI** — platform web statis berbasis Markdown untuk kurasi dan pembacaan riset kecerdasan buatan otonom (*Agentic AI*), dibangun dengan React, Vite, Tailwind CSS, komponen UI bergaya shadcn, dan React Bits oleh **D.Rendra ~ 2026**.

## Fitur Utama

- **Hero & Latar Interaktif**
  - **Kiri**: judul `<TechText />` interaktif (intro animasi, pointer kick, drag), sub-judul, dan kredit `D.Rendra ~ 2026`.
  - **Kanan**: `<DitherVeil />` berbasis OGL WebGL dengan efek Floyd-Steinberg dither yang bereaksi terhadap kursor dan klik.
  - **Background & Logo Loop**: latar `<Galaxy />` WebGL starfield serta `<LogoLoop />` horizontal yang menampilkan ekosistem dan teknologi Agentic AI.
- **Feed Riset (`feeds/*.md`)**
  - Seluruh artikel dimuat otomatis dari `feeds/*.md` dan diurutkan berdasarkan `date` terbaru.
  - Tata letak **Lead Dispatch** pada artikel utama diikuti grid *Cutout Card*, dilengkapi filter kategori, pencarian real-time (judul, ringkasan, tag, penulis), waktu baca, dan penghitung pembaca (`readers` baseline + hitungan lokal browser).
- **Article Reader**
  - Kolom baca terpusat (`66ch`) dengan mode **Paper** dan **Dark**, progress bar baca, serta ringkasan pembuka.
  - Daftar lompat bagian (**In This Dispatch**), blok kode/diagram dengan tombol salin, tabel responsif, navigasi **Previous / Next Dispatch**, deep-link `?feed=<slug>`, salin URL, dan unduh file `.md` asli.
- **Tipografi & Aksesibilitas**
  - Menggunakan **Manrope** (display), **Plus Jakarta Sans** (body), dan **IBM Plex Mono** (kode/metadata).
  - Memakai native `<dialog>`, fokus keyboard yang terlihat, target sentuh minimal 44px, dan menghormati `prefers-reduced-motion`.

## Menjalankan Secara Lokal

Pastikan [Bun](https://bun.sh) sudah terpasang.

```bash
# Install dependensi
bun install --frozen-lockfile

# Jalankan server development
bun run dev

# Jalankan tes unit dan komponen
bun test

# Build produksi ke dist/
bun run build

# Preview hasil build
bun run preview
```

Untuk memeriksa interaksi browser (dialog, fokus, clipboard, filter, dan viewport 320–1440px), jalankan `bun run dev` lalu buka `http://localhost:5173/tests/browser.html`.

## Menambah Artikel Baru

Buat file Markdown baru di folder `feeds/` (misalnya `feeds/19-topik-baru.md`) dengan frontmatter berikut:

```markdown
---
id: "topik-baru"
readers: 0
title: "Judul Artikel Riset"
date: "2026-11-26"
author: "D.Rendra"
category: "Architectures"
tags: ["Agents", "Reasoning"]
readingTime: "5 min read"
summary: "Ringkasan singkat artikel yang tampil di kartu feed dan pembuka reader."
image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
badge: "New"
---

## 1. Bagian Pertama

Tulis isi artikel dalam Markdown standar (heading `##`, `###`, daftar, blockquote, tabel GFM, dan code block).
```

> Catatan: Tidak perlu mengulang `# Judul` di baris pertama isi artikel karena judul sudah dirender dari field `title` di frontmatter (jika ada `# Judul` yang sama di baris awal, reader otomatis menghapus duplikatnya).

## Struktur Proyek

```text
├── feeds/                  # Artikel riset dalam format Markdown (.md)
├── src/
│   ├── components/
│   │   ├── FeedSection.jsx
│   │   ├── FeedReaderModal.jsx
│   │   ├── HeroSection.jsx
│   │   ├── LogoLoopSection.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── reactbits/      # Galaxy, TechText, DitherVeil, LogoLoop
│   │   └── ui/             # Komponen UI (dialog, cutout-card, button, input, badge)
│   ├── hooks/              # useMagneticScroll
│   ├── lib/                # feedLoader.js (parser frontmatter & loader), utils.js
│   ├── App.jsx
│   └── index.css
├── tests/                  # Tes Bun (feed, magnetic, dither) & browser.html
├── DESIGN.md
└── vercel.json
```

## Deploy

Aplikasi dikompilasi menjadi aset statis di direktori `dist/` melalui `bun run build`:

- **Cloudflare Pages / Netlify**: hubungkan repositori, atur build command ke `bun run build` dan output directory ke `dist`.
- **Vercel**: konfigurasi Vite sudah tersedia di `vercel.json` (`dist` sebagai output).
- **GitHub Pages**: deploy isi `dist/` setelah menjalankan `bun run build`.
