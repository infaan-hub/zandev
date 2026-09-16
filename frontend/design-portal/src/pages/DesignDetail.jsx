import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, Download, Eye, Terminal, ChevronDown, ChevronUp, X } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import LivePreview from '../tools/LivePreview';
import { api } from '../lib/api';
import MCPDownloadModal from '../components/MCPDownloadModal';

const FRAMEWORKS = [
  { id: 'html', label: 'HTML', ext: 'html' },
  { id: 'react', label: 'React', ext: 'jsx' },
  { id: 'vue', label: 'Vue', ext: 'vue' },
  { id: 'svelte', label: 'Svelte', ext: 'svelte' },
  { id: 'next', label: 'Next.js', ext: 'jsx' },
  { id: 'astro', label: 'Astro', ext: 'astro' },
];

function highlightCode(code, lang) {
  if (!code) return '';
  let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (lang === 'html') {
    escaped = escaped
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span style="color:#f472b6">$2</span>')
      .replace(/([\w-]+)(=)/g, '<span style="color:#a78bfa">$1</span>$2')
      .replace(/(".*?")/g, '<span style="color:#86efac">$1</span>');
  } else if (lang === 'css') {
    escaped = escaped
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#555">$1</span>')
      .replace(/([\w.-]+)\s*\{/g, '<span style="color:#a78bfa">$1</span> {')
      .replace(/([\w-]+)\s*:/g, '<span style="color:#86efac">$1</span>:')
      .replace(/:\s*([^;{}]+)/g, ': <span style="color:#fde68a">$1</span>');
  } else if (lang === 'js' || lang === 'jsx') {
    escaped = escaped
      .replace(/(\/\/.*$)/gm, '<span style="color:#555">$1</span>')
      .replace(/\b(const|let|var|function|return|import|export|from|default|async|await|export default)\b/g, '<span style="color:#c084fc">$1</span>')
      .replace(/(".*?"|'.*?'|`.*?`)/g, '<span style="color:#86efac">$1</span>');
  }
  return escaped;
}

function DesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCodeTab, setActiveCodeTab] = useState('html_code');
  const [copied, setCopied] = useState(false);
  const [showMCPModal, setShowMCPModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.getDesign(id);
        setDesign(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const getCodeFields = useCallback(() => {
    if (!design) return [];
    const fields = [];
    if (design.html_code) fields.push({ key: 'html_code', label: 'HTML', lang: 'html' });
    if (design.css_code) fields.push({ key: 'css_code', label: 'CSS', lang: 'css' });
    if (design.js_code) fields.push({ key: 'js_code', label: 'JavaScript', lang: 'js' });
    if (design.react_code) fields.push({ key: 'react_code', label: 'React', lang: 'jsx' });
    if (design.vue_code) fields.push({ key: 'vue_code', label: 'Vue', lang: 'html' });
    if (design.svelte_code) fields.push({ key: 'svelte_code', label: 'Svelte', lang: 'html' });
    if (design.next_code) fields.push({ key: 'next_code', label: 'Next.js', lang: 'jsx' });
    if (design.astro_code) fields.push({ key: 'astro_code', label: 'Astro', lang: 'html' });
    return fields;
  }, [design]);

  const codeFields = getCodeFields();
  const hasCode = codeFields.length > 0;

  const galleryImages = [
    design?.preview_image,
    design?.gallery_image_1,
    design?.gallery_image_2,
    design?.gallery_image_3,
    design?.gallery_image_4,
    design?.gallery_image_5,
  ].filter(Boolean);

  const handleCopy = useCallback((field) => {
    navigator.clipboard.writeText(design?.[field] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [design]);

  const handleCopyAll = useCallback(() => {
    const parts = codeFields.map(f => `/* ${f.label} */\n${design[f.key]}`).join('\n\n');
    navigator.clipboard.writeText(parts);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [design, codeFields]);

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(design?.prompt || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [design]);

  const downloadFile = (name, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = useCallback(() => {
    const name = (design?.name || 'design').toLowerCase().replace(/\s+/g, '-');
    codeFields.forEach(f => {
      const ext = f.lang === 'jsx' ? 'jsx' : f.lang === 'js' ? 'js' : f.lang === 'css' ? 'css' : f.lang === 'html' ? 'html' : 'txt';
      downloadFile(`${name}.${ext}`, design[f.key]);
    });
    setShowDownloadModal(false);
  }, [design, codeFields]);

  if (loading) {
    return (
      <PageLayout title="">
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-[#4ade80] animate-spin" />
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

  return (
    <PageLayout title="">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/tools')} className="flex items-center gap-2 text-[#666] hover:text-white text-[12px] transition-colors">
            <ArrowLeft size={14} /> Back to Tools
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowDownloadModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-medium bg-white text-black hover:-translate-y-0.5 transition-transform">
              <Download size={12} /> Download
            </button>
            <button onClick={() => setShowMCPModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-medium bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/20 text-violet-300 hover:-translate-y-0.5 transition-transform">
              <Terminal size={12} /> MCP
            </button>
          </div>
        </motion.div>

        {/* Design Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-[28px] tracking-[-0.04em] font-bold text-white mb-2">{design.name}</h1>
          <p className="text-[#666] text-[13px] leading-[1.6] max-w-[600px]">{design.description}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-md text-[10px] font-semibold bg-white/[0.06] text-[#aaa]">{design.framework}</span>
            <span className="px-3 py-1 rounded-md text-[10px] font-semibold bg-white/[0.06] text-[#aaa]">{design.category}</span>
            {design.price === 'Free' ? (
              <span className="px-3 py-1 rounded-md text-[10px] font-semibold bg-[#4ade80]/10 text-[#4ade80]">Free</span>
            ) : (
              <span className="px-3 py-1 rounded-md text-[10px] font-semibold bg-yellow-500/10 text-yellow-400">{design.price}</span>
            )}
            {design.version > 1 && (
              <span className="px-2 py-0.5 rounded text-[8px] text-[#666] bg-white/[0.03]">v{design.version}</span>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left: Preview + Gallery + Code */}
          <div className="space-y-4">
            {/* Live Preview */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
              {hasCode ? (
                <div className="h-[500px]">
                  <LivePreview
                    html={design.html_code}
                    css={design.css_code}
                    js={design.js_code}
                    className="w-full h-full"
                    title={design.name}
                  />
                </div>
              ) : galleryImages.length > 0 ? (
                <div className="relative">
                  <img src={galleryImages[selectedImage]} alt={design.name} className="w-full h-[500px] object-cover" />
                </div>
              ) : (
                <div className="h-[500px] flex items-center justify-center text-[#444]">No preview available</div>
              )}
            </div>

            {/* Gallery */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-[#4ade80]' : 'border-white/[0.10] hover:border-white/[0.20]'
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Code Section */}
            {hasCode && (
              <div className="rounded-2xl border border-white/[0.08] bg-[#080808] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                  <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5">
                    {codeFields.map(f => (
                      <button key={f.key} onClick={() => setActiveCodeTab(f.key)}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                          activeCodeTab === f.key ? 'bg-white text-black' : 'text-[#666] hover:text-white'
                        }`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopy(activeCodeTab)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded text-[9px] text-[#666] hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition-colors">
                      {copied ? <Check size={10} className="text-[#4ade80]" /> : <Copy size={10} />} Copy
                    </button>
                    <button onClick={handleCopyAll}
                      className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium bg-[#4ade80] text-black">
                      <Copy size={10} /> Copy All
                    </button>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-auto p-4">
                  <pre className="text-[11px] leading-[1.7] font-mono whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{
                    __html: highlightCode(design[activeCodeTab] || '', codeFields.find(f => f.key === activeCodeTab)?.lang || 'html')
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Right: Info + Actions */}
          <div className="space-y-4">
            {/* Export Actions */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#080808] p-5">
              <h3 className="text-[13px] font-semibold mb-4">Get This Design</h3>
              <div className="space-y-2">
                <button onClick={() => setShowDownloadModal(true)}
                  className="w-full p-3 rounded-xl border border-white/[0.08] text-left hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-2">
                    <Download size={14} className="text-[#4ade80]" />
                    <div>
                      <div className="text-[11px] font-semibold text-white">Download Code</div>
                      <div className="text-[9px] text-[#666] mt-0.5">Source files for {design.framework}</div>
                    </div>
                  </div>
                </button>
                <button onClick={handleCopyAll}
                  className="w-full p-3 rounded-xl border border-white/[0.08] text-left hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-2">
                    <Copy size={14} className="text-blue-400" />
                    <div>
                      <div className="text-[11px] font-semibold text-white">Copy Code</div>
                      <div className="text-[9px] text-[#666] mt-0.5">Copy all source to clipboard</div>
                    </div>
                  </div>
                </button>
                <button onClick={() => setShowMCPModal(true)}
                  className="w-full p-3 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-blue-500/5 text-left hover:from-violet-500/10 hover:to-blue-500/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-violet-400" />
                    <div>
                      <div className="text-[11px] font-semibold text-violet-300">Get via MCP</div>
                      <div className="text-[9px] text-[#666] mt-0.5">Model Context Protocol</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Prompt Section */}
            {design.prompt && (
              <div className="rounded-2xl border border-white/[0.08] bg-[#080808] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold">AI Prompt</h3>
                  <button onClick={() => setShowPrompt(!showPrompt)} className="text-[#666] hover:text-white transition-colors">
                    {showPrompt ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
                {showPrompt && (
                  <div className="relative">
                    <pre className="bg-[#050505] rounded-lg border border-white/[0.04] p-3 text-[11px] text-[#aaa] font-mono whitespace-pre-wrap max-h-[200px] overflow-auto">
                      {design.prompt}
                    </pre>
                    <div className="flex gap-2 mt-2">
                      <button onClick={handleCopyPrompt}
                        className="flex items-center gap-1 px-2.5 py-1 rounded text-[9px] text-[#888] hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition-colors">
                        {copied ? <Check size={10} className="text-[#4ade80]" /> : <Copy size={10} />} Copy Prompt
                      </button>
                      <button onClick={() => downloadFile(`${design.name}-prompt.txt`, design.prompt)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded text-[9px] text-[#888] hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition-colors">
                        <Download size={10} /> Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#080808] p-5">
              <h3 className="text-[13px] font-semibold mb-3">Details</h3>
              <div className="space-y-2.5">
                {[
                  ['Framework', design.framework],
                  ['Category', design.category],
                  ['Price', design.price],
                  ['Version', `v${design.version}`],
                  ['Views', design.views || 0],
                  ['Exports', design.exports || 0],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px]">
                    <span className="text-[#666]">{k}</span>
                    <span className="text-white">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MCPDownloadModal isOpen={showMCPModal} onClose={() => setShowMCPModal(false)} design={design} />

      {showDownloadModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowDownloadModal(false)}>
          <div className="w-full max-w-[360px] p-5 rounded-2xl border border-white/[0.10] bg-[#0a0a0a]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold">Download Design</h3>
              <button onClick={() => setShowDownloadModal(false)} className="text-[#666] hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-2">
              <button onClick={handleDownload}
                className="w-full p-3 rounded-xl border border-white/[0.08] text-left hover:bg-white/[0.03] transition-colors">
                <div className="text-[11px] font-semibold text-white">Download All Files</div>
                <div className="text-[9px] text-[#666] mt-0.5">Source files for {design.framework}</div>
              </button>
              <button onClick={() => { handleCopyAll(); setShowDownloadModal(false); }}
                className="w-full p-3 rounded-xl border border-white/[0.08] text-left hover:bg-white/[0.03] transition-colors">
                <div className="text-[11px] font-semibold text-white">Copy All Code</div>
                <div className="text-[9px] text-[#666] mt-0.5">Copy all source to clipboard</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default memo(DesignDetail);
