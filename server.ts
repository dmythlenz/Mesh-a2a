import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Mock peer data for the "Mesh"
  let peers: any[] = [];

  io.on("connection", (socket) => {
    console.log("Peer connected:", socket.id);
    
    // Initial peer state
    const peerInfo = {
      id: socket.id,
      latency: Math.floor(Math.random() * 20) + 5,
      gpu: ["RTX 4090", "RTX 3080", "RX 7900 XTX", "RTX 4070"][Math.floor(Math.random() * 4)],
      vram: [8, 12, 16, 24][Math.floor(Math.random() * 4)],
      trustScore: (Math.random() * 0.2 + 0.8).toFixed(2),
      status: "idle",
      location: {
        x: Math.random() * 100,
        y: Math.random() * 100
      }
    };
    
    peers.push(peerInfo);
    io.emit("mesh:update", peers);

    socket.on("resource:request", (req) => {
      console.log("Resource request received:", req);
      // Simulate "Bidding War"
      socket.broadcast.emit("resource:bid_request", { requestId: socket.id, ...req });
    });

    socket.on("resource:bid", (bid) => {
      io.to(bid.requestId).emit("resource:bid_received", { ...bid, peerId: socket.id });
    });

    socket.on("webrtc:signal", (data) => {
      io.to(data.to).emit("webrtc:signal", { from: socket.id, signal: data.signal });
    });

    socket.on("disconnect", () => {
      peers = peers.filter(p => p.id !== socket.id);
      io.emit("mesh:update", peers);
      console.log("Peer disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Liquid Mesh Server running on http://localhost:${PORT}`);
  });
}

startServer();
