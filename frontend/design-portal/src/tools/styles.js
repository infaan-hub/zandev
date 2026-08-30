import { stableHash } from './utils';

const VARIANTS = [
  'standard', 'compact', 'horizontal', 'featured', 'terminal', 'code',
  'metric', 'glass', 'holographic', 'perspective', 'bento', 'editorial',
  'neon', 'floating', 'minimal', 'glitch', 'cyber', 'organic',
  'retro', 'luxury', 'scientific', 'cosmic', 'abstract', 'overlay',
];

const BG_FAMILIES = [
  { id: 'solid', css: 'bg-[#0a0a0a]' },
  { id: 'elevated', css: 'bg-[#111111]' },
  { id: 'panel', css: 'bg-[#0d0d0d]' },
  { id: 'surface', css: 'bg-[#0f0f0f]' },
  { id: 'deep', css: 'bg-[#060606]' },
  { id: 'charcoal', css: 'bg-[#1a1a1a]' },
  { id: 'graphite', css: 'bg-[#141414]' },
  { id: 'obsidian', css: 'bg-[#080808]' },
  { id: 'slate', css: 'bg-[#181818]' },
  { id: 'midnight', css: 'bg-[#0c0c14]' },
  { id: 'void', css: 'bg-[#020204]' },
  { id: 'ink', css: 'bg-[#050508]' },
];

const BORDER_FAMILIES = [
  { id: 'subtle', css: 'border border-white/[0.06]' },
  { id: 'medium', css: 'border border-white/[0.10]' },
  { id: 'strong', css: 'border border-white/[0.15]' },
  { id: 'glow', css: 'border border-white/[0.08]' },
  { id: 'accent', css: 'border' },
  { id: 'double', css: 'border-2 border-white/[0.08]' },
  { id: 'dashed', css: 'border border-dashed border-white/[0.10]' },
  { id: 'none', css: '' },
  { id: 'gradient', css: 'border border-transparent' },
  { id: 'thick', css: 'border-2 border-white/[0.06]' },
];

const ACCENT_PALETTES = [
  { name: 'purple', from: '#8b5cf6', to: '#a78bfa', glow: 'rgba(139,92,246,0.3)' },
  { name: 'blue', from: '#3b82f6', to: '#60a5fa', glow: 'rgba(59,130,246,0.3)' },
  { name: 'cyan', from: '#06b6d4', to: '#22d3ee', glow: 'rgba(6,182,212,0.3)' },
  { name: 'green', from: '#10b981', to: '#34d399', glow: 'rgba(16,185,129,0.3)' },
  { name: 'yellow', from: '#f59e0b', to: '#fbbf24', glow: 'rgba(245,158,11,0.3)' },
  { name: 'orange', from: '#f97316', to: '#fb923c', glow: 'rgba(249,115,22,0.3)' },
  { name: 'red', from: '#ef4444', to: '#f87171', glow: 'rgba(239,68,68,0.3)' },
  { name: 'pink', from: '#ec4899', to: '#f472b6', glow: 'rgba(236,72,153,0.3)' },
  { name: 'rose', from: '#f43f5e', to: '#fb7185', glow: 'rgba(244,63,94,0.3)' },
  { name: 'emerald', from: '#059669', to: '#10b981', glow: 'rgba(5,150,105,0.3)' },
  { name: 'teal', from: '#14b8a6', to: '#2dd4bf', glow: 'rgba(20,184,166,0.3)' },
  { name: 'indigo', from: '#6366f1', to: '#818cf8', glow: 'rgba(99,102,241,0.3)' },
  { name: 'violet', from: '#7c3aed', to: '#a78bfa', glow: 'rgba(124,58,237,0.3)' },
  { name: 'amber', from: '#d97706', to: '#fbbf24', glow: 'rgba(217,119,6,0.3)' },
  { name: 'lime', from: '#84cc16', to: '#a3e635', glow: 'rgba(132,204,22,0.3)' },
  { name: 'white', from: '#e5e5e5', to: '#ffffff', glow: 'rgba(255,255,255,0.15)' },
  { name: 'silver', from: '#94a3b8', to: '#cbd5e1', glow: 'rgba(148,163,184,0.2)' },
  { name: 'gold', from: '#ca8a04', to: '#facc15', glow: 'rgba(202,138,4,0.3)' },
  { name: 'copper', from: '#c2410c', to: '#f97316', glow: 'rgba(194,65,12,0.3)' },
  { name: 'neon-green', from: '#39ff14', to: '#00ff41', glow: 'rgba(57,255,20,0.3)' },
  { name: 'neon-pink', from: '#ff006e', to: '#ff4da6', glow: 'rgba(255,0,110,0.3)' },
  { name: 'neon-blue', from: '#00d4ff', to: '#0099ff', glow: 'rgba(0,212,255,0.3)' },
  { name: 'plasma', from: '#bf5af2', to: '#da8fff', glow: 'rgba(191,90,242,0.3)' },
  { name: 'spectrum', from: '#ff6b6b', to: '#4ecdc4', glow: 'rgba(255,107,107,0.2)' },
];

