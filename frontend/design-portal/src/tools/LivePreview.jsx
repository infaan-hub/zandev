import { useRef, useEffect, useState, memo } from 'react'

function cleanReactCode(code) {
  return code
    .replace(/^import\s+.*from\s+['"].*['"];?\s*$/gm, '')
    .replace(/^import\s+\{[^}]*\}\s+from\s+['"].*['"];?\s*$/gm, '')
    .replace(/^export\s+default\s+/m, 'var __DefaultExport = ')
    .replace(/^export\s+\{[^}]*\};?\s*$/gm, '')
    .replace(/^export\s+const\s+/m, 'var ')
    .replace(/^export\s+function\s+/m, 'function ')
    .replace(/^export\s+class\s+/m, 'class ')
}

function LivePreview({ html = '', css = '', js = '', reactCode = '', className = '', title = 'preview' }) {
  const iframeRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    let srcdoc
    if (reactCode) {
      const cleaned = cleanReactCode(reactCode)
      const escapedCode = cleaned
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$')

      srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;overflow:auto;background:#000}
${css || ''}
</style>
</head>
<body>
<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
<script type="text/babel" data-type="module">
try {
var _h = React;
var useRef = _h.useRef, useEffect = _h.useEffect, useState = _h.useState;
var useMemo = _h.useMemo, useCallback = _h.useCallback, useLayoutEffect = _h.useLayoutEffect;
var Fragment = _h.Fragment;

${cleaned}

if (typeof __DefaultExport === 'function') {
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(__DefaultExport));
} else {
  parent.postMessage({type:'preview-error',error:'No default export found',title:'${title}'},'*');
}
} catch(e) {
parent.postMessage({type:'preview-error',error:e.message,title:'${title}'},'*');
}
window.onerror=function(m,s,l,c,e){
parent.postMessage({type:'preview-error',error:m,line:l,title:'${title}'},'*');
return true;
};
<\/script>
</body>
</html>`
    } else {
      srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;overflow:auto}
${css || ''}
</style>
</head>
<body>
${html || ''}
<script>
try{
${js || ''}
}catch(e){
parent.postMessage({type:'preview-error',error:e.message,title:'${title}'},'*');
}
window.onerror=function(m,s,l,c,e){
parent.postMessage({type:'preview-error',error:m,line:l,title:'${title}'},'*');
return true;
};
<\/script>
</body>
</html>`
    }

    iframe.srcdoc = srcdoc
    setError(null)

    const handler = (e) => {
      if (e.data?.type === 'preview-error' && e.data.title === title) {
        setError(e.data.error)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [html, css, js, reactCode, title])

  return (
    <div className={`relative ${className}`}>
      {error && (
        <div className="absolute inset-0 bg-[#0a0a0a] z-10 flex flex-col items-center justify-center p-4">
          <div className="text-[10px] text-red-400 font-medium mb-1">Preview Error</div>
          <div className="text-[9px] text-[#666] text-center max-w-[200px] truncate">{error}</div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title={title}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0"
        loading="lazy"
      />
    </div>
  )
}

export default memo(LivePreview)
