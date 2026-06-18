# Rencana Implementasi Integrasi Perintah Dasar Linux

> **Untuk pekerja agentic:** SUB-SKILL WAJIB: Gunakan superpowers:subagent-driven-development (direkomendasikan) atau superpowers:executing-plans untuk mengimplementasikan rencana ini tugas-demi-tugas. Langkah-langkah menggunakan sintaks checkbox (`- [ ]`) untuk pelacakan.

**Goal:** Menambahkan navigasi virtual Linux dasar (`ls`, `cd`, `cat`, `pwd`) ke dalam CLI interaktif portofolio, serta menghubungkan folder virtual dengan rute halaman portofolio menggunakan Inertia.js.

**Architecture:** Membuat file system berbasis JavaScript client-side statis di `InteractiveCli.jsx`, menambahkan state `currentPath` untuk melacak path aktif, memperbarui render prompt secara dinamis, mengimplementasikan logika parsing perintah `pwd`/`ls`/`cat`/`cd`, dan menggunakan `router.visit` dari Inertia.js untuk navigasi halaman secara dinamis.

**Tech Stack:** React 19, Inertia.js.

## Global Constraints
- Mendukung navigasi Linux standar: `pwd`, `ls`, `cd`, dan `cat`.
- Sinkronisasi perintah `cd` dengan navigasi rute Inertia.js.
- Mengubah path `/home/visitor` menjadi `~` di prompt input CLI.
- Tidak ada library pengujian React eksternal (pengujian dilakukan secara manual dan verifikasi build).

---

### Task 1: Definisikan Virtual File System

**Files:**
- Modify: `resources/js/Components/InteractiveCli.jsx`

**Interfaces:**
- Consumes: Objek data statis.
- Produces: Objek `virtualFileSystem` di scope file component `InteractiveCli.jsx`.

- [ ] **Step 1: Definisikan virtualFileSystem di InteractiveCli.jsx**

