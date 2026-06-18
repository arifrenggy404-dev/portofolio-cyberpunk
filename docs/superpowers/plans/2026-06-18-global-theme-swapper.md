# Global Theme Swapper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a theme swapper globally that saves user choices to `localStorage` and reacts instantly to terminal commands (`theme matrix`, `theme deus`, `theme vapor`, `theme cyber`).

**Architecture:** Bind Tailwind CSS v4 `@theme` colors to CSS Custom Properties under `:root`. Read them dynamically in the Canvas background loop, and mutate them in `InteractiveCli` and `ArsipLayout`.

**Tech Stack:** React 19, Tailwind CSS 4, localStorage API.

## Global Constraints
- Supported theme names: `cyber` (default), `matrix`, `deus`, `vapor`.
- Persist theme choices to `localStorage.getItem('terminal-theme')`.

---

### Task 1: Declare Theme CSS Custom Properties

**Files:**
- Modify: `resources/css/app.css`

- [ ] **Step 1: Declare variables under :root and map in @theme**

Modify [app.css](file:///home/arifrenggy00/my_web/resources/css/app.css) to add variables and map them to Tailwind v4 theme variables:

```css
@import 'tailwindcss';

@source '../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php';
@source '../../storage/framework/views/*.php';

:root {
  --color-terminal-primary: #00f0ff;
  --color-terminal-accent: #ff007f;
  --color-terminal-warning: #fee715;
  --color-terminal-bg: #0a0a0c;
  --color-terminal-muted: rgba(0, 240, 255, 0.1);
}

@theme {
  --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol', 'Noto Color Emoji';

  --color-terminal-primary: var(--color-terminal-primary);
  --color-terminal-accent: var(--color-terminal-accent);
  --color-terminal-warning: var(--color-terminal-warning);
  --color-terminal-bg: var(--color-terminal-bg);
  --color-terminal-muted: var(--color-terminal-muted);
}

@layer base {
  body {
    @apply bg-terminal-bg text-gray-100 font-mono;
    background-image: radial-gradient(circle at 50% 50%, #1a1a1c 0%, var(--color-terminal-bg) 100%);
  }
}

@layer utilities {
  .text-neon-cyan { text-shadow: 0 0 5px var(--color-terminal-primary), 0 0 10px var(--color-terminal-primary); }
  .text-neon-pink { text-shadow: 0 0 5px var(--color-terminal-accent), 0 0 10px var(--color-terminal-accent); }
  .border-neon-cyan { box-shadow: 0 0 5px var(--color-terminal-primary); border-color: var(--color-terminal-primary); }
  .neon-glow-cyan {
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.2);
  }
  .neon-glow-pink {
    box-shadow: 0 0 10px rgba(255, 0, 127, 0.5), 0 0 20px rgba(255, 0, 127, 0.2);
  }
  .grid-bg {
    background-image: 
      linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .scanline {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0) 50%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.3)
    );
    background-size: 100% 4px;
  }
  .clip-path-polygon {
    clip-path: polygon(100% 0, 0 0, 100% 100%);
  }
  
  /* CRT Glitch Transition Animations */
  @keyframes crt-flicker {
    0% { opacity: 0.98; filter: brightness(1); }
    50% { opacity: 0.95; filter: brightness(0.95); }
    100% { opacity: 0.99; filter: brightness(1.05); }
  }

  @keyframes scanline-scroll {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  .animate-crt-flicker {
    animation: crt-flicker 0.15s infinite;
  }

  .animate-scanline-scroll {
    animation: scanline-scroll 6s linear infinite;
  }
}
```

- [ ] **Step 2: Commit changes**

```bash
git add resources/css/app.css
git commit -m "style: map Tailwind theme colors to CSS variables for dynamic swapping"
```

---

### Task 2: Sync Canvas Background with CSS Variables

**Files:**
- Modify: `resources/js/Components/InteractiveBackground.jsx`

**Interfaces:**
- Consumes: CSS custom properties from DOM
- Produces: Dynamically themed canvas background

- [ ] **Step 1: Read CSS variables inside Canvas loop**

Modify [InteractiveBackground.jsx](file:///home/arifrenggy00/my_web/resources/js/Components/InteractiveBackground.jsx) to dynamically retrieve theme colors:

```jsx
import React, { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        let particles = [];
        const maxParticles = 60;
        const mouse = { x: null, y: null, radius: 120 };

        const getThemeColors = () => {
            const style = getComputedStyle(document.documentElement);
            const primary = style.getPropertyValue('--color-terminal-primary').trim() || '#00f0ff';
            const accent = style.getPropertyValue('--color-terminal-accent').trim() || '#ff007f';
            return [primary, accent];
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                const colors = getThemeColors();
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Update particle color to match current theme dynamically
                const colors = getThemeColors();
                if (!colors.includes(this.color)) {
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                }
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        };

        init();

        const connect = () => {
            const colors = getThemeColors();
            const primaryColor = colors[0];

            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const opacity = (1 - distance / 100) * 0.15;
                        ctx.strokeStyle = primaryColor.startsWith('#')
                            ? `${primaryColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
                            : `rgba(0, 240, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[a].x - mouse.x;
                    const dy = particles[a].y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const opacity = (1 - distance / mouse.radius) * 0.35;
                        ctx.strokeStyle = particles[a].color;
                        ctx.globalAlpha = opacity;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1.0; // Reset alpha
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40"
        />
    );
}
```

- [ ] **Step 2: Commit changes**

```bash
git add resources/js/Components/InteractiveBackground.jsx
git commit -m "feat: sync canvas particle colors dynamically with CSS theme variables"
```

---

### Task 3: Implement Theme Commands & Loading Logic

**Files:**
- Modify: `resources/js/Components/InteractiveCli.jsx`
- Modify: `resources/js/Layouts/ArsipLayout.jsx`

- [ ] **Step 1: Update InteractiveCli.jsx with theme command**

Modify [InteractiveCli.jsx](file:///home/arifrenggy00/my_web/resources/js/Components/InteractiveCli.jsx) to add the theme parsing logic:

```jsx
// Tambahkan objek tema di bagian atas component (di luar function atau di dalam component)
const themes = {
    cyber: {
        primary: '#00f0ff',
        accent: '#ff007f',
        warning: '#fee715',
        bg: '#0a0a0c',
        muted: 'rgba(0, 240, 255, 0.1)'
    },
    matrix: {
        primary: '#00ff00',
        accent: '#008000',
        warning: '#adff2f',
        bg: '#050505',
        muted: 'rgba(0, 255, 0, 0.1)'
    },
    deus: {
        primary: '#fee715',
        accent: '#ff8c00',
        warning: '#ffffff',
        bg: '#0f0e0a',
        muted: 'rgba(254, 231, 21, 0.1)'
    },
    vapor: {
        primary: '#ff007f',
        accent: '#00f0ff',
        warning: '#da70d6',
        bg: '#0f0a1c',
        muted: 'rgba(255, 0, 127, 0.1)'
    }
};

const applyTheme = (themeName) => {
    const t = themes[themeName];
    if (!t) return false;
    document.documentElement.style.setProperty('--color-terminal-primary', t.primary);
    document.documentElement.style.setProperty('--color-terminal-accent', t.accent);
    document.documentElement.style.setProperty('--color-terminal-warning', t.warning);
    document.documentElement.style.setProperty('--color-terminal-bg', t.bg);
    document.documentElement.style.setProperty('--color-terminal-muted', t.muted);
    localStorage.setItem('terminal-theme', themeName);
    return true;
};
```

Update command parsing case `theme` inside `handleKeyDown` (lines 140+):

```jsx
                case 'theme':
                    const selectedTheme = args[1];
                    if (!selectedTheme) {
                        setLogs(prev => [...prev,
                            'USAGE: theme [themeName]',
                            'AVAILABLE THEMES:',
                            '  cyber  - Cyan/Pink neon (Default)',
                            '  matrix - Hacker green screen',
                            '  deus   - Amber gold Deus Ex',
                            '  vapor  - Synthwave Pink/Cyan',
                            ''
                        ]);
                    } else if (applyTheme(selectedTheme.toLowerCase())) {
                        setLogs(prev => [...prev, `THEME SET TO: ${selectedTheme.toUpperCase()}`, '']);
                    } else {
                        setLogs(prev => [...prev, `ERROR: Theme "${selectedTheme}" not recognized.`, '']);
                    }
                    break;
```

Update `help` command logs output to include:
`  theme [theme_name]    - Swaps system UI color palette`

- [ ] **Step 2: Load theme on mount in ArsipLayout.jsx**

Modify [ArsipLayout.jsx](file:///home/arifrenggy00/my_web/resources/js/Layouts/ArsipLayout.jsx) to load the saved theme from `localStorage` in the `useEffect` block:

```jsx
    useEffect(() => {
        // Load theme from localStorage on mount
        const savedTheme = localStorage.getItem('terminal-theme') || 'cyber';
        const themes = {
            cyber: { primary: '#00f0ff', accent: '#ff007f', warning: '#fee715', bg: '#0a0a0c', muted: 'rgba(0, 240, 255, 0.1)' },
            matrix: { primary: '#00ff00', accent: '#008000', warning: '#adff2f', bg: '#050505', muted: 'rgba(0, 255, 0, 0.1)' },
            deus: { primary: '#fee715', accent: '#ff8c00', warning: '#ffffff', bg: '#0f0e0a', muted: 'rgba(254, 231, 21, 0.1)' },
            vapor: { primary: '#ff007f', accent: '#00f0ff', warning: '#da70d6', bg: '#0f0a1c', muted: 'rgba(255, 0, 127, 0.1)' }
        };
        const t = themes[savedTheme] || themes.cyber;
        document.documentElement.style.setProperty('--color-terminal-primary', t.primary);
        document.documentElement.style.setProperty('--color-terminal-accent', t.accent);
        document.documentElement.style.setProperty('--color-terminal-warning', t.warning);
        document.documentElement.style.setProperty('--color-terminal-bg', t.bg);
        document.documentElement.style.setProperty('--color-terminal-muted', t.muted);

        // Initial Logs
        setTimeout(() => addLog('KERNEL_LOADED_V4.0', 'SYS'), 500);
        setTimeout(() => addLog('SECURE_HANDSHAKE_COMPLETE', 'SEC'), 1200);

        // Inertia Navigation Logs
        const startListener = router.on('start', (event) => {
            setIsTransitioning(true);
            setLoadingProgress(10);
            addLog(`FETCHING_NODE: ${event.detail.visit.url.pathname}`, 'INFO');
        });

        const progressInterval = isTransitioning && setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.floor(Math.random() * 15 + 5);
            });
        }, 80);

        const finishListener = router.on('finish', () => {
            setLoadingProgress(100);
            setTimeout(() => {
                setIsTransitioning(false);
                setLoadingProgress(0);
                addLog('DOM_UPDATED_READY', 'SYS');
            }, 350);
        });

        return () => {
            startListener();
            finishListener();
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [isTransitioning]);
```

- [ ] **Step 3: Commit changes**

```bash
git add resources/js/Components/InteractiveCli.jsx resources/js/Layouts/ArsipLayout.jsx
git commit -m "feat: implement CLI theme swapper and reload persistence"
```

---

### Task 4: Build Verification

**Files:**
- None

- [ ] **Step 1: Compile assets**

Run: `npm run build`
Expected: PASS with zero errors

- [ ] **Step 2: Run test suite**

Run: `vendor/bin/phpunit`
Expected: PASS
