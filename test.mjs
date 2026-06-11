import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <h1>Test</h1>
  <script src="/eruda.js"></script>
  <script>
    window.__log = [];
    function log(x) { window.__log.push(x); }
    eruda.init();
    eruda.show();
    setTimeout(function() {
      try {
        var erudaEl = document.getElementById('eruda');
        log('erudaEl=' + !!erudaEl);
        log('erudaDisplay=' + (erudaEl ? getComputedStyle(erudaEl).display : 'N/A'));
        var all = erudaEl ? erudaEl.innerHTML : document.body.innerHTML;
        log('hasBtnClass=' + all.includes('btn'));
        log('hasExportScript=' + all.includes('export-script'));
        log('hasSvg=' + all.includes('svg'));
        log('hasTitle=' + all.includes('Script') || all.includes('Stylesheet'));
      } catch(e) {
        log('error=' + e.message);
      }
      window.__done = true;
    }, 1000);
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:9876');
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(HTML);
    return;
  }
  if (url.pathname === '/eruda.js') {
    const body = fs.readFileSync(path.join(DIST, 'eruda.js'));
    res.writeHead(200, {'Content-Type':'application/javascript'});
    res.end(body);
    return;
  }
  res.writeHead(404);
  res.end();
});

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu','--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  server.listen(9876, async () => {
    await page.goto('http://localhost:9876/', {waitUntil:'load', timeout:20000});
    await page.waitForFunction('window.__done', {timeout:15000});
    const log = await page.evaluate(() => window.__log);
    console.log(log.join('\n'));
    await browser.close();
    server.close();
    process.exit(0);
  });
})();
