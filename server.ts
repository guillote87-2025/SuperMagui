import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

interface UserProfile {
  id: string;
  name: string;
  color: string;
}

interface ItemModifier {
  userName: string;
  userColor: string;
  action: 'agregó' | 'marcó en carrito' | 'desmarcó' | 'modificó cantidad' | 'editó precio' | 'editó nota';
  timestamp: number;
}

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  checked: boolean;
  notes?: string;
  isCustom?: boolean;
  addedAt: number;
  lastModifiedBy?: ItemModifier;
}

interface BudgetConfig {
  totalBudget: number;
  enabled: boolean;
}

interface RoomData {
  items: ShoppingItem[];
  budget: BudgetConfig;
  clients: Map<WebSocket, UserProfile>;
}

// In-memory room store (server authoritative)
const rooms = new Map<string, RoomData>();

function getOrCreateRoom(roomId: string): RoomData {
  let room = rooms.get(roomId);
  if (!room) {
    room = {
      items: [],
      budget: { totalBudget: 0, enabled: false },
      clients: new Map(),
    };
    rooms.set(roomId, room);
  }
  return room;
}

function broadcastToRoom(roomId: string, message: object, senderWs?: WebSocket) {
  const room = rooms.get(roomId);
  if (!room) return;
  const payload = JSON.stringify(message);
  for (const [clientWs] of room.clients) {
    if (clientWs !== senderWs && clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(payload);
    }
  }
}

function broadcastPresence(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;
  const activeUsers = Array.from(room.clients.values());
  const payload = JSON.stringify({
    type: 'presence:update',
    roomId,
    activeUsers,
  });
  for (const [clientWs] of room.clients) {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(payload);
    }
  }
}

// WebSocket handler
wss.on('connection', (ws: WebSocket) => {
  let currentRoomId: string | null = null;
  let currentUser: UserProfile | null = null;

  ws.on('message', (rawData) => {
    try {
      const data = JSON.parse(rawData.toString());

      if (data.type === 'room:join') {
        const { roomId, user, initialItems, initialBudget } = data;
        currentRoomId = roomId;
        currentUser = user;

        const room = getOrCreateRoom(roomId);
        room.clients.set(ws, user);

        // If room is empty and client provided initial items, seed the room
        if (room.items.length === 0 && initialItems && initialItems.length > 0) {
          room.items = initialItems;
        }
        if (!room.budget.enabled && initialBudget && initialBudget.enabled) {
          room.budget = initialBudget;
        }

        // Send full sync to joining client
        ws.send(JSON.stringify({
          type: 'room:init',
          roomId,
          items: room.items,
          budget: room.budget,
          activeUsers: Array.from(room.clients.values()),
        }));

        // Broadcast presence to all other clients in room
        broadcastPresence(roomId);
      }

      else if (data.type === 'item:add') {
        const { roomId, item, user } = data;
        const room = getOrCreateRoom(roomId);
        // Idempotent check
        const existingIdx = room.items.findIndex(i => i.id === item.id);
        if (existingIdx >= 0) {
          room.items[existingIdx] = item;
        } else {
          room.items.unshift(item);
        }
        broadcastToRoom(roomId, { type: 'item:add', item, user }, ws);
      }

      else if (data.type === 'item:update') {
        const { roomId, item, user } = data;
        const room = getOrCreateRoom(roomId);
        const idx = room.items.findIndex(i => i.id === item.id);
        if (idx >= 0) {
          room.items[idx] = item;
          broadcastToRoom(roomId, { type: 'item:update', item, user }, ws);
        }
      }

      else if (data.type === 'item:toggle') {
        const { roomId, id, checked, user } = data;
        const room = getOrCreateRoom(roomId);
        const item = room.items.find(i => i.id === id);
        if (item) {
          item.checked = checked;
          item.lastModifiedBy = {
            userName: user.name,
            userColor: user.color,
            action: checked ? 'marcó en carrito' : 'desmarcó',
            timestamp: Date.now(),
          };
          broadcastToRoom(roomId, { type: 'item:toggle', id, checked, item, user }, ws);
        }
      }

      else if (data.type === 'item:remove') {
        const { roomId, id, user } = data;
        const room = getOrCreateRoom(roomId);
        room.items = room.items.filter(i => i.id !== id);
        broadcastToRoom(roomId, { type: 'item:remove', id, user }, ws);
      }

      else if (data.type === 'budget:update') {
        const { roomId, budget, user } = data;
        const room = getOrCreateRoom(roomId);
        room.budget = budget;
        broadcastToRoom(roomId, { type: 'budget:update', budget, user }, ws);
      }

      else if (data.type === 'list:clear') {
        const { roomId, user } = data;
        const room = getOrCreateRoom(roomId);
        room.items = [];
        broadcastToRoom(roomId, { type: 'list:clear', user }, ws);
      }

      else if (data.type === 'list:clear_purchased') {
        const { roomId, user } = data;
        const room = getOrCreateRoom(roomId);
        room.items = room.items.filter(i => !i.checked);
        broadcastToRoom(roomId, { type: 'list:clear_purchased', items: room.items, user }, ws);
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoomId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.clients.delete(ws);
        broadcastPresence(currentRoomId);
        if (room.clients.size === 0) {
          // Keep state in memory so rejoining sees the items
        }
      }
    }
  });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), activeRooms: rooms.size });
});

app.get('/api/download/windows-exe', (req, res) => {
  const electronZip = path.resolve(__dirname, 'dist-electron/SuperLista-Windows-x64.zip');
  const publicZip = path.resolve(__dirname, 'public/SuperLista-Windows-x64.zip');
  const zipPath = fs.existsSync(electronZip) ? electronZip : publicZip;

  if (fs.existsSync(zipPath)) {
    const stat = fs.statSync(zipPath);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', 'attachment; filename="SuperLista-Windows-x64.zip"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const stream = fs.createReadStream(zipPath);
    stream.pipe(res);
  } else {
    res.status(404).send('El instalador de Windows aún se está generando.');
  }
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({
    roomId: req.params.roomId,
    itemsCount: room.items.length,
    budget: room.budget,
    activeUsersCount: room.clients.size,
  });
});

// Vite or Static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
