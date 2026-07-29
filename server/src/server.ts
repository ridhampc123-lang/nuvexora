import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocketIO } from "./socket/index.js";
import { seedDatabase } from "./seed/seed.js";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Initialize Socket.IO Real-time Server
initSocketIO(httpServer);

// Connect to Database & Start Listener
connectDB().then(async () => {
  await seedDatabase();
  httpServer.listen(PORT, () => {
    console.log(`[Server] Nuvexora API Engine running on http://localhost:${PORT}`);
    console.log(`[Socket.IO] Real-time engine ready on ws://localhost:${PORT}`);
  });
});
