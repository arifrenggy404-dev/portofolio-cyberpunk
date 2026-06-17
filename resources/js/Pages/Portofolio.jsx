import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ExternalLink, Layers, ShieldAlert, Cpu } from 'lucide-react';

const IkonGithub = ({ size = 14, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Portofolio({ proyek: dataProyek = [] }) {
  const [filterTeknologi, setFilterTeknologi] = useState('Semua');

  // Mengumpulkan seluruh teknologi unik untuk filter
  const semuaTeknologi = ['Semua', ...new Set(dataProyek.flatMap(p => p.teknologi_utama || []))];

  const proyekTersaring = filterTeknologi === 'Semua' 
    ? dataProyek 
    : dataProyek.filter(p => (p.teknologi_utama || []).includes(filterTeknologi));

  // Animasi Framer Motion
  const animasiKontainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const animasiKartu = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-gray-100 font-sans grid-bg p-8 overflow-hidden">
      {/* Efek Scanline CRT Cyberpunk */}
      <div className="pointer-events-none absolute inset-0 scanline opacity-20 z-50"></div>

      {/* Header Portofolio */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#00f0ff]/30 pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#00f0ff] mb-2 font-mono text-sm tracking-wider uppercase">
            <Terminal size={16} />
            <span>Terminal Sistem Aktif</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#ff007f] to-[#fee715] tracking-tight uppercase">
            Sistem Informasi Portofolio
          </h1>
        </div>
        <div className="text-right font-mono text-[#ff007f] text-sm">
          <span>TANGGAL: 17_06_2026</span>
          <br />
          <span>STATUS: ONLINE</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Navigasi Filter Kategori */}
        <section className="mb-10 flex flex-wrap gap-3 items-center">
          <span className="font-mono text-[#fee715] text-sm flex items-center gap-1.5 mr-2">
            <Layers size={14} /> FILTER:
          </span>
          {semuaTeknologi.map((teknologi) => (
            <button
              key={teknologi}
              onClick={() => setFilterTeknologi(teknologi)}
              className={`px-4 py-1.5 font-mono text-xs uppercase tracking-wider border rounded-none transition-all duration-300 cursor-pointer ${
                filterTeknologi === teknologi
                  ? 'bg-[#00f0ff] text-black border-[#00f0ff] neon-glow-cyan'
                  : 'bg-transparent text-gray-400 border-gray-700 hover:border-[#ff007f] hover:text-[#ff007f]'
              }`}
            >
              {teknologi}
            </button>
          ))}
        </section>

        {/* Grid Kartu Proyek */}
        <motion.section 
          variants={animasiKontainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {proyekTersaring.map((proyek) => (
              <motion.article
                key={proyek.id}
                variants={animasiKartu}
                layout
                exit="exit"
                className="group relative bg-[#121214] border border-gray-800 hover:border-[#ff007f]/80 p-6 flex flex-col justify-between transition-all duration-300 neon-glow-pink"
              >
                {/* Efek Sudut Cyberpunk */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-[#ff007f] clip-path-polygon"></div>

                <div>
                  {/* Gambar Portofolio */}
                  <div className="relative w-full h-48 bg-[#0a0a0c] mb-6 overflow-hidden border border-gray-800 group-hover:border-[#00f0ff]/50 transition-colors duration-300">
                    {proyek.jalur_gambar ? (
                      <img 
                        src={`/storage/${proyek.jalur_gambar}`} 
                        alt={proyek.nama_proyek} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col justify-center items-center text-gray-600 font-mono text-xs">
                        <Cpu size={32} className="mb-2 text-[#00f0ff]/40 animate-pulse" />
                        <span>GAMBAR_TIDAK_TERSEDIA</span>
                      </div>
                    )}
                  </div>

                  {/* Judul & Deskripsi */}
                  <h3 className="text-xl font-bold tracking-tight text-white mb-2 group-hover:text-[#00f0ff] transition-colors duration-300 uppercase">
                    {proyek.nama_proyek}
                  </h3>
                  <p className="text-sm text-gray-400 font-sans leading-relaxed mb-6">
                    {proyek.deskripsi}
                  </p>
                </div>

                <div>
                  {/* Teknologi List */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(proyek.teknologi_utama || []).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 font-mono text-[10px] bg-black text-[#fee715] border border-[#fee715]/20">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Tautan Proyek */}
                  <div className="flex justify-between items-center border-t border-gray-800 pt-4 font-mono text-xs">
                    {proyek.tautan_github ? (
                      <a 
                        href={proyek.tautan_github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        <IkonGithub size={14} /> KODE_SUMBER
                      </a>
                    ) : (
                      <span className="text-gray-600 flex items-center gap-1.5"><ShieldAlert size={14} /> PRIVAT</span>
                    )}

                    {proyek.tautan_langsung ? (
                      <a 
                        href={proyek.tautan_langsung} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 text-[#00f0ff] hover:text-white transition-colors duration-300"
                      >
                        DEMO <ExternalLink size={12} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.section>
      </main>
    </div>
  );
}
