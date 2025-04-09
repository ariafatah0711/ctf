import { withCors } from "./utils/withCors";

export default function handler() {
  const methods = {};

  const apiHandler = async (req, res) => {
    if (withCors(req, res)) return;
    const method = methods[req.method.toLowerCase()];
    if (!method) return res.status(405).json({ error: "Method Not Allowed" });
    return method(req, res);
  };

  ["get", "post", "put", "delete"].forEach((method) => {
    apiHandler[method] = (fn) => {
      methods[method] = fn;
      return apiHandler;
    };
  });

  return apiHandler;
}
