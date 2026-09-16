import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Terminal, Zap, ArrowRight, Package, Code, ExternalLink } from 'lucide-react';

const MCP_COMMANDS = {
  install: 'npx zandeveloper-mcp',
  connect: `npx zandeveloper-mcp --connect`,
  retrieve: (designId) => `npx zandeveloper-mcp --get ${designId}`,
  export: (designId, framework) => `npx zandeveloper-mcp --export ${designId} --format ${framework.toLowerCase()}`,
};

const FRAMEWORKS = [
  { id: 'react', label: 'React', ext: 'jsx' },
  { id: 'vue', label: 'Vue', ext: 'vue' },
  { id: 'svelte', label: 'Svelte', ext: 'svelte' },
  { id: 'astro', label: 'Astro', ext: 'astro' },
  { id: 'html', label: 'HTML', ext: 'html' },
];

export default function MCPDownloadModal({ isOpen, onClose, design }) {
  const [copied, setCopied] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState('react');
  const [activeTab, setActiveTab] = useState('install');

  const designId = design?.id;
  const designName = design?.name || 'Design';

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const installCmd = MCP_COMMANDS.install;
  const connectCmd = MCP_COMMANDS.connect;
  const retrieveCmd = MCP_COMMANDS.retrieve(designId);
  const exportCmd = MCP_COMMANDS.export(designId, selectedFramework);

  const tabs = [
    { id: 'install', label: 'Install' },
    { id: 'connect', label: 'Connect' },
    { id: 'retrieve', label: 'Retrieve' },
    { id: 'export', label: 'Export' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-[520px] rounded-[16px] border border-white/[0.10] bg-[#0a0a0a] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center">
                  <Terminal size={18} className="text-violet-400" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-white">Get via MCP</h3>
                  <p className="text-[10px] text-[#666] mt-0.5">Retrieve this design using Model Context Protocol</p>
                </div>
              </div>
              <button onClick={onClose} className="text-[#666] hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/[0.04] px-5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-[11px] font-medium border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'text-white border-white'
                      : 'text-[#555] border-transparent hover:text-[#888]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Install Tab */}
              {activeTab === 'install' && (
                <div className="space-y-4">
                  <div className="bg-[#080808] rounded-xl border border-white/[0.06] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-[#555] uppercase tracking-wider font-medium">Step 1: Install MCP</span>
                      <Package size={14} className="text-violet-400" />
                    </div>
                    <div className="flex items-center gap-2 bg-[#050505] rounded-lg border border-white/[0.04] p-3">
                      <code className="flex-1 text-[12px] text-green-400 font-mono">{installCmd}</code>
                      <button
                        onClick={() => handleCopy(installCmd, 'install')}
                        className="shrink-0 p-1.5 rounded-md hover:bg-white/[0.05] transition-colors"
                      >
                        {copied === 'install' ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-[#666]" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#555] leading-relaxed">
                    This installs the Zandeveloper MCP server globally. Run it once to set up the connection to the design platform.
                  </div>
                </div>
              )}

              {/* Connect Tab */}
              {activeTab === 'connect' && (
                <div className="space-y-4">
                  <div className="bg-[#080808] rounded-xl border border-white/[0.06] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-[#555] uppercase tracking-wider font-medium">Step 2: Connect to Platform</span>
                      <Zap size={14} className="text-yellow-400" />
                    </div>
                    <div className="flex items-center gap-2 bg-[#050505] rounded-lg border border-white/[0.04] p-3">
                      <code className="flex-1 text-[12px] text-green-400 font-mono">{connectCmd}</code>
                      <button
                        onClick={() => handleCopy(connectCmd, 'connect')}
                        className="shrink-0 p-1.5 rounded-md hover:bg-white/[0.05] transition-colors"
                      >
                        {copied === 'connect' ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-[#666]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* opencode.json Config */}
                  <div className="bg-[#080808] rounded-xl border border-white/[0.06] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-[#555] uppercase tracking-wider font-medium">Or configure in opencode.json</span>
                      <Code size={14} className="text-blue-400" />
                    </div>
                    <div className="relative">
                      <pre className="bg-[#050505] rounded-lg border border-white/[0.04] p-3 text-[11px] text-[#aaa] font-mono overflow-x-auto">
{`{
  "mcp": {
    "servers": {
      "zandeveloper": {
        "command": "npx",
        "args": ["-y", "zandeveloper-mcp"],
        "env": {
          "ZANDEV_API_KEY": "your_key"
        }
      }
    }
  }
}`}
                      </pre>
                      <button
                        onClick={() => handleCopy(`{
  "mcp": {
    "servers": {
      "zandeveloper": {
        "command": "npx",
        "args": ["-y", "zandeveloper-mcp"],
        "env": {
          "ZANDEV_API_KEY": "your_key"
        }
      }
    }
  }
}`, 'config')}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.10] transition-colors"
                      >
                        {copied === 'config' ? (
                          <Check size={12} className="text-green-400" />
                        ) : (
                          <Copy size={12} className="text-[#666]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Retrieve Tab */}
              {activeTab === 'retrieve' && (
                <div className="space-y-4">
                  <div className="bg-[#080808] rounded-xl border border-white/[0.06] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-[#555] uppercase tracking-wider font-medium">Retrieve This Design</span>
                      <ArrowRight size={14} className="text-green-400" />
                    </div>
                    <div className="flex items-center gap-2 bg-[#050505] rounded-lg border border-white/[0.04] p-3">
                      <code className="flex-1 text-[12px] text-green-400 font-mono break-all">{retrieveCmd}</code>
                      <button
                        onClick={() => handleCopy(retrieveCmd, 'retrieve')}
                        className="shrink-0 p-1.5 rounded-md hover:bg-white/[0.05] transition-colors"
                      >
                        {copied === 'retrieve' ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-[#666]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-violet-500/5 border border-violet-500/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Zap size={16} className="text-violet-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] text-white font-medium">Direct MCP Retrieval</p>
                        <p className="text-[10px] text-[#666] mt-1 leading-relaxed">
                          This command retrieves the exact HTML, CSS, and JavaScript code for <span className="text-white font-medium">{designName}</span> directly via MCP. The code will be delivered to your AI assistant for immediate use.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Design Info */}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white/[0.06] text-[#aaa]">{design?.framework}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white/[0.06] text-[#aaa]">{design?.category}</span>
                    <span className="text-[9px] text-[#444]">ID: {designId}</span>
                  </div>
                </div>
              )}

              {/* Export Tab */}
              {activeTab === 'export' && (
                <div className="space-y-4">
                  {/* Framework Selector */}
                  <div>
                    <span className="text-[10px] text-[#555] uppercase tracking-wider font-medium mb-2 block">Select Framework</span>
                    <div className="flex flex-wrap gap-1.5">
                      {FRAMEWORKS.map((fw) => (
                        <button
                          key={fw.id}
                          onClick={() => setSelectedFramework(fw.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
                            selectedFramework === fw.id
                              ? 'bg-white text-black border-white'
                              : 'bg-white/[0.03] text-[#888] border-white/[0.06] hover:border-white/[0.15]'
                          }`}
                        >
                          {fw.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#080808] rounded-xl border border-white/[0.06] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-[#555] uppercase tracking-wider font-medium">Export Command</span>
                      <Code size={14} className="text-blue-400" />
                    </div>
                    <div className="flex items-center gap-2 bg-[#050505] rounded-lg border border-white/[0.04] p-3">
                      <code className="flex-1 text-[12px] text-green-400 font-mono break-all">{exportCmd}</code>
                      <button
                        onClick={() => handleCopy(exportCmd, 'export')}
                        className="shrink-0 p-1.5 rounded-md hover:bg-white/[0.05] transition-colors"
                      >
                        {copied === 'export' ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-[#666]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <ExternalLink size={16} className="text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] text-white font-medium">Framework-Specific Export</p>
                        <p className="text-[10px] text-[#666] mt-1 leading-relaxed">
                          Export {designName} as a {FRAMEWORKS.find(f => f.id === selectedFramework)?.label} component with proper imports and structure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-5 border-t border-white/[0.06] bg-[#080808]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-[#666]">MCP Server Active</span>
              </div>
              <a
                href="https://www.npmjs.com/package/zandeveloper-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
              >
                View on npm <ExternalLink size={10} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
