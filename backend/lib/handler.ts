import type { NextApiRequest, NextApiResponse } from "next";

type HandlerFunction = (req: NextApiRequest, res: NextApiResponse, next?: () => void) => Promise<void> | void;
type Middleware = (req: NextApiRequest, res: NextApiResponse, next: () => void | Promise<void>) => void | Promise<void>;

export default function handler() {
  const methods: Record<string, HandlerFunction[]> = {};
  const globalMiddlewares: Middleware[] = [];

  const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (withCors(req, res)) return;

    const method = req.method?.toLowerCase() || "";
    const handlers = [...globalMiddlewares, ...(methods[method] || [])];

    if (!handlers.length) {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const runHandlers = async (index = 0): Promise<void> => {
      if (index >= handlers.length) return;

      const fn = handlers[index];
      await fn(req, res, () => runHandlers(index + 1));
    };

    await runHandlers();
  };

  const extendedHandler = Object.assign(apiHandler, {
    use(mw: Middleware) {
      globalMiddlewares.push(mw);
      return extendedHandler;
    },
    get(...fns: HandlerFunction[]) {
      methods["get"] = fns;
      return extendedHandler;
    },
    post(...fns: HandlerFunction[]) {
      methods["post"] = fns;
      return extendedHandler;
    },
    put(...fns: HandlerFunction[]) {
      methods["put"] = fns;
      return extendedHandler;
    },
    delete(...fns: HandlerFunction[]) {
      methods["delete"] = fns;
      return extendedHandler;
    },
  });

  return extendedHandler;
}

function withCors(req: NextApiRequest, res: NextApiResponse): boolean {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
}
