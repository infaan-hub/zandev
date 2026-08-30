import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, Download, Eye, Code, Monitor, Tablet, Smartphone } from 'lucide-react';
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

export default function DesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const [viewport, setViewport] = useState('desktop');
  const [showCode, setShowCode] = useState(true);

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

  const hasCode = design?.html_code || design?.css_code || design?.js_code;

  const handleCopy = (tab) => {
    const code = design?.[`${tab}_code`] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = () => {
    const parts = [];
    if (design?.html_code) parts.push(`<!-- HTML -->\n${design.html_code}`);
    if (design?.css_code) parts.push(`/* CSS */\n${design.css_code}`);
    if (design?.js_code) parts.push(`// JavaScript\n${design.js_code}`);
    if (design?.code && !parts.length) parts.push(design.code);
    navigator.clipboard.writeText(parts.join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const files = [];
    if (design?.html_code) files.push({ name: 'index.html', content: design.html_code });
    if (design?.css_code) files.push({ name: 'style.css', content: design.css_code });
    if (design?.js_code) files.push({ name: 'script.js', content: design.js_code });

    if (files.length === 1) {
      const blob = new Blob([files[0].content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = files[0].name;
      a.click();
      URL.revokeObjectURL(url);
    } else if (files.length > 1) {
      files.forEach(({ name, content }) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
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
          <p className="text-[#666] text-sm mb-6">{error || 'The design you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/tools')} className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold">
            Back to Tools
          </button>
        </div>
      </PageLayout>
    );
  }

  const viewportWidth = VIEWPORT_SIZES.find(v => v.key === viewport)?.width || '100%';

  return (
    <PageLayout title="">
      <div className="max-w-[1400px] mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/tools')}
          className="flex items-center gap-2 text-[#666] hover:text-white text-[12px] mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Tools
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-[28px] tracking-[-0.04em] font-bold text-white mb-2">{design.name}</h1>
              <p className="text-[#747474] text-[13px] leading-[1.7] max-w-[500px]">{design.description}</p>
              <div className="flex items-center gap-3 mt-4">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white/[0.06] text-[#aaa]">{design.framework}</span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white/[0.06] text-[#aaa]">{design.category}</span>
                {design.price === 'Free' ? (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-green-500/10 text-green-400">Free</span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-yellow-500/10 text-yellow-400">${design.price}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {hasCode && (
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-[11px] font-semibold hover:-translate-y-0.5 transition-transform"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
              )}
              {hasCode && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.10] text-[11px] font-semibold text-[#aaa] hover:bg-white/[0.05] transition-colors"
                >
                  <Download size={13} />
                  Download
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {hasCode ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Viewport controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {VIEWPORT_SIZES.map(v => {
                  const Icon = v.icon;
                  return (
                    <button
                      key={v.key}
                      onClick={() => setViewport(v.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
                        viewport === v.key
                          ? 'bg-white text-black border-white'
                          : 'text-[#666] border-white/[0.06] hover:border-white/[0.15]'
                      }`}
                    >
                      <Icon size={11} />
                      {v.label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowCode(!showCode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
                  showCode
                    ? 'bg-white text-black border-white'
                    : 'text-[#666] border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <Code size={11} />
                Source Code
              </button>
            </div>

            <div className="flex gap-4" style={{ minHeight: '500px' }}>
              {/* Live Preview */}
              <div className={`${showCode ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
                <div className="rounded-[14px] border border-white/[0.06] bg-[#0a0a0a] overflow-hidden h-full flex flex-col">
                  <div className="px-4 py-2.5 border-b border-white/[0.04] flex items-center gap-2 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] text-[#555] uppercase tracking-wider font-medium">Live Preview</span>
                    <span className="text-[9px] text-[#333] ml-auto">{viewportWidth}</span>
                  </div>
                  <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
                    <div style={{ width: viewportWidth, maxWidth: '100%', height: '100%' }} className="transition-all duration-300">
                      <LivePreview
                        html={design.html_code}
                        css={design.css_code}
                        js={design.js_code}
                        className="w-full h-full rounded-[8px] overflow-hidden border border-white/[0.05]"
                        title={design.name}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Source Code */}
              {showCode && (
                <div className="w-1/2">
                  <div className="rounded-[14px] border border-white/[0.06] bg-[#0a0a0a] overflow-hidden h-full flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] shrink-0">
                      <div className="flex items-center gap-[2px] bg-white/[0.03] rounded-[6px] p-[2px]">
                        {CODE_TABS.map(tab => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-3 py-1 rounded-[4px] text-[10px] font-medium transition-all ${
                              activeTab === tab.key
                                ? 'bg-white text-black'
                                : 'text-[#666] hover:text-white'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleCopy(activeTab)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-[9px] text-[#666] hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition-colors"
                      >
                        {copied ? <Check size={10} /> : <Copy size={10} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                      <pre className="text-[11px] leading-[1.8] text-[#aaa] font-mono whitespace-pre-wrap break-words">
                        {design[`${activeTab}_code`] || `/* No ${activeTab.toUpperCase()} code provided */`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* No code - show preview image */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[14px] border border-white/[0.06] bg-[#0a0a0a] overflow-hidden"
          >
            {design.preview ? (
              <img src={design.preview} alt={design.name} className="w-full object-contain max-h-[600px]" />
            ) : (
              <div className="flex items-center justify-center py-32 text-[#444] text-[13px]">
                No preview available
              </div>
            )}
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
