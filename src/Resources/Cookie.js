import map from 'licia/map'
import trim from 'licia/trim'
import isNull from 'licia/isNull'
import each from 'licia/each'
import copy from 'licia/copy'
import LunaModal from 'luna-modal'
import LunaDataGrid from 'luna-data-grid'
import { setState, getState } from './util'
import {
  downloadMarkdown,
  exportButtonHtml,
  formatCookieMarkdown,
  getExportFileName,
} from './export'
import chobitsu from '../lib/chobitsu'
import { classPrefix as c } from '../lib/util'

export default class Cookie {
  constructor($container, devtools) {
    this._$container = $container
    this._devtools = devtools
    this._selectedItem = null
    this._cookies = []

    this._initTpl()
    this._dataGrid = new LunaDataGrid(this._$dataGrid.get(0), {
      columns: [
        {
          id: 'key',
          title: 'Key',
          weight: 30,
        },
        {
          id: 'value',
          title: 'Value',
          weight: 90,
        },
      ],
      minHeight: 60,
      maxHeight: 223,
    })

    this._bindEvent()
  }
  refresh() {
    const $container = this._$container
    const dataGrid = this._dataGrid

    const { cookies } = chobitsu.domain('Network').getCookies()
    this._cookies = cookies
    const cookieData = map(cookies, ({ name, value }) => ({
      key: name,
      val: value,
    }))

    dataGrid.clear()
    each(cookieData, ({ key, val }) => {
      dataGrid.append(
        {
          key,
          value: val,
        },
        {
          selectable: true,
        }
      )
    })

    const cookieState = getState('cookie', cookieData.length)
    setState($container, cookieState)
  }
  _export = () => {
    const md = formatCookieMarkdown(this._cookies)

    if (!md) {
      this._devtools.notify('No cookies to export', { icon: 'error' })
      return
    }

    downloadMarkdown(getExportFileName('cookies'), md)
  }
  _initTpl() {
    const $container = this._$container

    $container.html(
      c(`<h2 class="title">
      Cookie
      <div class="btn refresh-cookie">
        <span class="icon-refresh"></span>
      </div>
      <div class="btn show-detail btn-disabled">
        <span class="icon icon-eye"></span>
      </div>
      <div class="btn copy-cookie btn-disabled">
        <span class="icon icon-copy"></span>
      </div>
      <div class="btn delete-cookie btn-disabled">
        <span class="icon icon-delete"></span>
      </div>
      <div class="btn clear-cookie">
        <span class="icon-clear"></span>
      </div>
      ${exportButtonHtml('export-cookie')}
      <div class="btn filter" data-type="cookie">
        <span class="icon-filter"></span>
      </div>
      <div class="btn filter-text"></div>
    </h2>
    <div class="data-grid"></div>`)
    )

    this._$dataGrid = $container.find(c('.data-grid'))
    this._$filterText = $container.find(c('.filter-text'))
  }
  _updateButtons() {
    const $container = this._$container
    const $showDetail = $container.find(c('.show-detail'))
    const $deleteCookie = $container.find(c('.delete-cookie'))
    const $copyCookie = $container.find(c('.copy-cookie'))
    const btnDisabled = c('btn-disabled')

    $showDetail.addClass(btnDisabled)
    $deleteCookie.addClass(btnDisabled)
    $copyCookie.addClass(btnDisabled)

    if (this._selectedItem) {
      $showDetail.rmClass(btnDisabled)
      $deleteCookie.rmClass(btnDisabled)
      $copyCookie.rmClass(btnDisabled)
    }
  }
  _getVal(key) {
    const { cookies } = chobitsu.domain('Network').getCookies()

    for (let i = 0, len = cookies.length; i < len; i++) {
      if (cookies[i].name === key) {
        return cookies[i].value
      }
    }

    return ''
  }
  _bindEvent() {
    const devtools = this._devtools

    this._$container
      .on('click', c('.refresh-cookie'), () => {
        devtools.notify('Refreshed', { icon: 'success' })
        this.refresh()
      })
      .on('click', c('.export-cookie'), this._export)
      .on('click', c('.clear-cookie'), () => {
        chobitsu.domain('Storage').clearDataForOrigin({
          storageTypes: 'cookies',
        })
        this.refresh()
      })
      .on('click', c('.delete-cookie'), () => {
        const key = this._selectedItem

        chobitsu.domain('Network').deleteCookies({ name: key })
        this.refresh()
      })
      .on('click', c('.show-detail'), () => {
        const key = this._selectedItem
        const val = this._getVal(key)

        try {
          showSources('object', JSON.parse(val))
        } catch {
          showSources('raw', val)
        }
      })
      .on('click', c('.copy-cookie'), () => {
        const key = this._selectedItem
        copy(this._getVal(key))
        devtools.notify('Copied', { icon: 'success' })
      })
      .on('click', c('.filter'), () => {
        LunaModal.prompt('Filter').then((filter) => {
          if (isNull(filter)) return
          filter = trim(filter)
          this._filter = filter
          this._$filterText.text(filter)
          this._dataGrid.setOption('filter', filter)
        })
      })

    function showSources(type, data) {
      const sources = devtools.get('sources')
      if (!sources) return

      sources.set(type, data)

      devtools.showTool('sources')

      return true
    }

    this._dataGrid
      .on('select', (node) => {
        this._selectedItem = node.data.key
        this._updateButtons()
      })
      .on('deselect', () => {
        this._selectedItem = null
        this._updateButtons()
      })
  }
}
