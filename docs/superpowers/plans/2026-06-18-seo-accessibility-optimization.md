# SEO & Accessibility Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive SEO (meta tags, Open Graph, Twitter Cards, robots.txt, sitemap verification) and Accessibility (a11y) improvements (semantic lists, ARIA labels/roles, unique IDs, hidden icons) across the portfolio site.

**Architecture:**
- Create and edit React components (`Identitas.jsx`, `Arsenal.jsx`, `Misi.jsx`, `Kontak.jsx`, `ArsipLayout.jsx`, `AsciiHeader.jsx`, `InteractiveCli.jsx`) to update titles, add social meta tags, convert `div` grids to `ul`/`li` lists, and inject proper ARIA labels, roles, and unique IDs.
- Modify `robots.txt` in the `public` directory to restrict search indexing of the Filament admin page.
- Verify `sitemap.xml` is valid and correct.

**Tech Stack:** React, Laravel, Inertia.js, HTML5.

## Global Constraints
- Keep visual presentation identical to the current design (preserving styles, class names, grid structures, scans, and hover animations).
- Wrap items in `<li>` within lists and keep the class names on the direct children identical to retain formatting.
- Ensure all SVG and Lucide icons are ignored by screen readers using `aria-hidden="true"`.

---

### Task 1: Update Robots.txt and Validate sitemap.xml

**Files:**
- Modify: `public/robots.txt`
- Verify: `public/sitemap.xml`

- [ ] **Step 1: Modify public/robots.txt**

Open `public/robots.txt` and replace its content to disallow `/admin` for search engines while keeping the sitemap reference.

```text
User-agent: *
Disallow: /admin

Sitemap: https://arifrenggy.site/sitemap.xml
```

- [ ] **Step 2: Commit Task 1**

Run:
```bash
git add public/robots.txt
git commit -m "seo: disallow Filament admin panel in robots.txt"
```

---

### Task 2: Restructure and Optimize Layout Component (ArsipLayout & AsciiHeader)

**Files:**
- Modify: `resources/js/Components/AsciiHeader.jsx`
- Modify: `resources/js/Layouts/ArsipLayout.jsx`

- [ ] **Step 1: Add a11y roles to AsciiHeader.jsx**

Update `resources/js/Components/AsciiHeader.jsx` to mark the preformatted ASCII art tag as an image with an accessible label.

```jsx
import React from 'react';

const ASCII_ART = `
  ___  ____  ___ _____   ____  ____ _   _  ____  ______   __
 / _ \\|  _ \\|_ _|  ___| |  _ \\| ___| \\ | |/ ___|/ ___\\ \\ / /
| |_| | |_) || || |_    | |_) |  _| |  \\| | |  _| |  _ \\ V / 
|  _  |  _ < | ||  _|   |  _ <| |___| |\\  | |_| | |_| | | |  
|_| |_|_| \\_\\___|_|     |_| \\_\\_____|_| \\_|\\____|\\____| |_|  
`;

export default function AsciiHeader() {
    return (
        <pre 
            role="img" 
            aria-label="ASCII Art Header - ARIF RENGGY" 
            className="text-xs md:text-sm text-center leading-[1] text-terminal-primary font-mono select-none opacity-80 hover:opacity-100 transition-opacity mx-auto w-fit"
        >
            {ASCII_ART}
        </pre>
    );
}
```

- [ ] **Step 2: Modify ArsipLayout.jsx navigation and terminal trigger button**

Open `resources/js/Layouts/ArsipLayout.jsx` and restructure the navigation items from a plain `div` stack into a semantic `ul`/`li` list, and add proper ARIA and ID parameters to the CLI trigger button and the links. Also, add `aria-hidden="true"` to Lucide icons.

