# Delta Feed: Research News for the Latest Agentic AI

Delta Feed adalah platform web modern untuk kurasi riset kecerdasan buatan otonom (**Agentic AI**), dibangun menggunakan React, Vite, Tailwind CSS, dan komponen dari shadcn UI serta React Bits.

Dibangun berdasarkan spesifikasi dari **DESIGN.md** oleh **D.Rendra ~ 2026**.

---

## ✨ Fitur & Arsitektur Desain

1. **Hero Section (60% Kiri / 40% Kanan)**:
   - **Bagian Kiri (60%)**:
     - **Judul**: `"Delta Feed"` menggunakan komponen interaktif `<TechText />` (React Bits) dengan animasi intro, efek outline pointer, dan drag.
     - **Sub-Judul**: `"Research news for the latest Agentic AI"` dengan tipografi modern bernuansa gradien kosmik.
     - **Author Text**: `D.Rendra ~ 2026` (*italic*).
     - **Animasi Masuk**: Transisi halus berjenjang (*staggered fade-in*).
   - **Bagian Kanan (40%)**:
     - Komponen interaktif `<DitherVeil />` bertenaga OGL WebGL shader dengan efek dither Floyd-Steinberg, responsif terhadap kursor dan klik burst.
   - **Background Antariksa Interaktif**:
     - Komponen `<Galaxy />` WebGL starfield dengan interaktivitas warp klik dan pergerakan bintang real-time.
2. **Logo Loop Section**:
   - Komponen `<LogoLoop />` horizontal tak terbatas menampilkan ekosistem dan lab frontier AI (Anthropic, Google DeepMind, Meta AI, Hugging Face, Mistral, NVIDIA NIM, OpenRouter, dll.).
3. **Feed Section**:
   - Menampilkan artikel riset dalam **grid 2 baris card**.
   - Dilengkapi filter kategori dinamis, pencarian real-time, estimasi waktu baca, dan tags.
   - Klik card untuk membuka **Modal Reader interaktif** dengan format markdown lengkap (tabel, code block, quote, metadata, tombol copy link & download `.md`).
4. **Markdown Driven**:
   - Seluruh artikel tersimpan di folder `feeds/*.md`. Cukup letakkan file `.md` baru ke dalam folder `feeds/` untuk otomatis dimuat ke feed.
5. **Tipografi Pilihan**:
   - Display & Heading: **Space Grotesk**
   - Body & Text: **Plus Jakarta Sans**
   - Code & Meta: **JetBrains Mono**
6. **Navigasi Melayang (Dynamic Island)**:
   - Navigasi tampil sebagai pulau melayang di atas konten dengan latar kaca gelap, garis tepi tipis, dan bayangan elevasi.
   - Aksi **Research Feed** tetap menggulir ke bagian feed, dengan fokus keyboard yang terlihat dan preferensi reduced motion dihormati.
7. **Footer**:
   - Branding dan informasi kurator Delta Feed.

---

## 📝 Cara Menambahkan Feed Baru

Untuk mempublikasikan riset baru, buat file markdown baru di dalam folder `feeds/` (contoh: `feeds/07-my-new-paper.md`):

```markdown
---
id: "my-new-paper"
title: "Autonomous Agent Tooling: Best Practices 2026"
date: "2026-11-07"
author: "D.Rendra"
category: "Architectures"
tags: ["Agents", "Tooling", "Reasoning"]
readingTime: "5 min read"
summary: "Ringkasan singkat tentang riset atau eksperimen agentic AI yang dilakukan."
image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
badge: "New"
---

# Isi Riset Anda di Sini

Tulis isi makalah atau dispatches Anda menggunakan format Markdown standar:
- Header (#, ##, ###)
- Code blocks (```python, ```typescript)
- Tabel perbandingan
- Blockquote
```

Aplikasi akan otomatis mendeteksi file tersebut saat build/reload.

---

## 🚀 Panduan Deploy ke Layanan Gratis

Karena aplikasi ini dikompilasi menjadi aset statis murni (`dist/`), Anda dapat mendeploy-nya ke berbagai penyedia hosting gratis tanpa biaya server:

### 1. Cloudflare Pages (Rekomendasi Utama — 100% Gratis & Bandwidth Unlimited)
1. Push repositori ini ke GitHub.
2. Buka dashboard [Cloudflare Pages](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Pilih repositori `delta`.
4. Isi build configuration:
   - **Framework preset**: `Vite`
   - **Build command**: `bun run build`
   - **Build output directory**: `dist`
5. Klik **Save and Deploy**. Website Anda langsung live dengan custom domain & SSL gratis!

---

### 2. Vercel (Gratis & Sangat Cepat)
1. Buka [Vercel](https://vercel.com) dan login dengan akun GitHub.
2. Klik **Add New Project** > Import repositori `delta`.
3. Vercel otomatis mendeteksi Vite (`dist` sebagai output).
4. Klik **Deploy**.

---

### 3. GitHub Pages (Gratis & Terintegrasi Otomatis)
Workflow GitHub Actions telah disediakan di `.github/workflows/deploy.yml`:
1. Push project ke GitHub di branch `main`.
2. Di GitHub repository Anda, buka tab **Settings** > **Pages**.
3. Pada bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
4. Begitu Anda melakukan `git push`, GitHub Actions akan otomatis melakukan build dan mendeploy ke `https://<username>.github.io/<repo>/`.

---

### 4. Netlify
1. Buka [Netlify](https://app.netlify.com).
2. Drag & drop folder `dist` setelah menjalankan `bun run build`, atau hubungkan ke GitHub repositori dengan command `bun run build` dan publish directory `dist`.

---

## 💻 Menjalankan di Komputer Lokal

Instal [Bun](https://bun.sh/docs/installation) terlebih dahulu.

```bash
# Install dependensi
bun install --frozen-lockfile

# Jalankan server development lokal
bun run dev

# Build untuk produksi
bun run build

# Preview hasil build
bun run preview

# Jalankan tes unit dan komponen
bun run test
```

Untuk pemeriksaan interaksi di browser, jalankan `bun run dev`, lalu buka `http://localhost:5173/tests/browser.html`. Hasil setiap pemeriksaan ditampilkan sebagai PASS atau FAIL.