const HOVER_EFFECTS = [
  'lift', 'glow', 'scale', 'tilt', 'border', 'shadow', 'brighten',
  'shrink', 'rotate', 'blur-bg', 'slide', 'morph', 'pulse', 'shake',
  'magnet', 'parallax', 'elastic', 'spring',
];

const ANIMATIONS = [
  'none', 'fade-in', 'slide-up', 'slide-left', 'scale-in', 'blur-in',
  'flip-in', 'rotate-in', 'bounce-in', 'elastic-in', 'stagger',
  'draw-in', ' typewriter', 'wave', 'pulse', 'float',
];

const DECORATIONS = [
  'none', 'dots', 'grid', 'lines', 'glow-spot', 'gradient-orb',
  'noise', 'grain', 'scan-line', 'corner-accent', 'stripe',
  'radial', 'conic', 'mesh', 'circuit', 'constellation',
];

const FONT_TREATMENTS = [
  'default', 'mono', 'display', 'condensed', 'wide', 'thin',
  'heavy', 'gradient-text', 'uppercase', 'tracking-wide',
];

const IMAGE_TREATMENTS = [
  'cover', 'contain', 'mask-bottom', 'mask-circle', 'overlay-gradient',
  'angled', 'blurred-bg', 'split', 'inset', 'glow-border',
  'polaroid', 'film-strip', 'rounded-lg', 'diamond', 'hexagon',
];

function pick(arr, idx) {
  return arr[idx % arr.length];
}

