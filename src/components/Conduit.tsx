import React, { useState } from 'react';
import { Search, Link as LinkIcon, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface ConduitProps {
  onGameDetected: (game: any) => void;
}

export const Conduit: React.FC<ConduitProps> = ({ onGameDetected }) => {
  const [url, setUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = () => {
    if (!url) return;
    setIsParsing(true);
    
    // Agent parsing logic for any host link
    setTimeout(() => {
      const isUrl = url.includes('.') || url.startsWith('http');
      const mockGame = {
        id: url.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
        name: isUrl ? url.split('/')[0].replace('www.', '').toUpperCase() : 'CYBER_TARGET_01',
        url: isUrl ? (url.startsWith('http') ? url : `https://${url}`) : url,
        vram: 8 + Math.floor(Math.random() * 8),
        icon: `https://picsum.photos/seed/${url}/100/100`
      };
      onGameDetected(mockGame);
      setIsParsing(false);
    }, 1500);
  };

  return (
    <div className="p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <h2 className="text-xs font-mono uppercase tracking-widest opacity-50">The Conduit // Client Agent</h2>
      </div>
      
      <div className="relative group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="DROP HOST LINK (e.g. bingoplus.com/game...)"
          className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-12 font-mono text-sm focus:outline-none focus:border-green-500/50 transition-all"
        />
        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:opacity-100 transition-opacity" />
        
        <button
          onClick={handleParse}
          disabled={isParsing}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-black px-4 py-2 rounded font-bold text-xs flex items-center gap-2 hover:bg-green-400 disabled:opacity-50 transition-colors"
        >
          {isParsing ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Zap className="w-3 h-3" />
              INITIALIZE
            </>
          )}
        </button>
      </div>

      {isParsing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-mono text-[10px] text-green-500/70"
        >
          [A2A_CONDUIT] Parsing host link... Extracting Manifest... Generating Session Token...
        </motion.div>
      )}
    </div>
  );
};
