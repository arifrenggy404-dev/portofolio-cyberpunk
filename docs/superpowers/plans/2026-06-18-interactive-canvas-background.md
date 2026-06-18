# Interactive Canvas Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a responsive, interactive HTML5 Canvas background rendering slow-moving particles in neon cyan and pink that draw connections between each other and to the mouse cursor.

**Architecture:** Create a React component `InteractiveBackground` wrapping a `<canvas>` element with 3D-like pointer events handling, overlaying it as a fixed element behind the layout.

**Tech Stack:** React 19, HTML5 Canvas API.

## Global Constraints
- Canvas should not block pointer events (use `pointer-events-none`).
- Keep maximum particle count at 60 for performance.

---

### Task 1: Create InteractiveBackground Component

**Files:**
- Create: `resources/js/Components/InteractiveBackground.jsx`

**Interfaces:**
- Consumes: none
- Produces: `InteractiveBackground` component

- [ ] **Step 1: Write InteractiveBackground component**

Create [InteractiveBackground.jsx](file:///home/arifrenggy00/my_web/resources/js/Components/InteractiveBackground.jsx) with the following content:

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

        const colors = ['#00f0ff', '#ff007f'];

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
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const opacity = (1 - distance / 100) * 0.15;
                        ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
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
                        ctx.strokeStyle = particles[a].color === '#00f0ff' 
                            ? `rgba(0, 240, 255, ${opacity})` 
                            : `rgba(255, 0, 127, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
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
            className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40 bg-[#0a0a0c]"
        />
    );
}
```

- [ ] **Step 2: Commit changes**

```bash
git add resources/js/Components/InteractiveBackground.jsx
git commit -m "feat: add InteractiveBackground canvas component"
```

---

### Task 2: Integrate into ArsipLayout

**Files:**
- Modify: `resources/js/Layouts/ArsipLayout.jsx`

**Interfaces:**
- Consumes: `InteractiveBackground` component
- Produces: Background visual coverage in entire app

- [ ] **Step 1: Import and render in ArsipLayout**

Modify [ArsipLayout.jsx](file:///home/arifrenggy00/my_web/resources/js/Layouts/ArsipLayout.jsx) to add the canvas background component:

```jsx
import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { Terminal, Cpu, Layers, Zap, MessageSquare } from 'lucide-react';
import AsciiHeader from '../Components/AsciiHeader';
import TerminalStatusBar from '../Components/TerminalStatusBar';
import TerminalNotifications from '../Components/TerminalNotifications';
import InteractiveBackground from '../Components/InteractiveBackground';

export default function ArsipLayout({ children }) {
    const [logs, setLogs] = useState([]);

    const addLog = (message, type = 'SYS') => {
        const id = Math.random().toString(36).substr(2, 9);
        const newLog = {
            id,
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        setLogs(prev => [...prev, newLog]);
        setTimeout(() => {
            setLogs(prev => prev.filter(l => l.id !== id));
        }, 4000);
    };

    useEffect(() => {
        // Initial Logs
        setTimeout(() => addLog('KERNEL_LOADED_V4.0', 'SYS'), 500);
        setTimeout(() => addLog('SECURE_HANDSHAKE_COMPLETE', 'SEC'), 1200);

        // Inertia Navigation Logs
        const startListener = router.on('start', (event) => {
            addLog(`FETCHING_NODE: ${event.detail.visit.url.pathname}`, 'INFO');
        });

        const finishListener = router.on('finish', () => {
            addLog('DOM_UPDATED_READY', 'SYS');
        });

        return () => {
            startListener();
            finishListener();
        };
    }, []);

    const navItems = [
        { href: '/identitas', label: 'identitas', icon: Cpu },
        { href: '/misi', label: 'misi', icon: Layers },
        { href: '/arsenal', label: 'arsenal', icon: Zap },
        { href: '/jalur-komunikasi', label: 'komunikasi', icon: MessageSquare }
    ];

    return (
        <div className="min-h-screen bg-transparent text-terminal-secondary pt-12 p-4 md:p-8 overflow-hidden relative font-mono selection:bg-terminal-primary selection:text-terminal-bg">
            <InteractiveBackground />
            <TerminalStatusBar />
            <TerminalNotifications logs={logs} />
            
            <div className="absolute inset-0 scanline pointer-events-none opacity-5 z-50"></div>
            
            <header className="max-w-7xl mx-auto border-b border-terminal pb-6 mb-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 relative z-10">
                <h1 className="sr-only">Arif Renggy - Portofolio Developer Laravel & React</h1>
                <AsciiHeader />
                <div className="text-center md:text-right w-full md:w-auto">
                    <div className="flex items-center justify-center md:justify-end gap-2 text-terminal-primary font-mono text-[10px] uppercase mb-1">
                        <span className="inline-block w-2 h-2 bg-terminal-primary rounded-full animate-pulse"></span>
                        Terminal Session: Active
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">
                        Node: arif-renggy-v4.0.1
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                <aside className="space-y-6">
                    <nav className="space-y-1">
                        <div className="text-terminal-primary text-[10px] font-mono mb-2 uppercase tracking-widest opacity-50">Directory</div>
                        {navItems.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href} 
                                className={`flex items-center gap-3 p-2 border border-transparent hover:border-terminal hover:bg-terminal-primary/5 transition-all group ${window.location.pathname === item.href ? 'text-terminal-primary border-terminal bg-terminal-primary/10' : 'text-gray-400'}`}
                            >
                                <span className="text-terminal-primary opacity-50 group-hover:opacity-100">{'>'}</span>
                                <span className="font-mono text-xs tracking-wider">/home/{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>
                
                <main className="md:col-span-3 border border-terminal p-6 relative bg-terminal-muted/10 backdrop-blur-sm min-h-[500px]">
                    {/* Decorative Terminal Corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-terminal-primary"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-terminal-primary"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-terminal-primary"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-terminal-primary"></div>
                    
                    {children}
                </main>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Commit changes**

```bash
git add resources/js/Layouts/ArsipLayout.jsx
git commit -m "feat: integrate InteractiveBackground into ArsipLayout"
```

---

### Task 3: Build Verification

**Files:**
- None

- [ ] **Step 1: Compile assets**

Run: `npm run build`
Expected: PASS with zero errors

- [ ] **Step 2: Run test suite**

Run: `vendor/bin/phpunit`
Expected: PASS