function generateStyle(index) {
  const h = stableHash(String(index));
  const variant = pick(VARIANTS, h % VARIANTS.length);
  const bg = pick(BG_FAMILIES, (h >> 3) % BG_FAMILIES.length);
  const border = pick(BORDER_FAMILIES, (h >> 6) % BORDER_FAMILIES.length);
  const accent = pick(ACCENT_PALETTES, (h >> 9) % ACCENT_PALETTES.length);
  const hover = pick(HOVER_EFFECTS, (h >> 12) % HOVER_EFFECTS.length);
  const anim = pick(ANIMATIONS, (h >> 15) % ANIMATIONS.length);
  const deco = pick(DECORATIONS, (h >> 18) % DECORATIONS.length);
  const font = pick(FONT_TREATMENTS, (h >> 21) % FONT_TREATMENTS.length);
  const img = pick(IMAGE_TREATMENTS, (h >> 24) % IMAGE_TREATMENTS.length);
  const radius = [6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32][(h >> 27) % 11];
  const hasGradientBorder = (h >> 30) % 5 === 0;
  const hasAnimatedBg = (h >> 31) % 7 === 0;
  const hasGlow = (h >> 33) % 4 === 0;

  const names = [
    'Obsidian Minimal', 'Midnight Glass', 'Aurora Glass', 'Liquid Glass',
    'Frosted Crystal', 'Black Chrome', 'Carbon Fiber', 'Graphite Studio',
    'Dark Titanium', 'Platinum Minimal', 'Pure Monochrome', 'Soft Monochrome',
    'Editorial Minimal', 'Swiss Grid', 'Neo Swiss', 'Bauhaus Modern',
    'Brutalist Black', 'Soft Brutalism', 'Neo Brutalism', 'Luxury Editorial',
    'Premium SaaS', 'Linear-inspired', 'Vercel-inspired', 'Apple-inspired',
    'Vision Pro Glass', 'macOS Panel', 'iOS Dynamic Island', 'Material 3',
    'Fluent Modern', 'Stripe-inspired', 'Notion-inspired', 'Raycast-inspired',
    'Arc Browser-inspired', 'Superhuman-inspired', 'Framer-inspired', 'Webflow-inspired',
    'Figma-inspired', 'GitHub Dark', 'GitLab Dark', 'Developer Console',
    'Terminal Minimal', 'IDE Workspace', 'Code Editor', 'Command Palette',
    'Documentation Portal', 'Technical Blueprint', 'Engineering Dashboard',
    'Developer Workspace', 'Product Hunt Modern', 'Startup Landing',
    'Neon Glass', 'Purple Glass', 'Aqua Glass', 'Emerald Glass',
    'Rose Glass', 'Blue Frost', 'Arctic Glass', 'Ocean Glass',
    'Sunset Glass', 'Twilight Glass', 'Aurora Borealis', 'Aurora Gradient',
    'Northern Lights', 'Cosmic Gradient', 'Nebula Gradient', 'Solar Flare',
    'Eclipse Glass', 'Moonlight Glass', 'Starlight Glass', 'Holographic Glass',
    'Iridescent Glass', 'Prismatic Glass', 'Rainbow Refraction', 'Chrome Gradient',
    'Metallic Gradient', 'Mesh Gradient', 'Animated Mesh', 'Radial Glow',
    'Conic Glow', 'Ambient Glow', 'Soft Glow', 'Edge Glow',
    'Neon Edge', 'Gradient Border', 'Animated Border', 'Rotating Border',
    'Light Sweep', 'Spotlight Glass', 'Cursor Spotlight', 'Magnetic Glow',
    'Liquid Gradient', 'Fluid Gradient', 'Morphing Gradient', 'Dreamy Gradient',
    'Vaporwave Gradient', 'Pastel Gradient', 'Candy Gradient', 'Electric Gradient',
    'Cyber Gradient', 'Hypercolor', '3D Tilt', '3D Perspective',
    '3D Pop-Out', '3D Floating', '3D Depth Stack', '3D Layered',
    '3D Hologram', '3D Holographic Foil', '3D Cube', '3D Prism',
    '3D Sphere', '3D Orbital', '3D Card Flip', 'Horizontal Flip',
    'Vertical Flip', 'Diagonal Flip', 'Book Fold', 'Page Turn',
    'Card Peel', 'Iris Reveal', 'Magnetic Card', 'Magnetic Hover',
    'Cursor Follow', 'Cursor Parallax', 'Mouse Parallax', 'Depth Parallax',
    'Perspective Shift', 'Kinetic Card', 'Elastic Card', 'Spring Card',
    'Physics Card', 'Floating Card', 'Levitation Card', 'Bounce Card',
    'Elastic Grid', 'Expanding Card', 'Morphing Card', 'Shared Element',
    'View Transition', 'Zoom Reveal', 'Scale Reveal', 'Blur Reveal',
    'Blur-to-Sharp', 'Slide Reveal', 'Mask Reveal', 'Clip-Path Reveal',
    'Circular Reveal', 'Diagonal Reveal', 'Radial Reveal', 'Shutter Reveal',
    'Cyberpunk Neon', 'Cyber Grid', 'Cyber Terminal', 'Hacker Console',
    'Matrix Rain', 'Digital Rain', 'CRT Terminal', 'Retro Terminal',
    'DOS Terminal', 'ASCII Terminal', 'Green Phosphor', 'Amber Terminal',
    'Blue Terminal', 'Synthwave', 'Retrowave', 'Vaporwave',
    'Cyber Tokyo', 'Neon Tokyo', 'Cyber City', 'Digital City',
    'Futuristic HUD', 'Sci-Fi HUD', 'Spaceship HUD', 'Mission Control',
    'NASA Console', 'Satellite Control', 'Radar Interface', 'Sonar Interface',
    'Tactical Interface', 'Military HUD', 'Quantum Interface', 'AI Neural Network',
    'Neural Grid', 'Neural Glow', 'Machine Learning', 'Data Matrix',
    'Digital Circuit', 'Circuit Board', 'CPU Architecture', 'Network Topology',
    'Blockchain Grid', 'Crypto Terminal', 'Web3 Glass', 'DeFi Dashboard',
    'Quantum Grid', 'Particle Field', 'Particle Network', 'Connected Nodes',
    'Digital Orbit', 'AI Command Center', 'Liquid Morph', 'Organic Blob',
    'Organic Shapes', 'Gooey UI', 'Fluid UI', 'Soft Clay',
    'Claymorphism', 'Neumorphism', 'Soft Neumorphism', 'Dark Neumorphism',
    'Retro Pixel', 'Pixel Art', '8-Bit Arcade', '16-Bit Arcade',
    'Game UI', 'RPG Inventory', 'Trading Card', 'Collectible Card',
    'Achievement Card', 'Quest Card', 'Arcade Neon', 'Game HUD',
    'Cyber Game', 'Sci-Fi Game', 'Comic Book', 'Manga UI',
    'Anime-inspired', 'Sketch UI', 'Hand Drawn', 'Paper UI',
    'Notebook UI', 'Sticky Note', 'Newspaper', 'Magazine',
    'Editorial Grid', 'Polaroid', 'Film Strip', 'Cinema UI',
    'VHS Retro', 'Cassette Retro', 'Music Player', 'Vinyl Record',
    'Spotify-inspired', 'Sound Wave', 'Equalizer', 'Audio Visualizer',
    'Gradient Typography', 'Kinetic Typography', 'Experimental Typography', 'Art Gallery',
    'Bento Grid', 'Asymmetric Bento', 'Masonry Grid', 'Editorial Cards',
    'Magazine Cards', 'Portfolio Cards', 'Product Cards', 'Pricing Cards',
    'Feature Cards', 'Service Cards', 'Integration Cards', 'API Cards',
    'Tool Cards', 'Technology Cards', 'Framework Cards', 'Language Cards',
    'Library Cards', 'GitHub Repository Cards', 'Documentation Cards', 'Code Snippet Cards',
    'Terminal Command Cards', 'API Endpoint Cards', 'Database Cards', 'Server Status Cards',
    'Monitoring Cards', 'Analytics Cards', 'KPI Cards', 'Statistic Cards',
    'Progress Cards', 'Timeline Cards', 'Activity Cards', 'Notification Cards',
    'Changelog Cards', 'Release Cards', 'User Profile Cards', 'Team Cards',
    'Testimonial Cards', 'Review Cards', 'Bookmark Cards', 'Favorite Cards',
    'Save-for-Later Cards', 'Expandable Cards', 'Swipe Cards', 'Stack Cards',
    'Carousel Cards', 'Accordion Cards', 'Drag-and-Drop Cards', 'Sortable Cards',
    'Infinite Canvas Cards', 'Experimental Fusion Cards',
  ];

  return {
    id: index,
    name: names[index % names.length],
    variant,
    bg,
    border,
    accent,
    hover,
    animation: anim,
    decoration: deco,
    fontTreatment: font,
    imageTreatment: img,
    radius,
    hasGradientBorder,
    hasAnimatedBg,
    hasGlow,
  };
}

