<div align="center">
  <a href="https://eruda.liriliri.io/" target="_blank">
    <img src="https://eruda.liriliri.io/icon.png" width="400">
  </a>
</div>

<h1 align="center">Eruda</h1>

<div align="center">

Console for Mobile Browsers.

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![Downloads][jsdelivr-image]][jsdelivr-url]
[![License][license-image]][npm-url]

</div>

[npm-image]: https://img.shields.io/npm/v/eruda?style=flat-square
[npm-url]: https://npmjs.org/package/eruda
[jsdelivr-image]: https://img.shields.io/jsdelivr/npm/hm/eruda?style=flat-square
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/eruda
[ci-image]: https://img.shields.io/github/actions/workflow/status/liriliri/eruda/main.yml?branch=master&style=flat-square
[ci-url]: https://github.com/liriliri/eruda/actions/workflows/main.yml 
[codecov-image]: https://img.shields.io/codecov/c/github/liriliri/eruda?style=flat-square
[codecov-url]: https://codecov.io/github/liriliri/eruda?branch=master
[license-image]: https://img.shields.io/npm/l/eruda?style=flat-square
[donate-image]: https://img.shields.io/badge/$-donate-0070ba.svg?style=flat-square

<img src="https://eruda.liriliri.io/screenshot.jpg" style="width:100%">

## Demo

![Demo](https://eruda.liriliri.io/qrcode.png)

Browse it on your phone: [eruda.liriliri.io](https://eruda.liriliri.io/)

## Install

You can get it on npm.

```bash
npm install eruda --save-dev
```

Add this script to your page.

```html
<script src="node_modules/eruda/eruda.js"></script>
<script>eruda.init();</script>
```

It's also available on [jsDelivr](http://www.jsdelivr.com/projects/eruda) and [cdnjs](https://cdnjs.com/libraries/eruda).

```html
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
```

For more detailed usage instructions, please read the documentation at [eruda.liriliri.io](https://eruda.liriliri.io/docs/)!

## Data Export Features

Eruda supports exporting various types of development data directly as Markdown or text files:
* **Console Logs:** Export all history logs (including level, timestamp, and origin) as a formatted Markdown text file using the export button in the Console panel control bar.
* **Network Traffic:** Export all network traffic details (methods, URLs, status codes, request/response headers, body payloads, cURL equivalents) in the Network panel using site-specific dynamic filenames.
* **Resources & Storage:** Export local storage, session storage, cookies, scripts, stylesheets, iframes, and images dynamically in the Resources panel.
* **System Info:** Export all system, browser, OS, location, and device metrics from the Info panel.
* **Unified Debug Report:** Compile all System Info, active Console Logs, captured Network Requests, Local/Session Storage items, and Cookies into a **single, comprehensive Markdown report file** (`debug_report.md`) with a single click from the Info panel control bar.

## Related Projects

* [eruda-android](https://github.com/liriliri/eruda-android): Simple webview with eruda loaded automatically.
* [chii](https://github.com/liriliri/chii): Remote debugging tool.
* [chobitsu](https://github.com/liriliri/chobitsu): Chrome devtools protocol JavaScript implementation.
* [licia](https://github.com/liriliri/licia): Utility library used by eruda.
* [luna](https://github.com/liriliri/luna): UI components used by eruda.
* [vivy](https://github.com/liriliri/vivy-docs): Icon image generation.

## Third Party

* [eruda-pixel](https://github.com/Faithree/eruda-pixel): UI pixel restoration tool.
* [eruda-webpack-plugin](https://github.com/huruji/eruda-webpack-plugin): Eruda webpack plugin.
* [eruda-vue-devtools](https://github.com/Zippowxk/vue-devtools-plugin): Eruda Vue-devtools plugin.

## Backers

<a rel="noreferrer noopener" href="https://opencollective.com/eruda" target="_blank"><img src="https://opencollective.com/eruda/backers.svg?width=890"></a>

## Contribution

Read [Contributing Guide](https://eruda.liriliri.io/docs/contributing.html) for development setup instructions.
