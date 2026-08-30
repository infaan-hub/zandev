import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Copy, Check, Download, Eye, Code, Monitor, Tablet, Smartphone,
  RotateCcw, Paintbrush, Palette, Type, Zap, ChevronDown, X, Save, AlertTriangle
} from 'lucide-react';
import PageLayout from '../components/PageLayout';
import LivePreview from '../tools/LivePreview';
import { api } from '../lib/api';

const CODE_TABS = [
  { key: 'html', label: 'HTML' },
  { key: 'css', label: 'CSS' },
  { key: 'js', label: 'JavaScript' },
];

const VIEWPORT_SIZES = [
  { key: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
  { key: 'tablet', label: 'Tablet', icon: Tablet, width: '768px' },
  { key: 'mobile', label: 'Mobile', icon: Smartphone, width: '375px' },
];

const CUSTOMIZER_TABS = [
  { key: 'customize', label: 'Customize', icon: Paintbrush },
  { key: 'code', label: 'Code', icon: Code },
];

function ColorPicker({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-[#888]">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="w-[28px] h-[28px] rounded-[6px] border border-white/[0.10] bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-[2px] [&::-webkit-color-swatch]:rounded-[4px] [&::-webkit-color-swatch]:border-none"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-[80px] h-[28px] px-[8px] rounded-[6px] border border-white/[0.08] bg-white/[0.03] text-[10px] text-[#ccc] font-mono outline-none focus:border-white/[0.20] transition-colors"
        />
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-[6px]">
        <span className="text-[10px] text-[#888]">{label}</span>
        <span className="text-[10px] text-[#666] font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-[4px] rounded-full appearance-none bg-white/[0.08] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[10px] text-[#888] mb-[4px]">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[32px] px-[10px] rounded-[6px] border border-white/[0.08] bg-white/[0.03] text-[11px] text-white outline-none focus:border-white/[0.20] transition-colors placeholder-[#444]"
      />
    </div>
  );
}

function extractTextPlaceholders(html) {
  const texts = [];
  const seen = new Set();
  const regex = /<(?:h[1-6]|p|span|a|button|label|li|td|th|div)[^>]*>([^<]+)</gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].trim();
    if (text && !seen.has(text) && text.length > 1 && text.length < 60) {
      seen.add(text);
      texts.push(text);
    }
  }
  return texts;
}

function extractColorPlaceholders(html, css) {
  const colors = [];
  const seen = new Set();
  const hexRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
  let match;
  while ((match = hexRegex.exec(css)) !== null) {
    const c = match[0].toLowerCase();
    if (!seen.has(c)) { seen.add(c); colors.push(c); }
  }
  const attrRegex = /data-[a-z-]+="(#[0-9a-fA-F]{3,8})"/gi;
  while ((match = attrRegex.exec(html)) !== null) {
    const c = match[1].toLowerCase();
    if (!seen.has(c)) { seen.add(c); colors.push(c); }
  }
  const rgbRegex = /rgba?\([^)]+\)/gi;
  while ((match = rgbRegex.exec(html)) !== null) {
    if (!seen.has(match[0])) { seen.add(match[0]); colors.push(match[0]); }
  }
  return colors;
}

function applyCustomizations(html, css, js, customizations) {
  let h = html;
  let c = css;
  let j = js;

  if (customizations.texts) {
    Object.entries(customizations.texts).forEach(([orig, val]) => {
      if (val && val !== orig) {
        h = h.split(orig).join(val);
      }
    });
  }

  if (customizations.colors) {
    Object.entries(customizations.colors).forEach(([orig, val]) => {
      if (val && val !== orig) {
        const lc = orig.toLowerCase();
        const vc = val.toLowerCase();
        h = h.split(lc).join(vc);
        h = h.split(orig).join(val);
        c = c.split(lc).join(vc);
        c = c.split(orig).join(val);
      }
    });
  }

  if (customizations.speed !== undefined && customizations.speed !== 1) {
    const mult = customizations.speed;
    if (/animation-duration/i.test(c)) {
      c = c.replace(/animation-duration:\s*([\d.]+)s/g, (_, dur) =>
        `animation-duration: ${(parseFloat(dur) / mult).toFixed(2)}s`);
    }
    h = h.replace(/data-speed="([\d.]+)"/g, (_, val) =>
      `data-speed="${(parseFloat(val) * mult).toFixed(1)}"`);
  }

  if (customizations.design) {
    Object.entries(customizations.design).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        const varRegex = new RegExp(`--zan-${key}:\\s*[^;]+;`, 'g');
        if (varRegex.test(c)) {
          c = c.replace(varRegex, `--zan-${key}: ${val};`);
        }
      }
    });
  }

  return { html: h, css: c, js: j };
}

