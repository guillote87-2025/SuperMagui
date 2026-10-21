import React, { useState } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  Link2, 
  Share2, 
  X, 
  Wifi, 
  LogOut, 
  UserCheck, 
  Sparkles 
} from 'lucide-react';
import { UserProfile, ConnectionStatus } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
  currentUser: UserProfile;
  activeUsers: UserProfile[];
  connectionStatus: ConnectionStatus;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  onUpdateUser: (name: string, color?: string) => void;
}

const COLOR_OPTIONS = [
  '#059669', // Emerald
  '#2563eb', // Blue
  '#7c3aed', // Purple
  '#d97706', // Amber
  '#dc2626', // Red
  '#0d9488', // Teal
  '#db2777', // Pink
  '#4f46e5', // Indigo
];

export const CollaborativeShareModal: React.FC<Props> = ({
  isOpen,
  onClose,
  roomId,
  currentUser,
  activeUsers,
  connectionStatus,
  onJoinRoom,
  onLeaveRoom,
  onUpdateUser,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputRoom, setInputRoom] = useState(roomId || '');
  const [userName, setUserName] = useState(currentUser.name);
  const [selectedColor, setSelectedColor] = useState(currentUser.color);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const shareableLink = roomId ? `${currentUrl}?lista=${roomId}` : '';

  const handleCopyLink = async () => {
    if (!shareableLink) return;
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleCreateOrJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRoom.trim()) return;
    onUpdateUser(userName, selectedColor);
    onJoinRoom(inputRoom.trim());
  };

  const handleGenerateRandomRoom = () => {
    const randomCode = `super-${Math.random().toString(36).substring(2, 6)}`;
    setInputRoom(randomCode);
    onUpdateUser(userName, selectedColor);
    onJoinRoom(randomCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Lista Compartida en Tiempo Real
              </h3>
              <p className="text-xs text-slate-500">
                Editá la lista simultáneamente con tu familia o amigos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* User profile identifier */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
            <label className="block text-xs font-bold text-slate-700">
              Tu nombre para indicar quién hace los cambios:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tu nombre (ej: Juan, Mamá)"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  onUpdateUser(e.target.value, selectedColor);
                }}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
              />
              {/* Color selector */}
              <div className="flex items-center gap-1">
                {COLOR_OPTIONS.slice(0, 5).map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      setSelectedColor(col);
                      onUpdateUser(userName, col);
                    }}
                    className={`h-5 w-5 rounded-full transition ${
                      selectedColor === col ? 'ring-2 ring-slate-800 ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Active Room View */}
          {roomId ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-950">
                      Sala conectada: <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900 font-mono">{roomId}</code>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onLeaveRoom();
                      setInputRoom('');
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-md transition"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Desconectar</span>
                  </button>
                </div>

                {/* Share Link input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Enlace para compartir (copialo y envialo por WhatsApp):
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={shareableLink}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono text-slate-700 select-all"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                {/* Active Connected Users */}
                <div className="pt-2 border-t border-emerald-100">
                  <div className="flex items-center justify-between text-xs text-emerald-900 mb-1.5">
                    <span className="font-semibold">Personas en esta lista:</span>
                    <span className="text-[11px] opacity-75">{activeUsers.length} en línea</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeUsers.map((u, i) => (
                      <span
                        key={u.id || i}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs border border-emerald-200"
                      >
                        <span 
                          className="h-2 w-2 rounded-full" 
                          style={{ backgroundColor: u.color || '#059669' }} 
                        />
                        <span>{u.name}</span>
                        {u.id === currentUser.id && (
                          <span className="text-[10px] text-slate-400">(Vos)</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 space-y-1">
                <p>• Los artículos que agregues o marques en el carrito se sincronizan al instante en todos los dispositivos.</p>
                <p>• Al lado de cada producto podés ver quién lo modificó por última vez.</p>
              </div>
            </div>
          ) : (
            /* Join or Create Room form */
            <form onSubmit={handleCreateOrJoin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre o código de la lista compartida:
                </label>
                <input
                  type="text"
                  placeholder="Ej: familia-gomez, asado-domingo, casa"
                  value={inputRoom}
                  onChange={(e) => setInputRoom(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!inputRoom.trim()}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  Unirse a esta sala
                </button>
                <button
                  type="button"
                  onClick={handleGenerateRandomRoom}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1"
                  title="Crear una sala con código nuevo"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Crear nueva</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Cualquier persona que entre con el mismo código compartirá y editará la misma lista en vivo.
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 hover:bg-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
