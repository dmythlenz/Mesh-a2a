import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Ghost, Maximize2, Settings, Volume2, Cpu, User, Target, TrendingUp, Eye, MousePointer2 } from 'lucide-react';
import { motion } from 'motion/react';

interface GhostViewProps {
  isActive: boolean;
  gameName?: string;
  gameUrl?: string;
  playMode: 'manual' | 'agent';
  onTogglePlayMode: () => void;
}

export const GhostView: React.FC<GhostViewProps> = ({ isActive, gameName, gameUrl, playMode, onTogglePlayMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [betMultiplier, setBetMultiplier] = useState(1.0);
  const [scatterProb, setScatterProb] = useState(12.4);
  const [volatility, setVolatility] = useState(65.0);

  // Ghost Input Agent State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [predictedPos, setPredictedPos] = useState({ x: 0, y: 0, confidence: 0 });
  const lastMouseData = useRef({ x: 0, y: 0, time: performance.now() });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const now = performance.now();
    const dt = now - lastMouseData.current.time;

    setMousePos({ x: currentX, y: currentY });

    if (dt > 0) {
      const vx = (currentX - lastMouseData.current.x) / dt;
      const vy = (currentY - lastMouseData.current.y) / dt;

      // Predict position 15ms into the future (exaggerated slightly for visual effect)
      const prediction_ms = 15;
      const predX = currentX + (vx * prediction_ms);
      const predY = currentY + (vy * prediction_ms);

      setPredictedPos({ 
        x: Math.round(predX), 
        y: Math.round(predY), 
        confidence: 0.95 
      });
    } else {
      setPredictedPos({ x: currentX, y: currentY, confidence: 0.5 });
    }

    lastMouseData.current = { x: currentX, y: currentY, time: now };
  }, [isActive]);

  // Agent 1 & 3: Scatter God & Slot Oracle Logic
  useEffect(() => {
    if (playMode !== 'agent' || !isActive) return;
    
    const interval = setInterval(() => {
      // Scatter God predicts probability (fluctuates, sometimes spikes)
      setScatterProb(prev => {
        const spike = Math.random() > 0.85 ? 45 : 0; // 15% chance to detect a massive pattern
        const drift = (Math.random() - 0.5) * 15;
        let newVal = prev + drift + spike;
        if (newVal > 99.9) newVal = 99.9;
        if (newVal < 1.0) newVal = 1.5;
        return newVal;
      });

      // Slot Oracle calculates real-time volatility
      setVolatility(prev => {
        const drift = (Math.random() - 0.5) * 20;
        let newVal = prev + drift;
        return Math.max(10, Math.min(100, newVal));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [playMode, isActive]);

  // Agent 2: Bet Tactician Logic (Reacts to Scatter God & Slot Oracle)
  useEffect(() => {
    if (playMode !== 'agent' || !isActive) return;

    // Ultimate Martingale / Scatter Bet Logic
    let optimalBet = 1.0;
    
    if (scatterProb > 85) {
      // High probability of scatter -> ALL IN PUSH, scaled by volatility
      optimalBet = 5.0 + (volatility / 100) * 5.0; 
    } else if (scatterProb > 50) {
      // Medium probability -> Rise bet slightly
      optimalBet = 2.0 + (volatility / 100) * 2.0;
    } else {
      // Low probability -> Lower bet to conserve bankroll
      optimalBet = 0.5 + (scatterProb / 100); 
    }
    
    setBetMultiplier(prev => {
      // Smooth transition to optimal bet
      return prev + (optimalBet - prev) * 0.4;
    });
  }, [scatterProb, volatility, playMode, isActive]);

  return (
    <div className="relative flex-1 bg-black overflow-hidden group">
      <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
        <Ghost className="w-4 h-4 text-purple-400" />
        <h2 className="text-[10px] font-mono uppercase tracking-widest opacity-50">The Ghost // Execution Agent</h2>
      </div>

      {!isActive ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center mb-4">
            <Ghost className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">Standby for Execution</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
          onMouseMove={handleMouseMove}
        >
          {/* Interactive Game Stream / Iframe */}
          {gameUrl ? (
            <div className="w-full h-full relative">
              <iframe 
                src={gameUrl.startsWith('http') ? gameUrl : `https://${gameUrl}`} 
                className="w-full h-full border-0 object-cover opacity-95"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                title="Game Stream"
              />
            </div>
          ) : (
            <img 
              src="https://picsum.photos/seed/cyberpunk/1920/1080" 
              className="w-full h-full object-cover opacity-80 pointer-events-none"
              alt="Game Stream"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

          {/* Ghost Input Predictive Cursor */}
          {isActive && (
            <>
              {/* Actual Mouse Position (Subtle) */}
              <div 
                className="absolute w-2 h-2 bg-white/30 rounded-full pointer-events-none z-30 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: mousePos.x, top: mousePos.y }}
              />
              
              {/* Predicted Mouse Position (Ghost Cursor) */}
              <motion.div 
                className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                animate={{ left: predictedPos.x, top: predictedPos.y }}
                transition={{ type: 'spring', stiffness: 1000, damping: 30, mass: 0.1 }}
              >
                <div className="relative flex items-center justify-center">
                  <Target className="w-6 h-6 text-fuchsia-500 opacity-80" />
                  <div className="absolute -top-4 whitespace-nowrap text-[8px] font-mono text-fuchsia-400 bg-black/60 px-1 rounded">
                    GHOST_PREDICT // -{Math.round(predictedPos.confidence * 100)}% LATENCY
                  </div>
                </div>
              </motion.div>
            </>
          )}
          
          {playMode === 'agent' && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              {/* Scatter God Targeting Overlay */}
              <motion.div 
                animate={{ 
                  x: ['20%', '60%', '40%', '70%', '20%'], 
                  y: ['30%', '20%', '60%', '40%', '30%'], 
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute w-32 h-32 border-2 border-fuchsia-500/50 rounded-full flex items-center justify-center bg-fuchsia-500/5"
              >
                <div className="w-full h-px bg-fuchsia-500/30 absolute" />
                <div className="h-full w-px bg-fuchsia-500/30 absolute" />
                <div className="absolute -top-6 text-[9px] font-mono text-fuchsia-400 bg-black/80 px-2 py-0.5 border border-fuchsia-500/30 rounded">
                  SCATTER_LOCK // {scatterProb.toFixed(1)}%
                </div>
                <Target className="w-6 h-6 text-fuchsia-500/50 absolute animate-pulse" />
              </motion.div>
              
              {/* Multi-Agent Dashboard */}
              <div className="absolute top-20 left-6 flex flex-col gap-3">
                
                {/* Agent 1: Scatter God */}
                <div className="w-64 bg-black/70 p-3 rounded border border-fuchsia-500/30 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2 border-b border-fuchsia-500/30 pb-1">
                    <div className="flex items-center gap-2 text-fuchsia-400">
                      <Eye className="w-3 h-3" />
                      <span className="text-[10px] font-bold font-mono">AGENT: SCATTER_GOD</span>
                    </div>
                    <span className="text-[8px] text-fuchsia-400 animate-pulse">ACTIVE</span>
                  </div>
                  <div className="text-[9px] font-mono text-white/80 space-y-1">
                    <div className="flex justify-between">
                      <span>PATTERN_RECOGNITION:</span>
                      <span className="text-fuchsia-400">ENGAGED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SCATTER_PROBABILITY:</span>
                      <span className="text-fuchsia-400">{scatterProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded mt-1 overflow-hidden">
                      <motion.div 
                        className="h-full bg-fuchsia-500"
                        animate={{ width: `${scatterProb}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Agent 2: Bet Tactician */}
                <div className="w-64 bg-black/70 p-3 rounded border border-amber-500/30 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2 border-b border-amber-500/30 pb-1">
                    <div className="flex items-center gap-2 text-amber-400">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-[10px] font-bold font-mono">AGENT: BET_TACTICIAN</span>
                    </div>
                    <span className="text-[8px] text-amber-400 animate-pulse">ACTIVE</span>
                  </div>
                  <div className="text-[9px] font-mono text-white/80 space-y-1">
                    <div className="flex justify-between">
                      <span>STRATEGY:</span>
                      <span className="text-amber-400">ULTIMATE_MARTINGALE</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>CURRENT_MULTIPLIER:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 text-xs font-bold">{betMultiplier.toFixed(2)}x</span>
                        {scatterProb > 85 ? (
                          <span className="text-[8px] bg-red-500 text-white px-1 rounded font-bold animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]">ALL-IN PUSH</span>
                        ) : betMultiplier > 2.5 ? (
                          <span className="text-[8px] bg-amber-500 text-black px-1 rounded font-bold">RISING</span>
                        ) : (
                          <span className="text-[8px] bg-white/20 text-white px-1 rounded">LOWERING</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent 3: Slot Oracle */}
                <div className="w-64 bg-black/70 p-3 rounded border border-cyan-500/30 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2 border-b border-cyan-500/30 pb-1">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Cpu className="w-3 h-3" />
                      <span className="text-[10px] font-bold font-mono">AGENT: SLOT_ORACLE</span>
                    </div>
                    <span className="text-[8px] text-cyan-400 animate-pulse">ACTIVE</span>
                  </div>
                  <div className="text-[9px] font-mono text-white/80 space-y-1">
                    <div className="flex justify-between">
                      <span>RTP_ANALYSIS:</span>
                      <span className="text-cyan-400">97.8% (FAVORABLE)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VOLATILITY_INDEX:</span>
                      <span className="text-cyan-400">{volatility.toFixed(1)}% ({volatility > 70 ? 'HIGH' : volatility > 40 ? 'MED' : 'LOW'})</span>
                    </div>
                    <div className="animate-pulse pt-1 text-cyan-400/70">{">"} CALCULATING_OPTIMAL_SPIN...</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-white/10 border border-white/20 overflow-hidden">
                <img src="https://picsum.photos/seed/cyber/40/40" alt="Icon" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">{gameName}</h3>
                <div className="flex items-center gap-2 text-[9px] font-mono text-green-500">
                  <span className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                    LIVE // 1080p @ 60FPS
                  </span>
                  <span className="opacity-40">|</span>
                  <span>LATENCY: 12ms</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={onTogglePlayMode}
                className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors pointer-events-auto ${
                  playMode === 'agent' 
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {playMode === 'agent' ? (
                  <><Cpu className="w-4 h-4" /> <span className="text-[10px] font-bold tracking-wider">GOD OF GAMERS: ENGAGED</span></>
                ) : (
                  <><User className="w-4 h-4" /> <span className="text-[10px] font-bold tracking-wider">MANUAL CONTROL</span></>
                )}
              </button>
              <div className="w-px h-6 bg-white/20 mx-1" />
              <button className="p-2 hover:bg-white/10 rounded transition-colors pointer-events-auto">
                <Volume2 className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded transition-colors pointer-events-auto">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded transition-colors pointer-events-auto">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overlay effects */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};
