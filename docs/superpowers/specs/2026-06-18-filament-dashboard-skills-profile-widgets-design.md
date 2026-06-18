# Design Spec: Filament Dashboard Widgets, Skills, & Profile Management

This specification outlines the technical design to dynamize the profile and skills pages, and introduce helpful monitoring widgets on the Filament admin dashboard.

## 1. Requirements

### 1.1 Skills Management (Arsenal)
- **Model `Keahlian`**:
  - Columns: `id`, `nama` (string), `level` (integer: 0-100), `deskripsi` (string, nullable), `warna` (string: select of 'primary', 'accent', 'warning'), `apakah_core` (boolean), `created_at`, `updated_at`.
- **Filament Resource `KeahlianResource`**:
  - Manage skills list in Filament.
- **Frontend Page Integration**:
  - Fetch database records in the `/arsenal` route and render dynamically in `Arsenal.jsx`.

### 1.2 Profile Management (Identitas Settings)
- **Model `Profil`**:
  - Columns: `id`, `nama_lengkap` (string), `peran` (string), `spesialisasi` (string), `wilayah` (string), `kutipan` (text), `created_at`, `updated_at`.
- **Filament Resource `ProfilResource` & Policy**:
  - Limit operations using `ProfilPolicy`: disable create and delete; allow view and update only.
- **Frontend Page Integration**:
  - Fetch `Profil::first()` in the `/identitas` route and render dynamically in `Identitas.jsx`.

### 1.3 Dashboard Widgets
- **`StatsOverviewWidget`**:
  - Display project counts, total skills, and core skills count.
- **`KeahlianChartWidget`**:
  - Bar chart showing skills and energy level.
- **`SystemStatusWidget`**:
  - Custom terminal-style status info of the server/DB.

## 2. Technical Blueprint

### 2.1 Database & Migrations

#### Keahlian Migration (`create_keahlians_table`)
```php
Schema::create('keahlians', function (Blueprint $table) {
    $table->id();
    $table->string('nama');
    $table->integer('level')->default(0);
    $table->string('deskripsi')->nullable();
    $table->string('warna')->default('primary');
    $table->boolean('apakah_core')->default(false);
    $table->timestamps();
});
```

#### Profil Migration (`create_profils_table`)
```php
Schema::create('profils', function (Blueprint $table) {
    $table->id();
    $table->string('nama_lengkap');
    $table->string('peran');
    $table->string('spesialisasi');
    $table->string('wilayah');
    $table->text('kutipan');
    $table->timestamps();
});
```

#### Seeder / Initial Seed Data (`DatabaseSeeder.php`)
- **Keahlians**:
  - Laravel: 95%, warna: `accent`, apakah_core: true, desc: "Mesin utama untuk backend berkinerja tinggi."
  - React: 85%, warna: `primary`, apakah_core: false, desc: "Antarmuka reaktif dan dinamis."
  - Tailwind CSS: 90%, warna: `primary`, apakah_core: false, desc: "Sistem desain utilitas atomik."
  - Docker: 75%, warna: `warning`, apakah_core: false, desc: "Kontainerisasi infrastruktur."
  - SQLite: 80%, warna: `warning`, apakah_core: false, desc: "Penyimpanan data lokal yang persisten."
  - Inertia.js: 88%, warna: `primary`, apakah_core: false, desc: "Penghubung mulus antara Laravel dan React."
- **Profil**:
  - ID 1: nama_lengkap: "Arif Renggy", peran: "Fullstack Developer", spesialisasi: "Laravel Expert", wilayah: "Indonesia", kutipan: "Arsitek Sistem yang berspesialisasi dalam membangun infrastruktur digital yang kokoh dan efisien menggunakan Laravel."

### 2.2 Models & Policies

#### ProfilPolicy
Disabling creation and deletion via standard Laravel model authorization:
```php
class ProfilPolicy
{
    public function viewAny(User $user): bool { return true; }
    public function view(User $user, Profil $profil): bool { return true; }
    public function create(User $user): bool { return false; }
    public function update(User $user, Profil $profil): bool { return true; }
    public function delete(User $user, Profil $profil): bool { return false; }
}
```

### 2.3 Frontend & Routes Integration
- `routes/web.php` will pass database values:
  - `/identitas` -> `Inertia::render('Identitas', ['profil' => Profil::first()])`
  - `/arsenal` -> `Inertia::render('Arsenal', ['skills' => Keahlian::all()])`
- Frontend components will map `warna` names to terminal colors:
  - `primary` -> `var(--color-terminal-primary)` (Cyan)
  - `accent` -> `var(--color-terminal-accent)` (Pink)
  - `warning` -> `var(--color-terminal-warning)` (Yellow)

### 2.4 Dashboard Widgets
- Configure Filament to load custom widgets in `app/Providers/Filament/AdminPanelProvider.php`.
- Widgets will read database counts and display system info (`PHP_OS`, `PHP_VERSION`, size of SQLite database).

## 3. Verification Plan
- Run migrations: `php artisan migrate --seed`.
- Run PHPUnit tests.
- Compile assets: `npm run build`.
- Check Filament dashboard to confirm widgets render correctly and Skills/Profile resources are editable.
