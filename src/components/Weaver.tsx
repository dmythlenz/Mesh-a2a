import React, { useEffect, useState } from 'react';
import { Network, ShieldCheck, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

interface WeaverProps {
  status: 'idle' | 'connecting' | 'connected' | 'error';
  logs: string[];
}

export const Weaver: React.FC<WeaverProps> = ({ status, logs }) => {
  return (
    <div className="p-4 bg-black/60 border-t border-white/10 font-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-3 h-3 text-blue-400" />
          <h2 className="text-[10px] uppercase tracking-widest opacity-50">The Weaver // Networking Agent</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${
            status === 'connected' ? 'bg-green-500' : 
            status === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
            'bg-red-500'
          }`} />
          <span className="text-[9px] uppercase">{status}</span>
        </div>
      </div>

      <div className="h-24 overflow-y-auto bg-black/40 rounded p-2 border border-white/5 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="text-[9px] flex gap-2">
            <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
            <span className={log.includes('SUCCESS') ? 'text-green-400' : log.includes('ERROR') ? 'text-red-400' : 'text-white/60'}>
              {log}
            </span>
          </div>
        ))}
        {status === 'connecting' && (
          <div className="text-[9px] text-yellow-400 animate-pulse">
            {">"} PERFORMING NAT-HOLE PUNCHING...
          </div>
        )}
      </div>
    </div>
  );
};
