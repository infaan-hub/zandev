import { useEffect } from 'react'

export default function SEO({ title, description, url }) {
  useEffect(() => {
    document.title = title ? `${title} | ZanDev` : 'ZanDev — Design-to-Code Tool'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description || 'Transform UI designs into clean, copyable code. Browse components, inspect source, and export to any framework.')
    else {
      const m = document.createElement('meta')
      m.name = 'description'
      m.content = description || 'Transform UI designs into clean, copyable code. Browse components, inspect source, and export to any framework.'
      document.head.appendChild(m)
    }
    const og = document.querySelector('meta[property="og:title"]') || document.createElement('meta')
    og.setAttribute('property', 'og:title')
    og.setAttribute('content', title || 'ZanDev')
    if (!og.parentElement) document.head.appendChild(og)
    const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta')
    ogDesc.setAttribute('property', 'og:description')
    ogDesc.setAttribute('content', description || 'Design-to-Code Tool')
    if (!ogDesc.parentElement) document.head.appendChild(ogDesc)
    if (url) {
      const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      ogUrl.setAttribute('content', url)
      if (!ogUrl.parentElement) document.head.appendChild(ogUrl)
    }
  }, [title, description, url])
  return null
}
