const express = require('express');
const app = express();
const fs = require('fs');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');
const https = require('http');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//#region console route
const logPath = path.join(__dirname, './server.log');
fs.writeFileSync(logPath, '');

const ts = () => {
  const d = new Date();
  return `[${new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'Europe/Lisbon',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(d)}] `;
};

['stdout', 'stderr'].forEach(s => {
  const orig = process[s].write.bind(process[s]);
  process[s].write = (chunk, enc, cb) => {
    fs.createWriteStream(logPath, { flags: 'a' }).write(chunk.toString().split(/\r?\n/).map(l => l ? `${ts()}${l}` : '').join('\n'));
    orig(chunk, enc, cb);
  };
});

app.get('/928031513', (req, res) => {
  fs.readFile(logPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler o log');
    res.type('text/plain').send(data);
  });
});

//#endregion

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.set('trust proxy', true);

app.get('/ip', (req, res) => {
  let clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.connection.remoteAddress;

  // Remove prefixos IPv6 ::ffff:
  if (clientIp.startsWith('::ffff:'))
    clientIp = clientIp.substring(7);

  if (clientIp === '127.0.0.1' || clientIp === '::1')
    return res.json({ error: 'IP local, localização não disponível' });

  const url = `http://ip-api.com/json/${clientIp}`;

  https.get(url, (resp) => {
    let data = '';

    resp.on('data', chunk => data += chunk);
    resp.on('end', () => {
      try {
        const location = JSON.parse(data);
        if (location.status === 'fail') {
          return res.json({ error: 'Não foi possível obter a localização' });
        }
        res.json({
          ip: location.query,
          country: location.country,
          region: location.regionName,
          city: location.city,
          lat: location.lat,
          lon: location.lon
        });
      } catch (e) {
        res.status(500).json({ error: 'Erro a processar a resposta' });
      }
    });
  }).on('error', () => {
    res.status(500).json({ error: 'Erro na requisição da API' });
  });
});

app.use(routes);

app.get('/', (req, res) => {
  res.send('🚀');
});

//#region 404 - not found route
app.use((req, res, next) => {
  if (!req.route) {

    res.status(404).send(`
      <html>
      <head>
        <title>404</title>
        <style>
          body {
            background-color: #1e1e1e;
            color: #d4d4d4;
            font-family: Consolas, "Courier New", monospace;
            padding: 20px;
            white-space: pre;
            font-size: 16px;
          }
          .key {
            color: #9cdcfe;
          }
          .string {
            color: #ce9178;
          }
          .number {
            color: #b5cea8;
          }
          .boolean {
            color: #569cd6;
          }
          .null {
            color: #569cd6;
          }
            #json p{ font-family: Consolas, "Courier New", monospace; }
        </style>
      </head>
      <body>
        <h1>404 - Not Found</h1>
        <pre id="json">"<p>${req.originalUrl}</p>" is an invalid route!</pre>
        <script>
          setTimeout(() => {
            window.location.href = "/";
          }, 5000);
          
          // Optional: add some basic JSON syntax highlighting
          const jsonEl = document.getElementById('json');
          jsonEl.innerHTML = jsonEl.textContent
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?=:))/g, '<span class="key">$1</span>')
            .replace(/: "(.*?)"/g, ': <span class="string">"$1"</span>')
            .replace(/: (\\d+)/g, ': <span class="number">$1</span>')
            .replace(/: (true|false)/g, ': <span class="boolean">$1</span>')
            .replace(/: (null)/g, ': <span class="null">$1</span>');
        </script>
      </body>
      </html>
    `);
    return; // Important to stop further middleware
  }
  next();
});
//#endregion

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

module.exports = app;