const _cache = new Array(300);
for (let i = 0; i < 300; i++) {
  _cache[i] = generateStyle(i);
}

export const TOOL_STYLES = _cache;

export function getStyleForTool(toolId) {
  const idx = stableHash(String(toolId)) % 300;
  return TOOL_STYLES[idx];
}

export function getStyleById(id) {
  return TOOL_STYLES[id] || TOOL_STYLES[0];
}

export const STYLE_CATEGORIES = [
  { id: 'all', label: 'All Styles' },
  { id: 'glass', label: 'Glass', filter: (s) => s.variant === 'glass' || s.variant === 'holographic' },
  { id: 'minimal', label: 'Minimal', filter: (s) => s.variant === 'minimal' || s.variant === 'editorial' },
  { id: 'neon', label: 'Neon / Cyber', filter: (s) => s.variant === 'neon' || s.variant === 'cyber' || s.variant === 'glitch' },
  { id: '3d', label: '3D / Motion', filter: (s) => s.variant === 'perspective' || s.variant === 'floating' },
  { id: 'dev', label: 'Developer', filter: (s) => s.variant === 'terminal' || s.variant === 'code' },
  { id: 'creative', label: 'Creative', filter: (s) => s.variant === 'organic' || s.variant === 'abstract' || s.variant === 'retro' },
  { id: 'premium', label: 'Premium', filter: (s) => s.variant === 'luxury' || s.variant === 'featured' },
  { id: 'data', label: 'Data / Metrics', filter: (s) => s.variant === 'metric' || s.variant === 'scientific' },
  { id: 'space', label: 'Cosmic / Space', filter: (s) => s.variant === 'cosmic' },
];
