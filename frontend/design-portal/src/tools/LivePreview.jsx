import { useRef, useEffect, useMemo, useState, memo } from 'react';

const LIBRARY_CDNS = {
  react: [
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  ],
  'react-dev': [
    'https://unpkg.com/react@18/umd/react.development.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  ],
  vue: ['https://unpkg.com/vue@3/dist/vue.global.prod.js'],
  'vue-dev': ['https://unpkg.com/vue@3/dist/vue.global.js'],
  svelte: [],
  tailwind: ['https://cdn.tailwindcss.com'],
  alpine: ['https://unpkg.com/alpinejs@3/dist/cdn.min.js'],
  gsap: ['https://unpkg.com/gsap@3/dist/gsap.min.js'],
  three: ['https://unpkg.com/three@0.160.0/build/three.min.js'],
  chart: ['https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js'],
  'font-awesome': ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'],
  'google-fonts-inter': ['https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'],
  'google-fonts-mono': ['https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap'],
  'google-fonts-space': ['https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap'],
  'google-fonts-poppins': ['https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'],
  'google-fonts-raleway': ['https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&display=swap'],
  'google-fonts-oswald': ['https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap'],
  'google-fonts-playfair': ['https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap'],
  'google-fonts-lato': ['https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap'],
  'google-fonts-montserrat': ['https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap'],
  'google-fonts-roboto': ['https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap'],
  'highlight.js': [
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
  ],
  marked: ['https://cdn.jsdelivr.net/npm/marked/marked.min.js'],
  dompurify: ['https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js'],
  axios: ['https://unpkg.com/axios/dist/axios.min.js'],
  lodash: ['https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js'],
  'framer-motion': [],
};

function buildSrcDoc(html = '', css = '', js = '', libraries = []) {
  const safeJs = js
    .replace(/<\/script>/gi, '<\\/script>')
    .replace(/on\w+\s*=/gi, 'data-blocked=');

  const links = [];
  const scripts = [];

  for (const lib of libraries) {
    const cdns = LIBRARY_CDNS[lib] || [];
    for (const url of cdns) {
      if (url.endsWith('.css')) {
        links.push(`<link rel="stylesheet" href="${url}"/>`);
      } else {
        scripts.push(`<script src="${url}"><\/script>`);
      }
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
${links.join('\n')}
<style>
*{margin:0;padding:0;box-sizing:border-box;scrollbar-width:none;-ms-overflow-style:none;}
*::-webkit-scrollbar{display:none;}
html::-webkit-scrollbar{display:none;}
body::-webkit-scrollbar{display:none;}
html,body{overflow:hidden;}
body{font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;}
${css}
</style>
</head>
<body>
${html}
${scripts.join('\n')}
<script>
try{
${safeJs}
}catch(e){
document.body.innerHTML='<pre style="color:#f43f5e;padding:16px;font-size:12px;">'+e.message+'</pre>';
}
</script>
</body>
</html>`;
}

function LivePreview({ html = '', css = '', js = '', libraries = [], className = '', style = {}, title = 'preview' }) {
  const iframeRef = useRef(null);
  const [error, setError] = useState(null);

  const srcDoc = useMemo(() => buildSrcDoc(html, css, js, libraries), [html, css, js, libraries]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleError = () => setError('Preview failed to load');
    const handleLoad = () => setError(null);

    iframe.addEventListener('error', handleError);
    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('error', handleError);
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.srcdoc = srcDoc;
    }
  }, [srcDoc]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-[#0a0a0a] text-[#f43f5e] text-[10px] ${className}`} style={style}>
        {error}
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      title={title}
      sandbox="allow-scripts"
      className={className}
      style={{ border: 'none', overflow: 'hidden', ...style }}
      loading="lazy"
    />
  );
}

export default memo(LivePreview);
export { LIBRARY_CDNS };
