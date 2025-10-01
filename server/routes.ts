import type { Express } from "express";
import { createServer, type Server } from "http";
import { createProxyMiddleware } from 'http-proxy-middleware';

export async function registerRoutes(app: Express): Promise<Server> {
  const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';
  
  app.use('/api', createProxyMiddleware({
    target: FASTAPI_URL,
    changeOrigin: true,
  }));

  const httpServer = createServer(app);

  return httpServer;
}
