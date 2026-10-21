import { useEffect, useRef, useState, useCallback } from 'react';
import { ShoppingItem, BudgetConfig, UserProfile, ConnectionStatus } from '../types';

const USER_COLORS = [
  '#059669', // Emerald
  '#2563eb', // Blue
  '#7c3aed', // Purple
  '#d97706', // Amber
  '#dc2626', // Red
  '#0d9488', // Teal
  '#db2777', // Pink
  '#4f46e5', // Indigo
];

function getOrCreateUser(): UserProfile {
  try {
    const saved = localStorage.getItem('superlista_user_profile');
    if (saved) return JSON.parse(saved);
  } catch {}

  const defaultNames = ['Comprador', 'Familia', 'Mamá', 'Papá', 'Compañero'];
  const randomName = defaultNames[Math.floor(Math.random() * defaultNames.length)];
  const randomColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
  const user: UserProfile = {
    id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: randomName,
    color: randomColor,
  };
  try {
    localStorage.setItem('superlista_user_profile', JSON.stringify(user));
  } catch {}
  return user;
}

interface UseRealtimeListProps {
  onRemoteItemAdd: (item: ShoppingItem) => void;
  onRemoteItemUpdate: (item: ShoppingItem) => void;
  onRemoteItemToggle: (id: string, checked: boolean, modifier?: any) => void;
  onRemoteItemRemove: (id: string) => void;
  onRemoteBudgetUpdate: (budget: BudgetConfig) => void;
  onRemoteListClear: () => void;
  onRemoteListClearPurchased: (remainingItems: ShoppingItem[]) => void;
  onRemoteInit: (items: ShoppingItem[], budget: BudgetConfig) => void;
  getCurrentState: () => { items: ShoppingItem[]; budget: BudgetConfig };
}

export function useRealtimeList({
  onRemoteItemAdd,
  onRemoteItemUpdate,
  onRemoteItemToggle,
  onRemoteItemRemove,
  onRemoteBudgetUpdate,
  onRemoteListClear,
  onRemoteListClearPurchased,
  onRemoteInit,
  getCurrentState,
}: UseRealtimeListProps) {
  const [roomId, setRoomId] = useState<string | null>(() => {
    // Check URL parameters for ?lista=xyz
    const params = new URLSearchParams(window.location.search);
    return params.get('lista') || null;
  });

  const [user, setUser] = useState<UserProfile>(getOrCreateUser);
  const [activeUsers, setActiveUsers] = useState<UserProfile[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  // Update user profile
  const updateUserProfile = (name: string, color?: string) => {
    const updated = {
      ...user,
      name: name.trim() || user.name,
      color: color || user.color,
    };
    setUser(updated);
    try {
      localStorage.setItem('superlista_user_profile', JSON.stringify(updated));
    } catch {}
  };

  const connectToRoom = useCallback((targetRoomId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setStatus('connecting');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      const { items, budget } = getCurrentState();
      ws.send(JSON.stringify({
        type: 'room:join',
        roomId: targetRoomId,
        user,
        initialItems: items,
        initialBudget: budget,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'room:init') {
          setActiveUsers(msg.activeUsers || []);
          onRemoteInit(msg.items, msg.budget);
        } else if (msg.type === 'presence:update') {
          setActiveUsers(msg.activeUsers || []);
        } else if (msg.type === 'item:add') {
          onRemoteItemAdd(msg.item);
        } else if (msg.type === 'item:update') {
          onRemoteItemUpdate(msg.item);
        } else if (msg.type === 'item:toggle') {
          onRemoteItemToggle(msg.id, msg.checked, msg.item?.lastModifiedBy);
        } else if (msg.type === 'item:remove') {
          onRemoteItemRemove(msg.id);
        } else if (msg.type === 'budget:update') {
          onRemoteBudgetUpdate(msg.budget);
        } else if (msg.type === 'list:clear') {
          onRemoteListClear();
        } else if (msg.type === 'list:clear_purchased') {
          onRemoteListClearPurchased(msg.items);
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    ws.onclose = () => {
      setStatus('disconnected');
      // If still in a room, attempt reconnection after 3 seconds
      if (roomId === targetRoomId) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectToRoom(targetRoomId);
        }, 3000);
      }
    };

    ws.onerror = (err) => {
      console.warn('WebSocket error:', err);
      ws.close();
    };
  }, [user, roomId, getCurrentState, onRemoteInit, onRemoteItemAdd, onRemoteItemUpdate, onRemoteItemToggle, onRemoteItemRemove, onRemoteBudgetUpdate, onRemoteListClear, onRemoteListClearPurchased]);

  // Handle URL change or join room
  const joinRoom = (newRoomId: string) => {
    const cleanId = newRoomId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!cleanId) return;

    setRoomId(cleanId);
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('lista', cleanId);
    window.history.pushState({}, '', url.toString());

    connectToRoom(cleanId);
  };

  const leaveRoom = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setRoomId(null);
    setActiveUsers([]);
    setStatus('disconnected');

    const url = new URL(window.location.href);
    url.searchParams.delete('lista');
    window.history.pushState({}, '', url.toString());
  };

  useEffect(() => {
    if (roomId) {
      connectToRoom(roomId);
    }
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [roomId]);

  // Outgoing broadcast helpers
  const send = (msg: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && roomId) {
      wsRef.current.send(JSON.stringify({ ...msg, roomId, user }));
    }
  };

  const broadcastAdd = (item: ShoppingItem) => {
    send({ type: 'item:add', item });
  };

  const broadcastUpdate = (item: ShoppingItem) => {
    send({ type: 'item:update', item });
  };

  const broadcastToggle = (id: string, checked: boolean) => {
    send({ type: 'item:toggle', id, checked });
  };

  const broadcastRemove = (id: string) => {
    send({ type: 'item:remove', id });
  };

  const broadcastBudget = (budget: BudgetConfig) => {
    send({ type: 'budget:update', budget });
  };

  const broadcastClear = () => {
    send({ type: 'list:clear' });
  };

  const broadcastClearPurchased = () => {
    send({ type: 'list:clear_purchased' });
  };

  return {
    roomId,
    user,
    activeUsers,
    status,
    isShared: !!roomId,
    joinRoom,
    leaveRoom,
    updateUserProfile,
    broadcastAdd,
    broadcastUpdate,
    broadcastToggle,
    broadcastRemove,
    broadcastBudget,
    broadcastClear,
    broadcastClearPurchased,
  };
}
