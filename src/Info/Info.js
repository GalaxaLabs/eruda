import Tool from '../DevTools/Tool'
import defInfo from './defInfo'
import each from 'licia/each'
import isFn from 'licia/isFn'
import isUndef from 'licia/isUndef'
import cloneDeep from 'licia/cloneDeep'
import evalCss from '../lib/evalCss'
import map from 'licia/map'
import escape from 'licia/escape'
import copy from 'licia/copy'
import $ from 'licia/$'
import { classPrefix as c } from '../lib/util'
import { downloadMarkdown, getExportFileName } from '../Resources/export'

export default class Info extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Info.scss'))

    this.name = 'info'
    this._infos = []
  }
  init($el, container) {
    super.init($el)
    this._container = container

    this._initTpl()
    this._addDefInfo()
    this._bindEvent()
  }
  _initTpl() {
    const $el = this._$el
    $el.html(
      c(`
      <div class="control">
        <span class="title">System Info</span>
        <span class="export-info" title="Export Info to Markdown"></span>
        <span class="export-report" title="Export Full Debug Report"></span>
      </div>
      <div class="info-content"></div>
      `)
    )
    this._$control = $el.find(c('.control'))
    this._$infoContent = $el.find(c('.info-content'))

    this._$control.find(c('.export-info')).css({
      position: 'absolute',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      top: '0',
      padding: '10px',
      width: '36px',
      height: '36px',
      boxSizing: 'border-box',
      color: 'inherit',
    }).html(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="16px" height="16px"><path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112A16,16,0,0,1,56,96h64v48a8,8,0,0,0,16,0V96h64A16,16,0,0,1,216,112ZM136,43.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,11.32,11.32L120,43.31V96a8,8,0,0,0,16,0Z"/></svg>'
    )

    this._$control.find(c('.export-report')).css({
      position: 'absolute',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      top: '0',
      padding: '10px',
      width: '36px',
      height: '36px',
      boxSizing: 'border-box',
      color: 'inherit',
    }).html(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="16px" height="16px"><path d="M224,48H32a8,8,0,0,0-8,8V96a8,8,0,0,0,8,8h8v104a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V104h8a8,8,0,0,0,8-8V56A8,8,0,0,0,224,48ZM200,208H56V104H200Zm16-120H40V64H216ZM160,128H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Z"/></svg>'
    )
  }
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
  }
  add(name, val) {
    const infos = this._infos
    let isUpdate = false

    each(infos, (info) => {
      if (name !== info.name) return

      info.val = val
      isUpdate = true
    })

    if (!isUpdate) infos.push({ name, val })

    this._render()

    return this
  }
  get(name) {
    const infos = this._infos

    if (isUndef(name)) {
      return cloneDeep(infos)
    }

    let result

    each(infos, (info) => {
      if (name === info.name) result = info.val
    })

    return result
  }
  remove(name) {
    const infos = this._infos

    for (let i = infos.length - 1; i >= 0; i--) {
      if (infos[i].name === name) infos.splice(i, 1)
    }

    this._render()

    return this
  }
  clear() {
    this._infos = []

    this._render()

    return this
  }
  _addDefInfo() {
    each(defInfo, (info) => this.add(info.name, info.val))
  }
  _render() {
    const infos = []

    each(this._infos, ({ name, val }) => {
      if (isFn(val)) val = val()

      infos.push({ name, val })
    })

    const html = `<ul>${map(
      infos,
      (info) =>
        `<li><h2 class="${c('title')}">${escape(info.name)}<span class="${c(
          'icon-copy copy'
        )}"></span></h2><div class="${c('content')}">${info.val}</div></li>`
    ).join('')}</ul>`

    this._renderHtml(html)
  }
  _export = () => {
    let md = '# System Info\n\n'
    let hasInfo = false

    each(this._infos, ({ name, val }) => {
      hasInfo = true
      if (isFn(val)) val = val()

      let cleanVal = val
      if (/<[^>]*>/g.test(val)) {
        cleanVal = val
          .replace(/<table><tbody>/gi, '')
          .replace(/<\/tbody><\/table>/gi, '')
          .replace(/<tr>/gi, '')
          .replace(/<\/tr>/gi, '\n')
          .replace(/<td[^>]*>/gi, '')
          .replace(/<\/td>/gi, ': ')
          .replace(/: \n/gi, '\n')
          .replace(/<a[^>]*href="([^"]*)"[^>]*>.*?<\/a>/gi, '$1')
          .trim()
      }

      md += `## ${name}\n\n${cleanVal}\n\n`
    })

    if (!hasInfo) {
      this._container.notify('No info to export', { icon: 'error' })
      return
    }

    downloadMarkdown(getExportFileName('info'), md)
  }
  _exportReport = () => {
    const container = this._container
    let md = '# Eruda Unified Debug Report\n\n'
    md += `Generated: ${new Date().toISOString()}\n\n`

    // 1. System Info
    md += '# 1. System Info\n\n'
    each(this._infos, ({ name, val }) => {
      if (isFn(val)) val = val()
      let cleanVal = val
      if (/<[^>]*>/g.test(val)) {
        cleanVal = val
          .replace(/<table><tbody>/gi, '')
          .replace(/<\/tbody><\/table>/gi, '')
          .replace(/<tr>/gi, '')
          .replace(/<\/tr>/gi, '\n')
          .replace(/<td[^>]*>/gi, '')
          .replace(/<\/td>/gi, ': ')
          .replace(/: \n/gi, '\n')
          .trim()
      }
      md += `### ${name}\n${cleanVal}\n\n`
    })

    // 2. Console Logs
    md += '# 2. Console Logs\n\n'
    const consoleTool = container.get('console')
    if (consoleTool && consoleTool._logger) {
      let consoleMd = ''
      each(consoleTool._logger.logs, (log) => {
        const time = log.header ? `[${log.header.time}] ` : ''
        const from = log.header && log.header.from ? ` (${log.header.from})` : ''
        consoleMd += `${time}${log.type.toUpperCase()}: ${log.text()}${from}\n\n`
      })
      md += consoleMd || 'No console logs.\n\n'
    } else {
      md += 'Console tool not loaded.\n\n'
    }

    // 3. Network Requests
    md += '# 3. Network Requests\n\n'
    const networkTool = container.get('network')
    if (networkTool && networkTool._requests && networkTool._requests.length) {
      let networkMd = ''
      let count = 1
      each(networkTool._requests, (request) => {
        networkMd += `### ${count}. ${request.method} ${request.url} (${request.status})\n`
        if (request.data) networkMd += `- Request Data: ${request.data}\n`
        if (request.resTxt) networkMd += `- Response text snippet: ${request.resTxt.slice(0, 500)}\n`
        networkMd += '\n'
        count++
      })
      md += networkMd
    } else {
      md += 'No network requests captured.\n\n'
    }

    // 4. Storage & Cookies
    md += '# 4. Storage & Cookies\n\n'
    const resourcesTool = container.get('resources')
    if (resourcesTool) {
      md += '## Local Storage\n\n'
      if (resourcesTool._localStorage && resourcesTool._localStorage._storeData) {
        const data = resourcesTool._localStorage._storeData
        if (data.length) {
          each(data, ({ key }) => {
            md += `- **${key}**: ${localStorage.getItem(key) || ''}\n`
          })
        } else {
          md += 'Empty\n'
        }
      }
      md += '\n'

      md += '## Session Storage\n\n'
      if (resourcesTool._sessionStorage && resourcesTool._sessionStorage._storeData) {
        const data = resourcesTool._sessionStorage._storeData
        if (data.length) {
          each(data, ({ key }) => {
            md += `- **${key}**: ${sessionStorage.getItem(key) || ''}\n`
          })
        } else {
          md += 'Empty\n'
        }
      }
      md += '\n'

      md += '## Cookies\n\n'
      if (resourcesTool._cookie && resourcesTool._cookie._storeData) {
        const data = resourcesTool._cookie._storeData
        if (data.length) {
          each(data, (cookie) => {
            md += `- **${cookie.name}**: ${cookie.value} (Domain: ${cookie.domain || ''})\n`
          })
        } else {
          md += 'Empty\n'
        }
      }
    } else {
      md += 'Resources tool not loaded.\n\n'
    }

    downloadMarkdown(getExportFileName('debug_report'), md)
  }
  _bindEvent() {
    const container = this._container

    this._$el.on('click', c('.copy'), function () {
      const $li = $(this).parent().parent()
      const name = $li.find(c('.title')).text()
      const content = $li.find(c('.content')).text()
      copy(`${name}: ${content}`)
      container.notify('Copied', { icon: 'success' })
    })

    this._$control.on('click', c('.export-info'), this._export)
    this._$control.on('click', c('.export-report'), this._exportReport)
  }
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$infoContent.html(html)
  }
}
