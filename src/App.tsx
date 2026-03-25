import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Globe, 
  Layers, 
  Shield, 
  Zap, 
  Terminal,
  Box
} from 'lucide-react';

import { Conduit } from './components/Conduit';
import { MeshMap } from './components/MeshMap';
import { Auditor } from './components/Auditor';
import { Weaver } from './components/Weaver';
import { GhostView } from './components/GhostView';
import { ConfigModal } from './components/ConfigModal';
import { Peer, GameRequirements, Bid } from './types';

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [activeGame, setActiveGame] = useState<GameRequirements | null>(null);
  const [weaverStatus, setWeaverStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [weaverLogs, setWeaverLogs] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [playMode, setPlayMode] = useState<'manual' | 'agent'>('manual');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<string>('IDLE');

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('mesh:update', (updatedPeers: Peer[]) => {
      setPeers(updatedPeers);
    });

    newSocket.on('resource:bid_received', (bid: Bid) => {
      setBids(prev => [...prev, bid]);
      addLog(`[AUDITOR] Received bid from NODE_${bid.peerId.slice(0, 6)}: ${bid.latency}ms, ${bid.gpu}`);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const addLog = (msg: string) => {
    setWeaverLogs(prev => [msg, ...prev].slice(0, 50));
  };

  const handleGameDetected = (game: GameRequirements) => {
    setActiveGame(game);
    setBids([]);
    setSelectedBid(null);
    setIsStreaming(false);
    setWeaverStatus('idle');
    setPipelineStatus('RANKING NODES...');
    addLog(`[CONDUIT] Host detected: ${game.name}.`);
    addLog(`[MESH_SEO] Crawling local mesh for optimal hardware for ${game.url || 'local asset'}...`);
    
    socket?.emit('resource:request', {
      gameId: game.id,
      requirements: { vram: game.vram, url: game.url }
    });

    // Simulate other peers bidding
    setTimeout(() => {
      const mockBids: Bid[] = [
        { peerId: 'peer-1', latency: 12, gpu: 'RTX 4090', trustScore: '0.98', price: 0.0012, velocityScore: 164 },
        { peerId: 'peer-2', latency: 18, gpu: 'RTX 3080', trustScore: '0.95', price: 0.0008, velocityScore: 17 },
        { peerId: 'peer-3', latency: 25, gpu: 'RX 7900 XTX', trustScore: '0.99', price: 0.0015, velocityScore: 59 },
      ];
      mockBids.forEach((b, i) => {
        setTimeout(() => {
          setBids(prev => [...prev, b]);
          addLog(`[AUDITOR] Verified bid from NODE_${b.peerId.slice(0, 6)} - Velocity Score: ${b.velocityScore}`);
        }, i * 400);
      });
    }, 1000);
  };

  const handleSelectBid = (bid: Bid) => {
    setSelectedBid(bid);
    setWeaverStatus('connecting');
    setPipelineStatus('HIJACKING RESOURCES...');
    addLog(`[WEAVER] Initializing P2P handshake with NODE_${bid.peerId.slice(0, 6)}...`);
    
    // Simulate connection flow
    setTimeout(() => {
      addLog(`[ASSET_SHREDDER] Parallel-loading textures from local NVMe...`);
      setPipelineStatus('LIQUEFYING MEMORY...');
    }, 800);
    setTimeout(() => addLog(`[SHADER_SMITH] Compiling shaders for ${bid.gpu}...`), 1500);
    setTimeout(() => addLog(`[SANDBOX_GUARDIAN] Hijacking DOM and intercepting WebGL context...`), 2200);
    setTimeout(() => {
      setWeaverStatus('connected');
      addLog(`[SANDBOX_GUARDIAN] Redirection complete. Drawing to Virtual Framebuffer.`);
    }, 2800);
    setTimeout(() => {
      addLog(`[GHOST_INPUT] Predictive velocity tracking engaged. Negative latency active.`);
      addLog(`[MEMORY_SWAPPER] Infinite VRAM pool ready.`);
      setIsStreaming(true);
      setPipelineStatus('LINK ACTIVE (0ms Latency reached)');
    }, 3500);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0b] text-white font-sans overflow-hidden">
      {/* Left Sidebar: Mesh & Stats */}
      <div className="w-80 flex flex-col border-r border-white/10 bg-black/20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.3)]">
              <Layers className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold tracking-tighter text-xl">A2A HOST LINK</h1>
              <div className="flex items-center gap-2 text-[10px] font-mono text-green-500">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                GLOBAL MESH ACTIVE
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="text-[10px] font-mono opacity-40 mb-1">NODES</div>
              <div className="text-xl font-bold font-mono">{peers.length + 12}</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="text-[10px] font-mono opacity-40 mb-1">AVG PING</div>
              <div className="text-xl font-bold font-mono text-green-500">14ms</div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <MeshMap peers={peers} activePeerId={selectedBid?.peerId} />
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-mono opacity-50">
              <span>ACTIVE AGENTS</span>
              <Terminal className="w-3 h-3" />
            </div>
            <div className="space-y-2">
              {[
                { name: 'CONDUIT', status: 'READY', color: 'text-green-500' },
                { name: 'MESH_SEO', status: activeGame && !selectedBid ? 'RANKING' : 'STANDBY', color: 'text-blue-500' },
                { name: 'ASSET_SHREDDER', status: weaverStatus === 'connecting' ? 'SHREDDING' : 'STANDBY', color: 'text-yellow-500' },
                { name: 'SHADER_SMITH', status: weaverStatus === 'connecting' ? 'COMPILING' : 'STANDBY', color: 'text-orange-500' },
                { name: 'AUDITOR', status: bids.length > 0 && !selectedBid ? 'VERIFYING' : 'STANDBY', color: 'text-yellow-500' },
                { name: 'WEAVER', status: weaverStatus === 'connected' ? 'STABLE' : weaverStatus === 'connecting' ? 'CONNECTING' : 'IDLE', color: 'text-purple-500' },
                { name: 'SANDBOX_GUARDIAN', status: isStreaming ? 'HIJACKED' : 'STANDBY', color: 'text-red-500' },
                { name: 'GHOST_INPUT', status: isStreaming ? 'PREDICTING' : 'STANDBY', color: 'text-fuchsia-500' },
                { name: 'MEMORY_SWAPPER', status: isStreaming ? 'POOLING' : 'STANDBY', color: 'text-cyan-500' },
              ].map(agent => (
                <div key={agent.name} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                  <span className="text-[10px] font-mono font-bold">{agent.name}</span>
                  <span className={`text-[9px] font-mono ${agent.color}`}>{agent.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="scanline pointer-events-none" />
        
        <Conduit onGameDetected={handleGameDetected} />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <GhostView 
              isActive={isStreaming} 
              gameName={activeGame?.name} 
              gameUrl={activeGame?.url}
              playMode={playMode}
              onTogglePlayMode={() => setPlayMode(p => p === 'manual' ? 'agent' : 'manual')}
            />
            <Weaver status={weaverStatus} logs={weaverLogs} />
          </div>

          <div className="w-80">
            <Auditor 
              bids={bids} 
              onSelect={handleSelectBid} 
              selectedBidId={selectedBid?.peerId} 
            />
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="h-8 bg-black border-t border-white/10 flex items-center justify-between px-4 text-[9px] font-mono opacity-40">
          <div className="flex items-center gap-4">
            <span className="text-green-500 font-bold animate-pulse">{pipelineStatus}</span>
            <span className="opacity-40">|</span>
            <span>SESSION: {Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
            <span>ENCRYPTION: AES-256-GCM</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsConfigOpen(true)}
              className="hover:text-white transition-colors underline decoration-white/30 underline-offset-2"
            >
              VIEW MESH CONFIG
            </button>
            <span className="opacity-40">|</span>
            <span>UP: 1.2 GB/s</span>
            <span>DOWN: 4.8 GB/s</span>
            <span className="text-green-500">● SYSTEM NOMINAL</span>
          </div>
        </div>
      </div>
      
      <ConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </div>
  );
}