export default function DesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [origHtml, setOrigHtml] = useState('');
  const [origCss, setOrigCss] = useState('');
  const [origJs, setOrigJs] = useState('');

  const [curHtml, setCurHtml] = useState('');
  const [curCss, setCurCss] = useState('');
  const [curJs, setCurJs] = useState('');

  const [custom, setCustom] = useState({ texts: {}, colors: {}, speed: 1, design: {} });
  const [isDirty, setIsDirty] = useState(false);
  const [activeCustomizerTab, setActiveCustomizerTab] = useState('customize');
  const [activeCodeTab, setActiveCodeTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const [viewport, setViewport] = useState('desktop');
  const [showCustomizer, setShowCustomizer] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [remixName, setRemixName] = useState('');
  const [previewError, setPreviewError] = useState(null);
  const leaveRef = useRef(false);

  useEffect(() => {
    const handler = (e) => {
      if (isDirty && !leaveRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.getDesign(id);
        setDesign(data);
        const h = data.html_code || '';
        const c = data.css_code || '';
        const j = data.js_code || '';
        setOrigHtml(h);
        setOrigCss(c);
        setOrigJs(j);
        setCurHtml(h);
        setCurCss(c);
        setCurJs(j);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const hasCode = design?.html_code || design?.css_code || design?.js_code;

  const textPlaceholders = extractTextPlaceholders(origHtml);
  const colorPlaceholders = extractColorPlaceholders(origHtml, origCss);
  const hasAnimation = /animation|transition|transform|requestAnimationFrame|setInterval/i.test(origCss + origJs);

  const { html: renderHtml, css: renderCss, js: renderJs } = applyCustomizations(curHtml, curCss, curJs, custom);

  const markDirty = () => { setIsDirty(true); };

  const handleTextChange = (key, val) => {
    setCustom(prev => ({ ...prev, texts: { ...prev.texts, [key]: val } }));
    markDirty();
  };

  const handleColorChange = (key, val) => {
    setCustom(prev => ({ ...prev, colors: { ...prev.colors, [key]: val } }));
    markDirty();
  };

  const handleSpeedChange = (val) => {
    setCustom(prev => ({ ...prev, speed: val }));
    markDirty();
  };

  const handleDesignChange = (key, val) => {
    setCustom(prev => ({ ...prev, design: { ...prev.design, [key]: val } }));
    markDirty();
  };

  const handleCodeEdit = (tab, val) => {
    if (tab === 'html') setCurHtml(val);
    else if (tab === 'css') setCurCss(val);
    else setCurJs(val);
    markDirty();
  };

  const handleReset = () => {
    setCurHtml(origHtml);
    setCurCss(origCss);
    setCurJs(origJs);
    setCustom({ texts: {}, colors: {}, speed: 1, design: {} });
    setIsDirty(false);
    setPreviewKey(k => k + 1);
  };

  const handleCopy = (tab, version) => {
    let code = '';
    if (version === 'original') {
      code = tab === 'html' ? origHtml : tab === 'css' ? origCss : origJs;
    } else {
      code = tab === 'html' ? renderHtml : tab === 'css' ? renderCss : renderJs;
    }
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = (version) => {
    const parts = [];
    const h = version === 'original' ? origHtml : renderHtml;
    const c = version === 'original' ? origCss : renderCss;
    const j = version === 'original' ? origJs : renderJs;
    if (h) parts.push(`<!-- HTML -->\n${h}`);
    if (c) parts.push(`/* CSS */\n${c}`);
    if (j) parts.push(`// JavaScript\n${j}`);
    navigator.clipboard.writeText(parts.join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (name, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = (version) => {
    let h, c, j;
    if (version === 'original') {
      h = origHtml;
      c = origCss;
      j = origJs;
    } else {
      h = renderHtml;
      c = renderCss;
      j = renderJs;
    }
    const suffix = version === 'original' ? '' : '-edited';
    if (h) downloadFile(`index${suffix}.html`, h);
    if (c) downloadFile(`style${suffix}.css`, c);
    if (j) downloadFile(`script${suffix}.js`, j);
    setShowDownloadModal(false);
  };

  const handleSaveRemix = async () => {
    if (!remixName.trim()) return;
    try {
      const fd = new FormData();
      fd.append('name', remixName);
      fd.append('category', design.category || 'Component');
      fd.append('framework', design.framework || 'HTML');
      fd.append('price', design.price || 'Free');
      fd.append('score', design.score || 0);
      fd.append('description', `Remix of ${design.name}`);
      fd.append('html_code', renderHtml);
      fd.append('css_code', renderCss);
      fd.append('js_code', renderJs);
      await api.adminCreateDesign(fd);
      setShowRemixModal(false);
      setIsDirty(false);
      navigate('/tools');
    } catch (err) {
      alert('Failed to save remix: ' + err.message);
    }
  };

  const handlePreviewRetry = () => {
    setPreviewError(null);
    setPreviewKey(k => k + 1);
  };

  if (loading) {
    return (
      <PageLayout title="">
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (error || !design) {
    return (
      <PageLayout title="">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h2 className="text-white text-xl font-semibold mb-2">Design not found</h2>
          <p className="text-[#666] text-sm mb-6">{error || 'The design does not exist.'}</p>
          <button onClick={() => navigate('/tools')} className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold">Back to Tools</button>
        </div>
      </PageLayout>
    );
  }

  const viewportWidth = VIEWPORT_SIZES.find(v => v.key === viewport)?.width || '100%';
  const isEdited = curHtml !== origHtml || curCss !== origCss || curJs !== origJs || Object.keys(custom.texts).length > 0 || Object.keys(custom.colors).length > 0 || custom.speed !== 1;

  return (
    <PageLayout title="">
      <div className="max-w-[1600px] mx-auto">
        {/* Top Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4">
          <button onClick={() => { if (isDirty && !confirm('Unsaved changes. Leave anyway?')) return; navigate('/tools'); }}
            className="flex items-center gap-2 text-[#666] hover:text-white text-[12px] transition-colors">
            <ArrowLeft size={14} /> Back to Tools
          </button>
          <div className="flex items-center gap-2">
            {isEdited && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400 text-[9px] font-medium">
                <AlertTriangle size={10} /> Unsaved Edits
              </span>
            )}
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium text-[#666] border border-white/[0.06] hover:border-white/[0.15] hover:text-white transition-all">
              <RotateCcw size={11} /> Reset
            </button>
            <button onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-white text-black hover:-translate-y-0.5 transition-transform">
              <Download size={11} /> Download
            </button>
            <button onClick={() => setShowRemixModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium border border-white/[0.10] text-[#aaa] hover:bg-white/[0.05] transition-colors">
              <Save size={11} /> Save Remix
            </button>
          </div>
        </motion.div>

        {/* Design Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <h1 className="text-[22px] tracking-[-0.04em] font-bold text-white mb-1">{design.name}</h1>
          <p className="text-[#666] text-[12px] leading-[1.6] max-w-[500px]">{design.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white/[0.06] text-[#aaa]">{design.framework}</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white/[0.06] text-[#aaa]">{design.category}</span>
            {design.price === 'Free' ? (
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-green-500/10 text-green-400">Free</span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-yellow-500/10 text-yellow-400">${design.price}</span>
            )}
          </div>
        </motion.div>

        {/* Main Layout */}
        {hasCode ? (
          <div className="flex gap-3" style={{ minHeight: '600px' }}>
            {/* Left: Customizer */}
            <div className={`${showCustomizer ? 'w-[280px] shrink-0' : 'w-0 overflow-hidden'} transition-all duration-300`}>
              <div className="rounded-[14px] border border-white/[0.06] bg-[#080808] h-full flex flex-col overflow-hidden">
                {/* Customizer Tabs */}
                <div className="flex border-b border-white/[0.04] shrink-0">
                  {CUSTOMIZER_TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button key={tab.key} onClick={() => setActiveCustomizerTab(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-medium transition-all border-b-2 ${
                          activeCustomizerTab === tab.key
                            ? 'text-white border-white'
                            : 'text-[#555] border-transparent hover:text-[#888]'
                        }`}>
                        <Icon size={11} /> {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {activeCustomizerTab === 'customize' ? (
                    <>
                      {/* Text Controls */}
                      {textPlaceholders.length > 0 && (
                        <div>
                          <div className="text-[9px] text-[#555] uppercase tracking-wider font-medium mb-2">Text</div>
                          <div className="space-y-2">
                            {textPlaceholders.map(key => (
                              <TextInput key={key} label={key} value={custom.texts[key] || ''}
                                onChange={(val) => handleTextChange(key, val)} placeholder={key} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Color Controls */}
                      {colorPlaceholders.length > 0 && (
                        <div>
                          <div className="text-[9px] text-[#555] uppercase tracking-wider font-medium mb-2">Colors</div>
                          <div className="space-y-3">
                            {colorPlaceholders.map(key => (
                              <ColorPicker key={key} label={key} value={custom.colors[key] || '#ffffff'}
                                onChange={(val) => handleColorChange(key, val)} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Always show common colors */}
                      {colorPlaceholders.length === 0 && (
                        <div>
                          <div className="text-[9px] text-[#555] uppercase tracking-wider font-medium mb-2">Colors</div>
                          <div className="space-y-3">
                            <ColorPicker label="Primary" value={custom.colors.primary || '#7c3aed'}
                              onChange={(val) => handleColorChange('primary', val)} />
                            <ColorPicker label="Accent" value={custom.colors.accent || '#06b6d4'}
                              onChange={(val) => handleColorChange('accent', val)} />
                            <ColorPicker label="Background" value={custom.colors.background || '#0a0a0a'}
                              onChange={(val) => handleColorChange('background', val)} />
                            <ColorPicker label="Text" value={custom.colors.text || '#ffffff'}
                              onChange={(val) => handleColorChange('text', val)} />
                          </div>
                        </div>
                      )}

                      {/* Animation */}
                      {hasAnimation && (
                        <div>
                          <div className="text-[9px] text-[#555] uppercase tracking-wider font-medium mb-2">Animation</div>
                          <Slider label="Speed" value={custom.speed} onChange={handleSpeedChange}
                            min={0.25} max={4} step={0.25} unit="x" />
                        </div>
                      )}

                      {/* Design Properties */}
                      <div>
                        <div className="text-[9px] text-[#555] uppercase tracking-wider font-medium mb-2">Design</div>
                        <div className="space-y-3">
                          <Slider label="Border Radius" value={custom.design.borderRadius || 12}
                            onChange={(v) => handleDesignChange('borderRadius', v)} min={0} max={50} unit="px" />
                          <Slider label="Opacity" value={custom.design.opacity || 100}
                            onChange={(v) => handleDesignChange('opacity', v)} min={10} max={100} unit="%" />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Code Editor Tab */
                    <div className="space-y-3">
                      <div className="flex items-center gap-[2px] bg-white/[0.03] rounded-[6px] p-[2px]">
                        {CODE_TABS.map(tab => (
                          <button key={tab.key} onClick={() => setActiveCodeTab(tab.key)}
                            className={`flex-1 px-2 py-1 rounded-[4px] text-[10px] font-medium transition-all ${
                              activeCodeTab === tab.key ? 'bg-white text-black' : 'text-[#666] hover:text-white'
                            }`}>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={activeCodeTab === 'html' ? curHtml : activeCodeTab === 'css' ? curCss : curJs}
                        onChange={(e) => handleCodeEdit(activeCodeTab, e.target.value)}
                        spellCheck={false}
                        className="w-full h-[400px] p-[10px] bg-[#050505] text-[#e0e0e0] font-mono text-[10px] leading-[1.7] resize-none outline-none border border-white/[0.05] rounded-[8px] placeholder-[#333]"
                        placeholder={`Edit ${activeCodeTab.toUpperCase()} here...`}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleCopy(activeCodeTab, 'edited')}
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-medium border border-white/[0.06] text-[#666] hover:text-white hover:border-white/[0.15] transition-all">
                          {copied ? <Check size={10} /> : <Copy size={10} />} Copy {activeCodeTab.toUpperCase()}
                        </button>
                        <button onClick={() => handleCopyAll('edited')}
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-medium bg-white text-black">
                          <Copy size={10} /> Copy All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Preview Controls */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {VIEWPORT_SIZES.map(v => {
                    const Icon = v.icon;
                    return (
                      <button key={v.key} onClick={() => setViewport(v.key)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
                          viewport === v.key ? 'bg-white text-black border-white' : 'text-[#666] border-white/[0.06] hover:border-white/[0.15]'
                        }`}>
                        <Icon size={11} /> {v.label}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setShowCustomizer(!showCustomizer)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
                    showCustomizer ? 'bg-white text-black border-white' : 'text-[#666] border-white/[0.06] hover:border-white/[0.15]'
                  }`}>
                  <Paintbrush size={11} /> Customize
                </button>
              </div>

              {/* Live Preview */}
              <div className="rounded-[14px] border border-white/[0.06] bg-[#0a0a0a] overflow-hidden flex-1 flex flex-col">
                <div className="px-4 py-2 border-b border-white/[0.04] flex items-center gap-2 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] text-[#555] uppercase tracking-wider font-medium">Live Preview</span>
                  {isEdited && <span className="text-[9px] text-yellow-500/60 ml-1">(edited)</span>}
                  <span className="text-[9px] text-[#333] ml-auto">{viewportWidth}</span>
                </div>
                <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
                  <div style={{ width: viewportWidth, maxWidth: '100%', height: '100%' }} className="transition-all duration-300">
                    <LivePreview
                      key={previewKey}
                      html={renderHtml}
                      css={renderCss}
                      js={renderJs}
                      className="w-full h-full rounded-[8px] overflow-hidden border border-white/[0.05]"
                      title={design.name}
                    />
                  </div>
                </div>
              </div>

              {/* Source Tabs (below preview) */}
              <div className="mt-3 rounded-[14px] border border-white/[0.06] bg-[#080808] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04]">
                  <div className="flex items-center gap-[2px] bg-white/[0.03] rounded-[6px] p-[2px]">
                    {CODE_TABS.map(tab => (
                      <button key={tab.key} onClick={() => setActiveCodeTab(tab.key)}
                        className={`px-3 py-1 rounded-[4px] text-[10px] font-medium transition-all ${
                          activeCodeTab === tab.key ? 'bg-white text-black' : 'text-[#666] hover:text-white'
                        }`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <button className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-[9px] text-[#666] hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition-colors">
                        <Copy size={10} /> Copy
                      </button>
                      <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-50">
                        <div className="bg-[#111] border border-white/[0.10] rounded-lg p-1 min-w-[120px]">
                          <button onClick={() => handleCopy(activeCodeTab, 'original')}
                            className="w-full text-left px-3 py-1.5 rounded text-[10px] text-[#aaa] hover:bg-white/[0.05] hover:text-white transition-colors">
                            Original
                          </button>
                          <button onClick={() => handleCopy(activeCodeTab, 'edited')}
                            className="w-full text-left px-3 py-1.5 rounded text-[10px] text-[#aaa] hover:bg-white/[0.05] hover:text-white transition-colors">
                            Current Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="max-h-[200px] overflow-auto p-3">
                  <pre className="text-[10px] leading-[1.7] text-[#aaa] font-mono whitespace-pre-wrap break-words">
                    {activeCodeTab === 'html' ? curHtml : activeCodeTab === 'css' ? curCss : curJs || `/* No ${activeCodeTab.toUpperCase()} */`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[14px] border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
            {design.preview ? (
              <img src={design.preview} alt={design.name} className="w-full object-contain max-h-[600px]" />
            ) : (
              <div className="flex items-center justify-center py-32 text-[#444] text-[13px]">No preview available</div>
            )}
          </div>
        )}
      </div>

      {/* Download Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowDownloadModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-[360px] p-5 rounded-[16px] border border-white/[0.10] bg-[#0a0a0a]"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold">Download Design</h3>
                <button onClick={() => setShowDownloadModal(false)} className="text-[#666] hover:text-white"><X size={16} /></button>
              </div>
              <div className="space-y-2 mb-5">
                <button onClick={() => handleDownload('original')}
                  className="w-full p-3 rounded-xl border border-white/[0.08] text-left hover:bg-white/[0.03] transition-colors group">
                  <div className="text-[11px] font-semibold text-white group-hover:text-white">Original Version</div>
                  <div className="text-[9px] text-[#666] mt-0.5">Download the published source as-is</div>
                </button>
                <button onClick={() => handleDownload('edited')}
                  className="w-full p-3 rounded-xl border border-white/[0.08] text-left hover:bg-white/[0.03] transition-colors group"
                  disabled={!isEdited}>
                  <div className="text-[11px] font-semibold text-white group-hover:text-white">
                    Edited Version {isEdited ? '' : '(no edits)'}
                  </div>
                  <div className="text-[9px] text-[#666] mt-0.5">Download your current customizations</div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remix Modal */}
      <AnimatePresence>
        {showRemixModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowRemixModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-[360px] p-5 rounded-[16px] border border-white/[0.10] bg-[#0a0a0a]"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold">Save as Remix</h3>
                <button onClick={() => setShowRemixModal(false)} className="text-[#666] hover:text-white"><X size={16} /></button>
              </div>
              <p className="text-[11px] text-[#666] mb-4">The original design remains unchanged. Your remix will be saved as a new design.</p>
              <input type="text" value={remixName} onChange={e => setRemixName(e.target.value)}
                placeholder={`${design.name} — My Remix`}
                className="w-full h-[40px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors mb-4" />
              <div className="flex gap-2">
                <button onClick={() => setShowRemixModal(false)}
                  className="flex-1 h-[36px] rounded-[8px] border border-white/[0.10] text-[11px] font-semibold text-[#aaa] hover:bg-white/[0.05] transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveRemix} disabled={!remixName.trim()}
                  className="flex-1 h-[36px] rounded-[8px] bg-white text-black text-[11px] font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-50">
                  Save Remix
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