```jsx
// Change: navItems rendering inside the sidebar nav tag:
                    <nav className="space-y-1">
                        <div className="text-terminal-primary text-[10px] font-mono mb-2 uppercase tracking-widest opacity-50">Directory</div>
                        <ul className="space-y-1">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <Link 
                                        id={`sidebar-link-${item.label}`}
                                        href={item.href} 
                                        className={`flex items-center gap-3 p-2 border border-transparent hover:border-terminal hover:bg-terminal-primary/5 transition-all group ${window.location.pathname === item.href ? 'text-terminal-primary border-terminal bg-terminal-primary/10' : 'text-gray-400'}`}
                                    >
                                        <span className="text-terminal-primary opacity-50 group-hover:opacity-100">{'>'}</span>
                                        <span className="font-mono text-xs tracking-wider">/home/{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
```

Update the floating CLI mode button near the end of the file:
```jsx
            <button
                id="cli-trigger-btn"
                onClick={() => setIsCliOpen(true)}
                className="fixed bottom-6 right-6 w-12 h-12 bg-black border border-terminal-primary rounded-full flex items-center justify-center text-terminal-primary hover:bg-terminal-primary hover:text-black transition-all cursor-pointer z-[60] shadow-[0_0_15px_var(--color-terminal-primary)] hover:shadow-[0_0_25px_var(--color-terminal-primary)] transition-shadow duration-300 animate-pulse"
                title="Switch to CLI Mode"
                aria-label="Switch to CLI Mode"
            >
                <Terminal size={22} aria-hidden="true" />
            </button>
```

Also, update references to icons in the transition page / custom icons to use `aria-hidden="true"`:
- `Terminal` in the floating button -> `<Terminal size={22} aria-hidden="true" />`
- `TerminalStatusBar` or notification components if they contain icons. But Lucide icons inside layouts can be updated by adding `aria-hidden="true"` to `Terminal` and other imports. Let's do that for layout level imports.

- [ ] **Step 3: Commit Task 2**

Run:
```bash
git add resources/js/Components/AsciiHeader.jsx resources/js/Layouts/ArsipLayout.jsx
git commit -m "a11y: update layout and header with semantic lists, unique IDs, and ARIA roles"
```

---

### Task 3: Restructure and Optimize Interactive CLI component

**Files:**
- Modify: `resources/js/Components/InteractiveCli.jsx`

- [ ] **Step 1: Add accessibility metadata to CLI elements**

Open `resources/js/Components/InteractiveCli.jsx` and add unique IDs and ARIA tags to the close button (line 552) and command input (line 575). Ensure the Lucide icons inside this file use `aria-hidden="true"`.

For Close Button (approx lines 552-557):
```jsx
                <button 
                    id="close-cli-btn"
                    onClick={onClose} 
                    className="text-gray-500 hover:text-terminal-accent transition-colors cursor-pointer"
                    aria-label="Close CLI Terminal"
                >
                    <X size={18} aria-hidden="true" />
                </button>
```

For input field (approx lines 575-587):
```jsx
                <input
                    ref={inputRef}
                    id="cli-terminal-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-terminal-primary font-mono caret-terminal-primary focus:ring-0 p-0"
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    aria-label="Command line input"
                    placeholder="Type 'help' for available commands..."
                />
```

And in general components top bar icon:
```jsx
                <div className="flex items-center gap-2 text-neon-cyan">
                    <Terminal size={16} aria-hidden="true" />
                    <span>visitor@arif-renggy: CLI_SESSION_ACTIVE</span>
                </div>
```

- [ ] **Step 2: Commit Task 3**

Run:
```bash
git add resources/js/Components/InteractiveCli.jsx
git commit -m "a11y: add unique IDs, ARIA labels, and placeholders to InteractiveCli components"
```

---

### Task 4: Optimize SEO & A11y on Identitas Page

**Files:**
- Modify: `resources/js/Pages/Identitas.jsx`

- [ ] **Step 1: Update Identitas.jsx**

Update `<Head>` tags to include detailed page-specific properties (Open Graph & Twitter Cards).

```jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import ArsipLayout from '../Layouts/ArsipLayout';

export default function Identitas() {
    return (
        <ArsipLayout>
            <Head>
                <title>Identitas Core | Arif Renggy - Fullstack Developer</title>
                <meta name="description" content="Arsip identitas inti dan profil profesional Arif Renggy sebagai Fullstack Laravel & React Developer." />
                <meta name="keywords" content="Arif Renggy, Laravel, React, Fullstack Developer, Indonesia, Cyberpunk UI" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://arifrenggy.site/identitas" />
                <meta property="og:title" content="Identitas Core | Arif Renggy - Fullstack Developer" />
                <meta property="og:description" content="Arsip identitas inti dan profil profesional Arif Renggy sebagai Fullstack Laravel & React Developer." />
                <meta property="og:site_name" content="Arif Renggy Portfolio" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://arifrenggy.site/identitas" />
                <meta name="twitter:title" content="Identitas Core | Arif Renggy - Fullstack Developer" />
                <meta name="twitter:description" content="Arsip identitas inti dan profil profesional Arif Renggy sebagai Fullstack Laravel & React Developer." />
            </Head>
            <div className="space-y-6">
                <h2 className="text-terminal-accent font-mono text-lg uppercase tracking-widest underline decoration-wavy text-neon-pink">Arsip Identitas</h2>
                <ul className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <li className="p-4 border border-gray-800 bg-black/40 hover:border-terminal-primary/30 transition-colors">
                        <div className="text-gray-500 mb-1 text-[10px]">IDENTITAS_INTI</div>
                        <div className="text-white">Arif Renggy</div>
                    </li>
                    <li className="p-4 border border-gray-800 bg-black/40 hover:border-terminal-primary/30 transition-colors">
                        <div className="text-gray-500 mb-1 text-[10px]">PERAN</div>
                        <div className="text-white">Fullstack Developer</div>
                    </li>
                    <li className="p-4 border border-gray-800 bg-black/40 hover:border-terminal-primary/30 transition-colors border-l-2 border-l-terminal-primary">
                        <div className="text-gray-500 mb-1 text-[10px]">SPESIALISASI</div>
                        <div className="text-terminal-primary font-bold">Laravel Expert</div>
                    </li>
                    <li className="p-4 border border-gray-800 bg-black/40 hover:border-terminal-primary/30 transition-colors">
                        <div className="text-gray-500 mb-1 text-[10px]">WILAYAH</div>
                        <div className="text-white">Indonesia</div>
                    </li>
                </ul>
                <div className="relative p-6 border border-gray-800 bg-[#1a1a1c]/30">
                     <div className="absolute top-0 left-0 w-1 h-full bg-terminal-warning"></div>
                     <p className="text-gray-400 text-sm leading-relaxed italic">
                        "Arsitek Sistem yang berspesialisasi dalam membangun infrastruktur digital yang kokoh dan efisien menggunakan Laravel."
                    </p>
                </div>
            </div>
        </ArsipLayout>
    );
}
```

- [ ] **Step 2: Commit Task 4**

Run:
```bash
git add resources/js/Pages/Identitas.jsx
git commit -m "seo: optimize metadata and refactor list elements in Identitas page"
```

---

### Task 5: Optimize SEO & A11y on Arsenal Page

**Files:**
- Modify: `resources/js/Pages/Arsenal.jsx`

- [ ] **Step 1: Update Arsenal.jsx**

Update `<Head>` tags with detailed page-specific properties (Open Graph & Twitter Cards) and transform the skill list to `<ul>` / `<li>`.

```jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import ArsipLayout from '../Layouts/ArsipLayout';

export default function Arsenal() {
    const skills = [
        { name: 'Laravel', level: 95, color: 'var(--color-terminal-accent)', isCore: true, desc: 'Mesin utama untuk backend berkinerja tinggi.' },
        { name: 'React', level: 85, color: 'var(--color-terminal-primary)', desc: 'Antarmuka reaktif dan dinamis.' },
        { name: 'Tailwind CSS', level: 90, color: 'var(--color-terminal-primary)', desc: 'Sistem desain utilitas atomik.' },
        { name: 'Docker', level: 75, color: 'var(--color-terminal-warning)', desc: 'Kontainerisasi infrastruktur.' },
        { name: 'SQLite', level: 80, color: 'var(--color-terminal-warning)', desc: 'Penyimpanan data lokal yang persisten.' },
        { name: 'Inertia.js', level: 88, color: 'var(--color-terminal-primary)', desc: 'Penghubung mulus antara Laravel dan React.' }
    ];

    return (
        <ArsipLayout>
            <Head>
                <title>Pusat Arsenal Keahlian | Arif Renggy - Fullstack Developer</title>
                <meta name="description" content="Keahlian teknis dan tumpukan teknologi (arsenal) Arif Renggy seperti Laravel, React, Tailwind CSS, Inertia.js, dan Docker." />
                <meta name="keywords" content="Tech stack, Laravel skill, React skill, PHP, JavaScript, Docker, Tailwind" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://arifrenggy.site/arsenal" />
                <meta property="og:title" content="Pusat Arsenal Keahlian | Arif Renggy - Fullstack Developer" />
                <meta property="og:description" content="Keahlian teknis dan tumpukan teknologi (arsenal) Arif Renggy seperti Laravel, React, Tailwind CSS, Inertia.js, dan Docker." />
                <meta property="og:site_name" content="Arif Renggy Portfolio" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://arifrenggy.site/arsenal" />
                <meta name="twitter:title" content="Pusat Arsenal Keahlian | Arif Renggy - Fullstack Developer" />
                <meta name="twitter:description" content="Keahlian teknis dan tumpukan teknologi (arsenal) Arif Renggy seperti Laravel, React, Tailwind CSS, Inertia.js, dan Docker." />
            </Head>
            <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <h2 className="text-terminal-accent font-mono text-lg uppercase tracking-widest underline decoration-wavy text-neon-pink">Pusat Teknologi</h2>
                    <span className="text-[10px] text-gray-600 font-mono">STATUS_ALUTSISTA: OPTIMAL</span>
                </div>
                
                <ul className="grid grid-cols-1 gap-6">
                    {skills.map(s => (
                        <li key={s.name} className={`p-5 border transition-all ${s.isCore ? "border-terminal-accent/40 bg-terminal-accent/5 shadow-[0_0_15px_var(--color-terminal-muted)]" : "border-gray-800 bg-[#1a1a1c]/20 hover:border-gray-700"}`}>
                            <div className="flex flex-row items-center justify-between gap-4 mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-mono uppercase tracking-tighter ${s.isCore ? 'text-terminal-accent font-black text-xl text-neon-pink' : 'text-gray-200 font-bold'}`}>
                                            {s.name}
                                        </span>
                                        {s.isCore && (
                                            <span className="text-[8px] bg-terminal-accent text-black px-1.5 py-0.5 font-black uppercase leading-none">CORE_ENGINE</span>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-mono italic">{s.desc}</div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="font-mono text-lg font-bold text-white">{s.level}</span>
                                    <span className="font-mono text-[10px] text-gray-600">%_ENERGI</span>
                                </div>
                            </div>
                            
                            <div className="w-full h-1.5 bg-black border border-gray-900 overflow-hidden">
                                <div 
                                    className="h-full transition-all duration-[2000ms] ease-out shadow-[0_0_10px_currentColor]" 
                                    style={{ 
                                        width: `${s.level}%`, 
                                        backgroundColor: s.color,
                                        color: s.color 
                                    }}
                                ></div>
                            </div>
                        </li>
                    ))}
                </ul>
                
                <div className="p-4 border border-dashed border-gray-800 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-widest">Analisis_Tambahan:</div>
                    <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                        Sistem arsenal terus diperbarui. Memiliki kemahiran mendalam dalam integrasi modul Laravel 13, optimalisasi database SQLite, dan pengembangan antarmuka reaktif menggunakan React 19.
                    </p>
                </div>
            </div>
        </ArsipLayout>
    );
}
```

- [ ] **Step 2: Commit Task 5**

Run:
```bash
git add resources/js/Pages/Arsenal.jsx
git commit -m "seo: optimize metadata and refactor list elements in Arsenal page"
```

---

### Task 6: Optimize SEO & A11y on Misi Page

**Files:**
- Modify: `resources/js/Pages/Misi.jsx`

- [ ] **Step 1: Update Misi.jsx**

Update `<Head>` tags with detailed page-specific properties (Open Graph & Twitter Cards), convert the project card list to `<ul>` / `<li>`, add `aria-label` to external demo and source code links, add `aria-hidden="true"` to Lucide icons, and define unique IDs.

```jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import ArsipLayout from '../Layouts/ArsipLayout';
import { ExternalLink, ShieldAlert, Cpu } from 'lucide-react';

