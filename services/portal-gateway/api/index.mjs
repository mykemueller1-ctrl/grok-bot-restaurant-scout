/**
 * Vercel serverless entry — reuses the same HTTP request handler as local listen.
 */
import { createServer } from "../src/server.mjs";

const server = createServer();

export default function handler(req, res) {
  server.emit("request", req, res);
}
