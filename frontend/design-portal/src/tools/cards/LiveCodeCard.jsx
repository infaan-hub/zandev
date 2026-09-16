import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Copy, Check, Lock } from 'lucide-react';
import { cn, formatNumber } from '../utils';
import { useAuth } from '../../lib/AuthContext';

function LiveCodeCard({ tool, style, onExport, onClick, index }) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const cardRef = useRef(null);
  const { user } = useAuth();

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleCopy = useCallback((e) => {
    e.stopPropagation();
    if (!user) { setShowLoginModal(true); return; }
    const parts = [];
    if (tool.html_code) parts.push(`<!-- HTML -->\n${tool.html_code}`);
    if (tool.css_code) parts.push(`/* CSS */\n${tool.css_code}`);
    if (tool.js_code) parts.push(`// JavaScript\n${tool.js_code}`);
    if (tool.code && !parts.length) parts.push(tool.code);
    navigator.clipboard.writeText(parts.join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [tool, user]);

  const accentRgb = style.accentRgb || '99,102,241';
  const accent = style.accent || '#6366f1';
  const hasLiveCode = Boolean(tool.html_code || tool.css_code || tool.js_code);

  return (
    <>
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.4) }}
      className="group"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className="relative overflow-hidden rounded-[18px] border border-white/[0.06] bg-[#080808] transition-all duration-300 hover:border-white/[0.12] cursor-pointer"
        style={{ aspectRatio: '4/3' }}
      >
        {/* Preview Area */}
        <div className="absolute inset-0 z-[2] overflow-hidden">
          {tool.preview ? (
            <img
              src={tool.preview}
              alt={tool.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: `rgba(${accentRgb}, 0.2)` }}
            >
              <span className="text-4xl font-bold">{tool.name?.charAt(0)}</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 z-[5] flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `rgba(${accentRgb}, 0.15)`,
              color: accent,
              backdropFilter: 'blur(8px)',
            }}>
            {tool.framework}
          </span>
          {tool.price === 'Free' || tool.price === 0 ? (
            <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-green-500/15 text-green-400">
              Free
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-yellow-500/15 text-yellow-400">
              ${tool.price}
            </span>
          )}
        </div>

        {/* Hover action */}
        <div className={cn(
          'absolute top-3 right-3 z-[5] transition-opacity duration-200',
          isHovered ? 'opacity-100' : 'opacity-0',
        )}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
            }}>
            <Eye size={12} style={{ color: 'white' }} />
          </div>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 z-[5] flex flex-col justify-end p-4">
          <h3 className="text-[13px] font-semibold mb-1 line-clamp-1 text-white">
            {tool.name}
          </h3>
          <p className="text-[10px] line-clamp-2 mb-3 text-[#888]">
            {tool.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[9px] text-[#555]">
              <span>{formatNumber(tool.views)} views</span>
              <span>{formatNumber(tool.exports)} exports</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleCopy}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 bg-white/[0.08] hover:bg-white/[0.15]"
                title="Copy code"
              >
                {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} className="text-[#aaa]" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); if (!user) { setShowLoginModal(true); return; } onExport?.(tool); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ backgroundColor: `rgba(${accentRgb}, 0.1)` }}
              >
                <Download size={11} style={{ color: accent }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    {showLoginModal && (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowLoginModal(false)}>
        <div className="w-full max-w-[360px] p-6 rounded-2xl border border-white/[0.10] bg-[#0a0a0a] text-center" onClick={e => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-[#4ade80]" />
          </div>
          <h3 className="text-[16px] font-semibold text-white mb-2">Login Required</h3>
          <p className="text-[12px] text-[#666] mb-6">Sign in to copy code and download files.</p>
          <div className="flex gap-3">
            <a href="/signin" className="flex-1 h-[40px] rounded-lg bg-white text-black text-[12px] font-semibold flex items-center justify-center hover:-translate-y-0.5 transition-transform">
              Sign In
            </a>
            <a href="/signup" className="flex-1 h-[40px] rounded-lg border border-white/[0.10] text-white text-[12px] font-semibold flex items-center justify-center hover:bg-white/[0.05] transition-colors">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default memo(LiveCodeCard);