Buka [InteractiveCli.jsx](file:///home/arifrenggy00/my_web/resources/js/Components/InteractiveCli.jsx) dan tambahkan objek `virtualFileSystem` di bagian atas file (di bawah definisi `themes` / `applyTheme`):

```javascript
const virtualFileSystem = {
    '/': {
        type: 'dir',
        children: ['home']
    },
    '/home': {
        type: 'dir',
        children: ['visitor']
    },
    '/home/visitor': {
        type: 'dir',
        children: ['identitas', 'misi', 'arsenal', 'komunikasi', 'readme.txt']
    },
    '/home/visitor/readme.txt': {
        type: 'file',
        content: [
            '========================================',
            'SELAMAT DATANG DI TERMINAL ARIF RENGGY',
            '========================================',
            'Gunakan perintah Linux standar untuk navigasi:',
            '  ls      - Melihat isi folder',
            '  cd      - Berpindah folder',
            '  cat     - Membaca isi file teks',
            '  pwd     - Melihat lokasi folder aktif saat ini',
            ''
        ]
    },
    '/home/visitor/identitas': {
        type: 'dir',
        children: ['profil.txt'],
        route: '/identitas'
    },
    '/home/visitor/identitas/profil.txt': {
        type: 'file',
        content: [
            '--- PROFIL IDENTITAS INTI ---',
            'NAMA: Arif Renggy',
            'PERAN: Fullstack Developer',
            'WILAYAH: Indonesia',
            'BIO: Arsitek Sistem yang berspesialisasi dalam',
            '     membangun infrastruktur digital menggunakan Laravel.',
            ''
        ]
    },
    '/home/visitor/misi': {
        type: 'dir',
        children: ['status.txt'],
        route: '/misi'
    },
    '/home/visitor/misi/status.txt': {
        type: 'file',
        content: [
            '--- STATUS MISI DIGITAL ---',
            'SEMUA PROYEK: BERHASIL DISELESAIKAN',
            'Ketik "projects" atau "misi" untuk mengambil data misi dari database.',
            ''
        ]
    },
    '/home/visitor/arsenal': {
        type: 'dir',
        children: ['alutsista.txt'],
        route: '/arsenal'
    },
    '/home/visitor/arsenal/alutsista.txt': {
        type: 'file',
        content: [
            '--- DAFTAR ALUTSISTA / KEAHLIAN ---',
            '  Laravel      - 95%',
            '  React        - 85%',
            '  Tailwind CSS - 90%',
            '  Inertia.js   - 88%',
            '  SQLite       - 80%',
            '  Docker       - 75%',
            ''
        ]
    },
    '/home/visitor/komunikasi': {
        type: 'dir',
        children: ['jalur.txt'],
        route: '/jalur-komunikasi'
    },
    '/home/visitor/komunikasi/jalur.txt': {
        type: 'file',
        content: [
            '--- SALURAN KOMUNIKASI TERENKRIPSI ---',
            '  GitHub: https://github.com/arifrenggy00',
            '  Email: arifrenggy404@gmail.com',
            '  LinkedIn: Arif Renggy',
            ''
        ]
    }
};
```

- [ ] **Step 2: Commit perubahan**

```bash
git add resources/js/Components/InteractiveCli.jsx
git commit -m "feat: declare virtual file system data structure in CLI component"
```

---

### Task 2: Tambahkan State currentPath dan Update Render Prompt

**Files:**
- Modify: `resources/js/Components/InteractiveCli.jsx`

**Interfaces:**
- Consumes: State `currentPath` dan fungsi `setCurrentPath`.
- Produces: Prompt masukan terminal yang dinamis.

- [ ] **Step 1: Tambahkan state currentPath**

Tambahkan deklarasi state berikut di dalam fungsi component `InteractiveCli`:

```javascript
const [currentPath, setCurrentPath] = useState('/home/visitor');
```

- [ ] **Step 2: Update render prompt input**

Cari baris JSX berikut:
```jsx
<span className="text-terminal-accent">visitor@arif-renggy:~$</span>
```
Ganti menjadi rendering dinamis:
```jsx
<span className="text-terminal-accent">
    visitor@arif-renggy:{currentPath.replace(/^\/home\/visitor/, '~')}$
</span>
```

- [ ] **Step 3: Commit perubahan**

```bash
git add resources/js/Components/InteractiveCli.jsx
git commit -m "feat: add currentPath state and dynamic CLI prompt layout"
```

---

### Task 3: Implementasi Perintah navigasi dan Help

**Files:**
- Modify: `resources/js/Components/InteractiveCli.jsx`

**Interfaces:**
- Consumes: Parameter input perintah dari user.
- Produces: Log output terminal dan transisi rute (via `router.visit`).

- [ ] **Step 1: Definisikan helper resolusi path**

Tambahkan fungsi pembantu `resolveAbsolutePath` di atas deklarasi component `InteractiveCli` untuk menerjemahkan path relatif/absolut menjadi path absolut yang valid:

```javascript
const resolveAbsolutePath = (current, target) => {
    if (!target) return current;
    if (target.startsWith('/')) {
        // Path absolut
        const parts = target.split('/').filter(Boolean);
        return '/' + parts.join('/');
    }
    
    // Path relatif
    const currentParts = current.split('/').filter(Boolean);
    const targetParts = target.split('/').filter(Boolean);
    
    for (const part of targetParts) {
        if (part === '..') {
            if (currentParts.length > 0) currentParts.pop();
        } else if (part !== '.') {
            currentParts.push(part);
        }
    }
    
    return '/' + currentParts.join('/');
};
```

- [ ] **Step 2: Tambahkan routing import**

Pastikan `router` dari `@inertiajs/react` diimpor di `InteractiveCli.jsx` agar dapat memicu transisi navigasi web:

```javascript
import { router } from '@inertiajs/react';
```

- [ ] **Step 3: Implementasi case perintah pwd, ls, cat, dan cd**

Tambahkan case switch baru di dalam handler `handleKeyDown` pada parser perintah CLI:

```javascript
                case 'pwd':
                    setLogs(prev => [...prev, currentPath, '']);
                    break;

                case 'ls':
                    const dirNode = virtualFileSystem[currentPath];
                    if (dirNode && dirNode.type === 'dir') {
                        const listedItems = dirNode.children.map(childName => {
                            const fullChildPath = currentPath === '/' ? `/${childName}` : `${currentPath}/${childName}`;
                            const childNode = virtualFileSystem[fullChildPath];
                            return childNode && childNode.type === 'dir' ? `${childName}/` : childName;
                        });
                        if (listedItems.length > 0) {
                            setLogs(prev => [...prev, listedItems.join('   '), '']);
                        } else {
                            setLogs(prev => [...prev, '']);
                        }
                    } else {
                        setLogs(prev => [...prev, 'ERROR: Cannot list directory.', '']);
                    }
                    break;

                case 'cat':
                    const catTarget = args[1];
                    if (!catTarget) {
                        setLogs(prev => [...prev, '']);
                    } else {
                        const targetFilePath = resolveAbsolutePath(currentPath, catTarget);
                        const fileNode = virtualFileSystem[targetFilePath];
                        if (fileNode) {
                            if (fileNode.type === 'file') {
                                setLogs(prev => [...prev, ...fileNode.content, '']);
                            } else {
                                setLogs(prev => [...prev, `cat: ${catTarget}: Is a directory`, '']);
                            }
                        } else {
                            setLogs(prev => [...prev, `cat: ${catTarget}: No such file or directory`, '']);
                        }
                    }
                    break;

                case 'cd':
                    const cdTarget = args[1];
                    if (!cdTarget) {
                        setCurrentPath('/home/visitor');
                        setLogs(prev => [...prev, '']);
                    } else {
                        const targetDirPath = resolveAbsolutePath(currentPath, cdTarget);
                        const targetNode = virtualFileSystem[targetDirPath];
                        if (targetNode) {
                            if (targetNode.type === 'dir') {
                                setCurrentPath(targetDirPath);
                                setLogs(prev => [...prev, '']);
                                // Memicu navigasi website secara dinamis jika memiliki properti route
                                if (targetNode.route) {
                                    router.visit(targetNode.route);
                                }
                            } else {
                                setLogs(prev => [...prev, `-bash: cd: ${cdTarget}: Not a directory`, '']);
                            }
                        } else {
                            setLogs(prev => [...prev, `-bash: cd: ${cdTarget}: No such file or directory`, '']);
                        }
                    }
                    break;
```

- [ ] **Step 4: Update output command help**

Tambahkan deskripsi perintah baru di case `'help'` output logs:
```javascript
                        '  ls                    - List directory contents',
                        '  cd [dir]              - Change active directory (syncs page)',
                        '  cat [file]            - Display file contents',
                        '  pwd                   - Print working directory path',
```

- [ ] **Step 5: Commit perubahan**

```bash
git add resources/js/Components/InteractiveCli.jsx
git commit -m "feat: implement pwd, ls, cat, and cd commands with dynamic Inertia.js route synchronization"
```

---

### Task 4: Verifikasi Build dan Pengujian Manual

**Files:**
- None

- [ ] **Step 1: Jalankan kompilasi aset**

Jalankan perintah build frontend:
```bash
npm run build
```
Pastikan kompilasi berhasil tanpa ada error.

- [ ] **Step 2: Jalankan PHPUnit test suite**

Jalankan pengujian backend:
```bash
vendor/bin/phpunit
```
Pastikan status: `passed` untuk semua pengujian.

- [ ] **Step 3: Commit visual check confirmation**

```bash
git commit --allow-empty -m "test: manual verification of virtual CLI linux commands passed"
```
