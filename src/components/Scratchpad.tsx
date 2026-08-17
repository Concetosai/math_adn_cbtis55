import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, 
  Eraser, 
  Trash2, 
  X, 
  Minimize2, 
  Maximize2, 
  RotateCcw,
  Palette
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [color, setColor] = useState<string>('#22d3ee'); // cyan neon
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isMinimized, setIsMinimized] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize canvas to match display size
    const ctx = canvas.getContext('2d');
    if (ctx && canvas.width !== canvas.offsetWidth) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Fill subtle dark grid
      drawGrid(ctx, canvas.width, canvas.height);
      saveState();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
    ctx.lineWidth = 1;
    const gridSize = 24;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), imgData]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    soundEngine.playClick();
    const newHist = [...history];
    newHist.pop(); // current state
    const previous = newHist[newHist.length - 1];
    if (previous) {
      ctx.putImageData(previous, 0, 0);
      setHistory(newHist);
    }
  };

  const clearCanvas = () => {
    soundEngine.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGrid(ctx, canvas.width, canvas.height);
    saveState();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tool === 'eraser' ? 24 : lineWidth;
    ctx.strokeStyle = tool === 'eraser' ? '#090d16' : color;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed z-50 transition-all duration-200 ${
        isMinimized 
          ? 'bottom-4 right-4 w-72 h-14' 
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[480px] h-[380px] sm:h-[450px]'
      }`}
    >
      <div className="w-full h-full flex flex-col rounded-[28px] overflow-hidden glass deep-shadow border border-white/90 shadow-2xl">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/90 border-b border-slate-200 select-none">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Pizarra de Cálculo ADN
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsMinimized(!isMinimized);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title={isMinimized ? 'Expandir Pizarra' : 'Minimizar Pizarra'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Cerrar Pizarra"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-1.5">
                {/* Pencil */}
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setTool('pencil');
                  }}
                  className={`p-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer ${
                    tool === 'pencil' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                  title="Lápiz de cálculo"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Eraser */}
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setTool('eraser');
                  }}
                  className={`p-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer ${
                    tool === 'eraser' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                  title="Borrador"
                >
                  <Eraser className="w-3.5 h-3.5" />
                </button>

                {/* Color swatches */}
                {tool === 'pencil' && (
                  <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-slate-300">
                    {[
                      { hex: '#00f2ff', name: 'Aqua ADN' },
                      { hex: '#f59e0b', name: 'Amarillo' },
                      { hex: '#f43f5e', name: 'Rosa' },
                      { hex: '#ffffff', name: 'Blanco' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => {
                          soundEngine.playClick();
                          setColor(c.hex);
                        }}
                        className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                          color === c.hex ? 'scale-125 ring-2 ring-cyan-500 ring-offset-1 ring-offset-white shadow-sm' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Action tools */}
              <div className="flex items-center gap-1">
                <button
                  onClick={undo}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Deshacer trazo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={clearCanvas}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer font-bold"
                  title="Limpiar toda la pizarra"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Limpiar</span>
                </button>
              </div>
            </div>

            {/* Drawing Canvas */}
            <div className="relative flex-1 w-full bg-slate-950 touch-none cursor-crosshair">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <div className="absolute bottom-2 right-2 pointer-events-none text-[10px] text-cyan-400/60 select-none font-bold">
                Área de cálculo libre
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
