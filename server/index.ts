import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS headers for Vercel deployment
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS method for preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Set up static serving for Vercel
if (process.env.NODE_ENV === "production") {
  // Serve static files from the dist directory
  const staticPath = path.join(process.cwd(), 'dist', 'public');
  app.use(express.static(staticPath));
}

async function startServer() {
  try {
    console.log("Starting server...");
    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // Setup for development or production
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
      serveStatic(app);

      // Catch-all route to handle SPA routing
      app.get('*', (req, res) => {
        res.sendFile(path.join(process.cwd(), 'dist', 'public', 'index.html'));
      });
    }

    // For local development
    if (process.env.NODE_ENV !== "production") {
      const port = process.env.PORT || 5000;
      server.listen({
        port,
        host: "0.0.0.0",
        reusePort: true,
      }, () => {
        console.log(`Server running on port ${port}`);
      });
    }

    return app;
  } catch (error) {
    console.error("Failed to start server:", error);
    throw error;
  }
}

// For Vercel, export the Express app directly
// For local development, start the server
const isVercel = process.env.VERCEL === "1";

if (!isVercel) {
  startServer().catch(err => {
    console.error("Server failed to start:", err);
    process.exit(1);
  });
}

export default app;