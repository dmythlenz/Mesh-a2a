import React from 'react';
import { Shield, Cpu, Activity, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Bid } from '../types';

interface AuditorProps {
  bids: Bid[];
  onSelect: (bid: Bid) => void;
  selectedBidId?: string;
}

export const Auditor: React.FC<AuditorProps> = ({ bids, onSelect, selectedBidId }) => {
  return (
    <div className="flex flex-col h-full bg-black/40 border-l border-white/10 backdrop-blur-md">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-3 h-3 text-yellow-500" />
          <h2 className="text-[10px] font-mono uppercase tracking-widest opacity-50">The Auditor // SLA Agent</h2>
        </div>
        <p className="text-[9px] font-mono opacity-30">Verifying Proof of Compute & Trust Scores...</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {bids.map((bid) => (
            <motion.div
              key={bid.peerId}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onClick={() => onSelect(bid)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedBidId === bid.peerId 
                  ? 'bg-green-500/10 border-green-500/50' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-mono text-[10px] font-bold">NODE_{bid.peerId.slice(0, 6)}</div>
                <div className="text-[10px] font-mono text-green-500">{bid.latency}ms</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1 opacity-60">
                  <Cpu className="w-2 h-2" />
                  <span className="text-[8px] font-mono">{bid.gpu}</span>
                </div>
                <div className="flex items-center gap-1 opacity-60">
                  <Activity className="w-2 h-2" />
                  <span className="text-[8px] font-mono">TRUST: {bid.trustScore}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 bg-black/40 p-1.5 rounded border border-white/5">
                <span className="text-[8px] font-mono opacity-60">VELOCITY SCORE</span>
                <span className="text-[10px] font-mono font-bold text-fuchsia-400">{bid.velocityScore} V_s</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-[10px] font-mono font-bold text-white/80">
                  ${bid.price.toFixed(4)}<span className="text-[8px] opacity-40">/hr</span>
                </div>
                {selectedBidId === bid.peerId && (
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {bids.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-2">
            <div className="w-8 h-8 border border-dashed border-white rounded-full animate-spin" />
            <span className="text-[10px] font-mono">AWAITING BIDS...</span>
          </div>
        )}
      </div>
    </div>
  );
};