const IkonGithub = ({ size = 14, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Misi({ proyek = [] }) {
    return (
        <ArsipLayout>
            <Head>
                <title>Laporan Misi Proyek | Arif Renggy - Fullstack Developer</title>
                <meta name="description" content="Arsip portofolio proyek dan misi digital yang berhasil dikerjakan oleh Arif Renggy menggunakan PHP/Laravel, React, dan database SQL." />
                <meta name="keywords" content="Proyek Web, Showcase Laravel, Aplikasi React, Portofolio PHP, Arif Renggy" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://arifrenggy.site/misi" />
                <meta property="og:title" content="Laporan Misi Proyek | Arif Renggy - Fullstack Developer" />
                <meta property="og:description" content="Arsip portofolio proyek dan misi digital yang berhasil dikerjakan oleh Arif Renggy menggunakan PHP/Laravel, React, dan database SQL." />
                <meta property="og:site_name" content="Arif Renggy Portfolio" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://arifrenggy.site/misi" />
                <meta name="twitter:title" content="Laporan Misi Proyek | Arif Renggy - Fullstack Developer" />
                <meta name="twitter:description" content="Arsip portofolio proyek dan misi digital yang berhasil dikerjakan oleh Arif Renggy menggunakan PHP/Laravel, React, dan database SQL." />
            </Head>
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <h2 className="text-terminal-accent font-mono text-lg uppercase tracking-widest underline decoration-wavy text-neon-pink">Laporan Misi</h2>
                    <span className="text-[10px] text-gray-600 font-mono">TOTAL_MISI: {proyek.length}</span>
                </div>
                
                <ul className="grid grid-cols-1 gap-6">
                    {proyek.map((p) => (
                        <li key={p.id} className="border border-gray-800 p-5 relative group hover:border-terminal-primary/50 transition-all bg-[#1a1a1c]/20">
                            {/* Efek Sudut Cyberpunk */}
                            <div className="absolute top-0 right-0 w-3 h-3 bg-gray-800 group-hover:bg-terminal-primary clip-path-polygon transition-colors"></div>
                            
                            <div className="flex flex-row gap-6">
                                {/* Thumbnail Proyek */}
                                <div className="w-32 h-32 flex-shrink-0 border border-gray-800 bg-black overflow-hidden relative group-hover:border-terminal-primary/30 transition-colors">
                                    {p.jalur_gambar ? (
                                        <img 
                                            src={`/storage/${p.jalur_gambar}`} 
                                            alt={`Tampilan visual untuk proyek ${p.nama_proyek}`} 
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col justify-center items-center text-gray-700">
                                            <Cpu size={24} className="mb-1 opacity-20" aria-hidden="true" />
                                            <span className="text-[8px] font-mono tracking-tighter">TIADA_VISUAL</span>
                                        </div>
                                    )}
                                </div>
 
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-terminal-primary uppercase tracking-tight text-neon-cyan">{p.nama_proyek}</h3>
                                            <div className="text-[10px] text-gray-500 font-mono">ID: MISI_{p.id.toString().padStart(3, '0')}</div>
                                        </div>
                                        <span className="text-[9px] font-mono px-2 py-0.5 border border-terminal-warning text-terminal-warning animate-pulse">
                                            TERSELESAIKAN
                                        </span>
                                    </div>
                                    
                                    <p className="text-xs text-gray-400 leading-relaxed">{p.deskripsi}</p>
                                    
                                    <div className="flex flex-wrap gap-1.5">
                                        {(p.teknologi_utama || []).map(t => (
                                            <span key={t} className="text-[9px] bg-black px-2 py-0.5 text-terminal-warning border border-terminal-warning/20 font-mono uppercase italic">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <div className="flex gap-6 pt-2 border-t border-gray-900">
                                        {p.tautan_github ? (
                                            <a 
                                                id={`project-source-${p.id}`}
                                                href={p.tautan_github} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-mono text-gray-500 hover:text-white uppercase flex items-center gap-1.5 transition-colors"
                                                aria-label={`Lihat kode sumber ${p.nama_proyek} di GitHub (terbuka di tab baru)`}
                                            >
                                                <IkonGithub size={12} aria-hidden="true" /> /KODE_SUMBER
                                            </a>
                                        ) : (
                                            <span className="text-[10px] font-mono text-gray-700 uppercase flex items-center gap-1.5 cursor-not-allowed">
                                                <ShieldAlert size={12} aria-hidden="true" /> /DATA_PRIVAT
                                            </span>
                                        )}
                                        {p.tautan_langsung && (
                                            <a 
                                                id={`project-demo-${p.id}`}
                                                href={p.tautan_langsung} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-mono text-terminal-primary hover:text-white uppercase flex items-center gap-1.5 transition-colors"
                                                aria-label={`Akses langsung demo ${p.nama_proyek} (terbuka di tab baru)`}
                                            >
                                                /AKSES_DEMO <ExternalLink size={10} aria-hidden="true" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </ArsipLayout>
    );
}
```

- [ ] **Step 2: Commit Task 6**

Run:
```bash
git add resources/js/Pages/Misi.jsx
git commit -m "seo: optimize metadata and enhance accessibility in Misi page"
```

---

### Task 7: Optimize SEO & A11y on Kontak Page

**Files:**
- Modify: `resources/js/Pages/Kontak.jsx`

- [ ] **Step 1: Update Kontak.jsx**

Update `<Head>` tags with detailed page-specific properties (Open Graph & Twitter Cards), convert the social channels list to `<ul>` / `<li>`, add unique IDs, and inject proper ARIA tags.

```jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import ArsipLayout from '../Layouts/ArsipLayout';
import { MessageSquare, Globe, Mail, ChevronRight } from 'lucide-react';

const IkonGithub = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const IkonLinkedin = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Kontak() {
    const contacts = [
        { name: 'GitHub', icon: IkonGithub, url: 'https://github.com/arifrenggy00', label: '@arifrenggy00', color: 'hover:text-white' },
        { name: 'LinkedIn', icon: IkonLinkedin, url: '#', label: 'Arif Renggy', color: 'hover:text-terminal-primary' },
        { name: 'WhatsApp', icon: MessageSquare, url: '#', label: 'MISI_LANGSUNG', color: 'hover:text-terminal-warning' },
        { name: 'Email', icon: Mail, url: 'mailto:arifrenggy404@gmail.com', label: 'arifrenggy404@gmail.com', color: 'hover:text-terminal-accent' },
        { name: 'Website', icon: Globe, url: 'https://portofolio-cyberpunk-production.up.railway.app', label: 'PORT_PROD_V1', color: 'hover:text-terminal-primary' }
    ];

    return (
        <ArsipLayout>
            <Head>
                <title>Saluran Komunikasi Kontak | Arif Renggy - Fullstack Developer</title>
                <meta name="description" content="Hubungi Arif Renggy melalui berbagai saluran komunikasi terenkripsi seperti Email, GitHub, WhatsApp, dan LinkedIn." />
                <meta name="keywords" content="Kontak web developer, Email Arif Renggy, GitHub Arif Renggy, Hubungi developer" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://arifrenggy.site/jalur-komunikasi" />
                <meta property="og:title" content="Saluran Komunikasi Kontak | Arif Renggy - Fullstack Developer" />
                <meta property="og:description" content="Hubungi Arif Renggy melalui berbagai saluran komunikasi terenkripsi seperti Email, GitHub, WhatsApp, dan LinkedIn." />
                <meta property="og:site_name" content="Arif Renggy Portfolio" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://arifrenggy.site/jalur-komunikasi" />
                <meta name="twitter:title" content="Saluran Komunikasi Kontak | Arif Renggy - Fullstack Developer" />
                <meta name="twitter:description" content="Hubungi Arif Renggy melalui berbagai saluran komunikasi terenkripsi seperti Email, GitHub, WhatsApp, dan LinkedIn." />
            </Head>
            <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <h2 className="text-terminal-accent font-mono text-lg uppercase tracking-widest underline decoration-wavy text-neon-pink">Saluran Terenkripsi</h2>
                    <span className="text-[10px] text-gray-600 font-mono">SINYAL: KUAT</span>
                </div>

                <ul className="grid grid-cols-1 gap-4">
                    {contacts.map(link => (
                        <li key={link.name}>
                            <a 
                                id={`contact-link-${link.name.toLowerCase()}`}
                                href={link.url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-5 border border-gray-800 bg-[#1a1a1c]/20 hover:border-terminal-primary hover:bg-terminal-primary/5 group transition-all relative overflow-hidden"
                                aria-label={`Hubungkan melalui ${link.name} (terbuka di tab baru)`}
                            >
                                {/* Efek Hover Background */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-terminal-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                                
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className={`p-2 border border-gray-800 bg-black group-hover:border-terminal-primary/50 transition-colors ${link.color}`}>
                                        <link.icon size={20} aria-hidden="true" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-mono text-xs text-gray-500 uppercase tracking-tighter group-hover:text-gray-300">HUBUNGKAN_MELALUI</span>
                                        <div className="font-mono text-sm font-black uppercase tracking-tight group-hover:text-terminal-primary">{link.name}</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 relative z-10">
                                    <span className="text-xs text-gray-600 font-mono tracking-tighter group-hover:text-terminal-warning">{link.label}</span>
                                    <ChevronRight size={14} className="text-gray-800 group-hover:text-terminal-primary transition-colors" aria-hidden="true" />
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
                
                <div className="mt-12 p-6 border border-gray-800 bg-black/40 font-mono relative">
                    <div className="text-[10px] text-terminal-accent mb-4 uppercase tracking-widest text-neon-pink">// CATATAN_PENGEMBANG:</div>
                    <div className="text-xs text-gray-400 leading-relaxed space-y-2">
                        <p>Pesan yang dikirim melalui saluran ini akan diproses melalui pipeline enkripsi asimetris.</p>
                        <p>Waktu respons rata-rata: <span className="text-terminal-primary">12-24 Jam Standar Sektor</span>.</p>
                    </div>
                </div>
            </div>
        </ArsipLayout>
    );
}
```

- [ ] **Step 2: Commit Task 7**

Run:
```bash
git add resources/js/Pages/Kontak.jsx
git commit -m "seo: optimize metadata and enhance accessibility in Kontak page"
```

---

### Task 8: Build and Test Suite Verification

- [ ] **Step 1: Build client resources**

Run: `npm run build`
Expected: Production assets compile successfully with zero errors.

- [ ] **Step 2: Run phpunit tests**

Run: `vendor/bin/phpunit`
Expected: All tests pass.
