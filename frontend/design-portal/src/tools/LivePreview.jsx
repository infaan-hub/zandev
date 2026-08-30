import { useRef, useEffect, useMemo, useState, memo } from 'react';

function buildSrcDoc(html = '', css = '', js = '') {
  const safeJs = js
    .replace(/<\/script>/gi, '<\\/script>')
    .replace(/on\w+\s*=/gi, 'data-blocked=');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;}
${css}
</style>
</head>
<body>
${html}
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

function LivePreview({ html = '', css = '', js = '', className = '', style = {}, title = 'preview' }) {
  const iframeRef = useRef(null);
  const [error, setError] = useState(null);

  const srcDoc = useMemo(() => buildSrcDoc(html, css, js), [html, css, js]);

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
      style={{ border: 'none', ...style }}
      loading="lazy"
    />
  );
}

export default memo(LivePreview);
