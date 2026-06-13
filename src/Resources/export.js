const EXPORT_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="16px" height="16px"><path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112A16,16,0,0,1,56,96h64v48a8,8,0,0,0,16,0V96h64A16,16,0,0,1,216,112ZM136,43.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,11.32,11.32L120,43.31V96a8,8,0,0,0,16,0Z"/></svg>'

export function exportButtonHtml(className, title = 'Export to Markdown') {
  return `<div class="btn ${className}" title="${title}">${EXPORT_ICON}</div>`
}

export function downloadHtml(filename, content) {
  downloadBlob(filename, 'text/html', content)
}

export function downloadMarkdown(filename, content) {
  downloadBlob(filename, 'text/markdown', content)
}

export function getExportFileName(name, ext = 'md') {
  return `${getExportFilePrefix()}_${name}.${ext}`
}

function downloadBlob(filename, type, content) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function formatStorageMarkdown(title, items, getValue) {
  if (!items.length) return ''

  let md = `# ${title} Storage\n\n`

  items.forEach(({ key }, index) => {
    md += `## ${index + 1}. ${key}\n\n`
    md += '```txt\n'
    md += `${getValue(key)}\n`
    md += '```\n\n'
  })

  return md
}

export function formatCookieMarkdown(cookies) {
  if (!cookies.length) return ''

  let md = '# Cookies\n\n'

  cookies.forEach((cookie, index) => {
    md += `## ${index + 1}. ${cookie.name}\n\n`
    md += '```txt\n'
    md += `${cookie.value}\n`
    md += '```\n\n'

    md += '### Details\n\n'
    md += `- Domain: ${cookie.domain || ''}\n`
    md += `- Path: ${cookie.path || ''}\n`
    md += `- Expires: ${cookie.expires || ''}\n`
    md += `- Secure: ${cookie.secure || false}\n`
    md += `- HTTP Only: ${cookie.httpOnly || false}\n`
    md += `- Same Site: ${cookie.sameSite || ''}\n\n`
  })

  return md
}

export function formatListMarkdown(title, items) {
  if (!items.length) return ''

  let md = `# ${title}\n\n`

  items.forEach((item, index) => {
    md += `${index + 1}. ${item}\n`
  })

  return `${md}\n`
}

function getExportFilePrefix() {
  const hostname = getHostnamePrefix()
  const path = getPathPrefix()
  const prefix = [hostname, ...path].filter(Boolean).join('_')

  return sanitizeName(prefix) || 'unknown'
}

function getHostnamePrefix() {
  const hostname = (location.hostname || '').replace(/^www\./i, '')
  const parts = hostname.split('.').filter(Boolean)

  if (!parts.length) return ''

  const suffix = parts.slice(-2).join('.')
  const commonSuffixes = ['co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com.au', 'net.au', 'org.au', 'co.in', 'co.jp', 'com.br', 'com.mx']

  if (contain(commonSuffixes, suffix)) {
    return parts.slice(0, -2).join('_')
  }

  return parts.slice(0, -1).join('_')
}

function getPathPrefix() {
  const pathname = location.pathname || ''

  return pathname
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/\.[^./]+$/, ''))
    .filter(Boolean)
}

function sanitizeName(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
}

function contain(arr, val) {
  return arr.indexOf(val) !== -1
}
