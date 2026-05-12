import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, Connect } from 'vite';

interface AppConfig {
  env: Record<string, string>;
}

function loadConfig(root: string): AppConfig {
  const configPath = path.resolve(root, 'config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`config.json not found at ${configPath}`);
  }
  const raw = fs.readFileSync(configPath, 'utf-8');
  const parsed = JSON.parse(raw) as AppConfig;
  if (!parsed.env) throw new Error('config.json missing "env"');
  return parsed;
}

function ensureLogDir(root: string): string {
  const dir = path.resolve(root, 'logs');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function writeLog(logDir: string, entry: Record<string, unknown>) {
  const date = new Date();
  const day = date.toISOString().slice(0, 10);
  const file = path.join(logDir, `chat-${day}.log`);
  const line = JSON.stringify({ timestamp: date.toISOString(), ...entry }) + '\n';
  fs.appendFileSync(file, line, 'utf-8');
}

async function readJson(req: Connect.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export default function chatApiPlugin(): Plugin {
  let config: AppConfig;
  let logDir: string;
  let projectRoot: string;

  return {
    name: 'chat-api-plugin',
    configResolved(resolved) {
      projectRoot = resolved.root;
      config = loadConfig(projectRoot);
      logDir = ensureLogDir(projectRoot);
      // eslint-disable-next-line no-console
      console.log(
        `[chat-api] config loaded: baseUrl=${config.env.ANTHROPIC_BASE_URL}, logs=${logDir}`,
      );
    },
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }
        const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        try {
          const body = (await readJson(req)) as {
            model?: string;
            messages?: Array<{ role: string; content: string }>;
            system?: string;
            max_tokens?: number;
          };

          const payload = {
            model: body.model || 'claude-sonnet-4-6',
            max_tokens: body.max_tokens ?? 4096,
            messages: body.messages || [],
            ...(body.system ? { system: body.system } : {}),
          };

          const url = `${config.env.ANTHROPIC_BASE_URL.replace(/\/$/, '')}/v1/messages`;

          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
            Authorization: `Bearer ${config.env.ANTHROPIC_AUTH_TOKEN}`,
            'x-api-key': config.env.ANTHROPIC_AUTH_TOKEN,
          };
          if (config.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) {
            headers['x-claude-code-disable-nonessential-traffic'] =
              config.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC;
          }
          if (config.env.CLAUDE_CODE_ATTRIBUTION_HEADER) {
            headers['x-claude-code-attribution'] =
              config.env.CLAUDE_CODE_ATTRIBUTION_HEADER;
          }

          writeLog(logDir, {
            requestId,
            type: 'request',
            url,
            method: 'POST',
            headers: { ...headers, Authorization: 'Bearer ***', 'x-api-key': '***' },
            body: payload,
          });

          const upstream = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
          });
          const text = await upstream.text();
          let json: unknown;
          try {
            json = JSON.parse(text);
          } catch {
            json = { raw: text };
          }

          writeLog(logDir, {
            requestId,
            type: 'response',
            status: upstream.status,
            ok: upstream.ok,
            body: json,
          });

          res.statusCode = upstream.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(typeof json === 'string' ? json : JSON.stringify(json));
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          writeLog(logDir, { requestId, type: 'error', message });
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: message, requestId }));
        }
      });
    },
  };
}
