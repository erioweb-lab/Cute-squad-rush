import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Real-time multiplayer logic
  const players: { [id: string]: any } = {};

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (playerData) => {
      players[socket.id] = { ...playerData, id: socket.id };
      io.emit("players:update", players);
    });

    socket.on("move", (moveData) => {
      if (players[socket.id]) {
        players[socket.id].x = moveData.x;
        players[socket.id].y = moveData.y;
        socket.broadcast.emit("player:move", { id: socket.id, x: moveData.x, y: moveData.y });
      }
    });

    socket.on("bomb:place", (bombData) => {
      io.emit("bomb:placed", { ...bombData, playerId: socket.id });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      delete players[socket.id];
      io.emit("player:leave", socket.id);
    });
  });

  // Vite middleware for development
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
