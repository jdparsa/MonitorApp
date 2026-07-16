import { AngularAppEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  // 💡 Instantiate the standard rendering engine core
  const angularEngine = new AngularAppEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static assets natively from the browser distribution folder
  server.get('**/*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // 💡 THE TYPE-SAFE MIDDLEWARE PIPELINE ROUTE HANDLER
  // This satisfies NodeRequestHandlerFunction by executing standard Node signature params,
  // then leveraging standard Fetch Web API Response mappings under the hood.
  server.get('**', (req, res, next) => {
    // 1. Construct a fully compliant global Web API Request primitive from Express data strings
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}${req.originalUrl}`;
    
    const webRequest = new Request(fullUrl, {
      method: req.method,
      headers: req.headers as HeadersInit
    });

    // 2. Hand the Web API request to the engine and process the resulting Web standard response stream
    angularEngine
      .handle(webRequest)
      .then((webResponse) => {
        if (webResponse) {
          // Stream headers and status out to the raw Express Node ServerResponse channels
          res.status(webResponse.status);
          webResponse.headers.forEach((value, key) => res.setHeader(key, value));
          
          webResponse.text().then((htmlBody) => {
            res.send(htmlBody);
          });
        } else {
          next();
        }
      })
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();