import React, { useState } from 'react';
import { 
  Laptop, 
  X, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  FileCode2, 
  ShieldCheck, 
  Monitor,
  Terminal,
  Zap,
  FolderArchive,
  Check,
  PackageCheck
} from 'lucide-react';
import { 
  downloadWindowsBatchInstaller, 
  downloadWindowsVbsLauncher, 
  downloadWindowsUrlShortcut 
} from '../utils/windowsInstaller';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onInstall: () => Promise<boolean>;
}

export const WindowsInstallModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isInstallable,
  onInstall,
}) => {
  const [activeTab, setActiveTab] = useState<'exe' | 'app' | 'installer'>('exe');
  const [downloadedBatch, setDownloadedBatch] = useState(false);
  const [downloadedVbs, setDownloadedVbs] = useState(false);
  const [downloadedUrl, setDownloadedUrl] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleDownloadBatch = () => {
    downloadWindowsBatchInstaller(currentUrl);
    setDownloadedBatch(true);
    setTimeout(() => setDownloadedBatch(false), 4000);
  };

  const handleDownloadVbs = () => {
    downloadWindowsVbsLauncher(currentUrl);
    setDownloadedVbs(true);
    setTimeout(() => setDownloadedVbs(false), 4000);
  };

  const handleDownloadUrl = () => {
    downloadWindowsUrlShortcut(currentUrl);
    setDownloadedUrl(true);
    setTimeout(() => setDownloadedUrl(false), 4000);
  };

  const handleDownloadExeZip = () => {
    setDownloadingZip(true);
    const link = document.createElement('a');
    link.href = `/api/download/windows-exe?v=${Date.now()}`;
    link.download = 'SuperLista-Windows-x64.zip';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingZip(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs shadow-inner">
                <Laptop className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Aplicación de Escritorio para Windows (.exe)</h3>
                <p className="text-xs text-emerald-100">
                  Descargá el ejecutable nativo compilado con Electron o instalá con un clic
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('exe')}
            className={`pb-3 text-xs font-bold transition border-b-2 mr-5 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'exe'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderArchive className="h-4 w-4" />
            <span>Descargar .EXE (Electron)</span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800 font-extrabold">Nuevo</span>
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`pb-3 text-xs font-bold transition border-b-2 mr-5 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'app'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>Instalación PWA (Sin descargas)</span>
          </button>
          <button
            onClick={() => setActiveTab('installer')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'installer'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode2 className="h-4 w-4" />
            <span>Lanzadores (.bat / .vbs)</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {activeTab === 'exe' && (
            <div className="space-y-4">
              {/* Featured Download Card */}
              <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-5 space-y-4 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                    <PackageCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-slate-900">
                        SuperLista para Windows (64-bit)
                      </h4>
                      <span className="rounded-md bg-emerald-200/90 text-emerald-950 font-mono text-[10px] font-bold px-2 py-0.5">
                        SuperLista.exe
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Paquete de aplicación independiente compilado con <strong>Electron</strong> para Windows 10 y Windows 11. Incluye el ejecutable nativo listo para usar.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleDownloadExeZip}
                    disabled={downloadingZip}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 active:scale-98 transition disabled:opacity-50"
                  >
                    <Download className="h-5 w-5" />
                    <span>{downloadingZip ? 'Iniciando descarga...' : 'Descargar SuperLista-Windows-x64.zip (50 MB)'}</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Formato .zip estándar optimizado, compatible con el descompresor nativo de Windows (contiene <strong>SuperLista.exe</strong>).
                  </p>
                </div>
              </div>

              {/* Instructions on how to use SuperLista.exe */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Instrucciones de uso en tu PC:
                </h5>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">
                        Descargá y descomprimí la carpeta
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Hacé clic derecho en el archivo <code>SuperLista-Windows-x64.zip</code> descargado y seleccioná <strong>"Extraer todo..."</strong>.
                      </p>
                      <p className="text-[11px] text-amber-800 bg-amber-50 rounded-lg p-2 mt-1.5 border border-amber-200">
                        <strong>Nota de seguridad de Windows:</strong> Si Windows bloquea la extracción por provenir de internet, hacé clic derecho en el zip &gt; <em>Propiedades</em> &gt; marcá la casilla <em>"Desbloquear"</em> al pie &gt; <em>Aceptar</em>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">
                        Ejecutá <code>SuperLista.exe</code>
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Hacé doble clic en <strong>SuperLista.exe</strong>. La aplicación abrirá inmediatamente en su propia ventana de escritorio.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">
                        Crear acceso directo en el Escritorio (Opcional)
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Hacé clic derecho en <code>SuperLista.exe</code> &gt; <em>Enviar a &gt; Escritorio (crear acceso directo)</em> o <em>Anclar a la barra de tareas</em>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'app' && (
            <div className="space-y-4">
              {/* Direct install prompt button if browser caught the prompt */}
              {isInstallable && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-950">
                        Instalación automática directa disponible
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Tu navegador permite instalar SuperLista como aplicación de Windows con un solo clic sin descargar archivos pesados.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      const success = await onInstall();
                      if (success) {
                        onClose();
                      }
                    }}
                    className="mt-3.5 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-98 transition"
                  >
                    <Download className="h-4 w-4" />
                    Instalar SuperLista en Windows Ahora
                  </button>
                </div>
              )}

              {/* Visual Guide for Chrome & Edge */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Cómo se instala en Windows 10 y Windows 11 desde el navegador:
                </h4>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">
                        Hacé clic en el ícono de instalación de la barra superior
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        En la barra de direcciones de tu navegador (arriba a la derecha), hacé clic en el ícono de pantalla: <strong>⊕</strong> o <strong>💻</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">
                        O abrí el Menú del navegador (⋮ en Chrome o ... en Edge)
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Seleccioná <strong>"Instalar SuperLista..."</strong> o <strong>"Aplicaciones" &gt; "Instalar este sitio como una aplicación"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">
                        Listo: acceso directo y ventana nativa
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Windows registrará el programa en el Menú Inicio y en el Escritorio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'installer' && (
            <div className="space-y-4">
              {/* Option A: Automated .bat installer */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Instalador Automatizado de Escritorio (.bat)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Crea automáticamente el acceso directo nativo <strong>"SuperLista - Supermercado"</strong> en tu pantalla de Windows configurado en modo ventana independiente sin barras de navegador.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadBatch}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-98 transition"
                >
                  <Download className="h-4 w-4" />
                  <span>{downloadedBatch ? '¡Instalador Descargado!' : 'Descargar Instalador (.bat)'}</span>
                </button>
              </div>

              {/* Option B: Silent VBS Launcher */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Lanzador Silencioso (.vbs)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Script para abrir con doble clic en ventana propia sin ventanas de terminal.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadVbs}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{downloadedVbs ? '¡Descargado!' : 'Descargar .vbs'}</span>
                </button>
              </div>

              {/* Option C: Direct .url Shortcut */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <FileCode2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Acceso Directo Rápido (.url)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Acceso directo listo para arrastrar al Escritorio.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadUrl}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{downloadedUrl ? '¡Descargado!' : 'Descargar .url'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Windows App Benefits */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Garantías de la versión de escritorio de Windows:</span>
            </h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ejecutable binario nativo <code>SuperLista.exe</code> para Windows.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Funciona sin conexión a internet y almacena tus listas en tu PC.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ventana aislada independiente sin barras de navegación.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Precios promedio 2026 de la Provincia de Buenos Aires incluidos.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Compatible con Windows 10 y Windows 11 (64-bit)
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 hover:bg-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
