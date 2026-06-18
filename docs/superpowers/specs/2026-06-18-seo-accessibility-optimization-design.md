# Design Spec: SEO & Accessibility (A11y) Optimizations

This specification details the improvements required to enhance search engine optimization (SEO) and web accessibility (a11y) across the entire portfolio website.

## 1. Requirements

### 1.1 SEO Optimizations
- **Meta tags**: Add detailed titles, meta descriptions, and keywords to all Inertia pages (`Identitas.jsx`, `Arsenal.jsx`, `Misi.jsx`, and `Kontak.jsx`).
- **Social Graph Metadata**: Implement Open Graph (`og:*`) and Twitter Cards metadata for enhanced link sharing previews on social platforms.
- **Sitemap & Robots**: Ensure `sitemap.xml` is up-to-date and restrict crawlers from indexing the Filament admin panel `/admin` in `robots.txt`.

### 1.2 Accessibility (A11y) & Semantic HTML Optimizations
- **Semantic Lists**: Restructure items that are conceptually lists (navigation links, skills, projects, and contact channels) to use `<ul>` and `<li>` elements instead of generic `<div>` grids.
- **ARIA Attributes & Roles**:
  - Add `aria-label` to all links opening in new tabs (`target="_blank"`) explaining that they open in a new tab.
  - Add `aria-hidden="true"` to all SVG and Lucide icons to prevent screen readers from reading decorative icons.
  - Add `aria-label` and `role="img"` to the ASCII art title so screen readers identify it correctly.
  - Provide an accessible label (`aria-label`) and descriptive placeholder on the CLI input.
- **Unique IDs**: Add unique, descriptive IDs to all primary interactive elements (`<a>` and `<button>`) to facilitate accessibility mapping and automated browser testing.

## 2. Technical Blueprint

### 2.1 robots.txt
Modify `public/robots.txt` to disallow access to `/admin`:
```text
User-agent: *
Disallow: /admin

Sitemap: https://arifrenggy.site/sitemap.xml
```

### 2.2 Page-by-Page SEO Meta Tags
Each page component will have its `<Head>` updated with comprehensive SEO properties. For example, in `Identitas.jsx`:
```jsx
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
```
Similar tags will be applied to `Arsenal.jsx`, `Misi.jsx`, and `Kontak.jsx` with page-specific paths and copy.

### 2.3 Semantic List Restructuring
- **ArsipLayout.jsx**:
  - The navigation sidebar will be wrapped in a `<ul className="space-y-1">` and each item rendered in a `<li>`.
- **Arsenal.jsx**:
  - The tech stack grid will be wrapped in a `<ul className="grid grid-cols-1 gap-6">` with items in `<li>`.
- **Misi.jsx**:
  - The project card grid will use `<ul className="grid grid-cols-1 gap-6">` and `<li>`.
- **Kontak.jsx**:
  - The contact items grid will use `<ul className="grid grid-cols-1 gap-4">` and `<li>`.

### 2.4 Interactive Elements, ARIA & IDs
- **ASCII Header** (`AsciiHeader.jsx`):
  ```jsx
  <pre 
      role="img" 
      aria-label="ASCII Art Header - ARIF RENGGY" 
      className="..."
  >
  ```
- **CLI Button** (`ArsipLayout.jsx`):
  ```jsx
  <button
      id="cli-trigger-btn"
      aria-label="Switch to CLI Mode"
      onClick={() => setIsCliOpen(true)}
      ...
  ```
- **CLI Close Button & Input** (`InteractiveCli.jsx`):
  ```jsx
  <button 
      id="close-cli-btn"
      aria-label="Close CLI Terminal"
      onClick={onClose} 
      ...
  >
  ...
  <input
      id="cli-terminal-input"
      aria-label="Command line input"
      placeholder="Type 'help' for available commands..."
      ...
  />
  ```
- **Links with target="_blank"** (`Misi.jsx` & `Kontak.jsx`):
  Add `aria-label="{Description} (opens in a new tab)"` and a unique `id` to each link element.
  Add `aria-hidden="true"` to all decorative Lucide icons.

## 3. Verification Plan
- Run `npm run build` to confirm there are no frontend compile errors.
- Run `vendor/bin/phpunit` to verify routes remain completely intact.
- Verify through manual inspection that sitemap is valid and HTML page structure validates with sitemap paths.
