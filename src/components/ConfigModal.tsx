import React from 'react';
import { X, FileJson, FileCode2, Download, TerminalSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sandboxGuardianJson = `{
  "name": "Sandbox Guardian",
  "version": "1.0.0",
  "description": "Orchestrates direct-to-metal link takeovers and WebGL redirection.",
  "url": "http://node-alpha.local:8080/agent",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true,
    "stateTransitionHistory": true
  },
  "authentication": {
    "schemes": ["bearer"]
  },
  "skills": [
    {
      "id": "link-hijack",
      "name": "Resource Redirection",
      "description": "Intercepts standard DOM and Fetch requests to route them through the Asset Shredder.",
      "inputModes": ["data"],
      "outputModes": ["data"]
    },
    {
      "id": "vram-bridge",
      "name": "Mesh VRAM Passthrough",
      "description": "Maps the local Mesh VRAM pool directly to a WebGL context for zero-latency rendering.",
      "inputModes": ["data"],
      "outputModes": ["audio", "video"]
    }
  ]
}`;

const meshConfigYaml = `version: "2026.1"
mesh_name: "Liquid-Mesh-Prime"
discovery_protocol: "a2a-v1"

nodes:
  - id: "alpha-renderer"
    address: "192.168.1.50"
    role: "Primary-GPU"
  - id: "beta-memory"
    address: "192.168.1.51"
    role: "VRAM-Pool"
  - id: "gamma-input"
    address: "192.168.1.52"
    role: "Predictive-Ghost"

pipeline_settings:
  predictive_buffer: 5ms
  max_mesh_latency: 2ms
  render_target: "4K@120Hz"
  security_mode: "mTLS-Signed"`;

const launchMeshBat = `@echo off
SETLOCAL EnableDelayedExpansion
title Liquid Mesh - One Click Start

echo [Step 1] Checking Dependencies...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.10+ to use Liquid Mesh.
    pause
    exit
)

echo [Step 2] Auto-Installing High-Speed Libraries...
pip install -r requirements.txt --quiet

echo [Step 3] SEO Agent: Mapping your Local "Massive RAM"...
python Agents\\seo_agent.py

echo [Step 4] Igniting Parallel Pipelines...
start /B python Agents\\ghost_input.py
start /B python Agents\\sandbox_guardian.py

echo [Step 5] Launching Zero-Lag Portal...
timeout /t 2 >nul
start chrome "%cd%\\UI\\index.html" --incognito --disable-gpu-vsync

echo.
echo ==========================================
echo LIQUID MESH IS LIVE
echo Hardware Pooled. Network Optimized.
echo ==========================================
pause`;

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-4xl bg-[#0a0a0b] border border-white/20 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
            <h2 className="text-sm font-bold font-mono tracking-widest flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-green-500" />
              SYSTEM CONFIGURATION
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
              <X className="w-5 h-5 opacity-50 hover:opacity-100" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mesh Config */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-50">
                <FileCode2 className="w-3 h-3 text-blue-400" />
                mesh-config.yaml
              </div>
              <div className="bg-black/50 p-4 rounded border border-white/10 overflow-x-auto">
                <pre className="text-[11px] font-mono text-blue-300 leading-relaxed">
                  {meshConfigYaml}
                </pre>
              </div>
              <p className="text-[10px] font-mono opacity-40">
                Master Mesh Config: Synchronizes the high-speed swarm across local nodes.
              </p>
            </div>

            {/* Sandbox Guardian Agent Card */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-50">
                <FileJson className="w-3 h-3 text-red-400" />
                .well-known/agent.json (Sandbox Guardian)
              </div>
              <div className="bg-black/50 p-4 rounded border border-white/10 overflow-x-auto">
                <pre className="text-[11px] font-mono text-red-300 leading-relaxed">
                  {sandboxGuardianJson}
                </pre>
              </div>
              <p className="text-[10px] font-mono opacity-40">
                Core "Link Takeover" Agent: Orchestrates direct-to-metal link takeovers and WebGL redirection.
              </p>
            </div>

            {/* One-Click Launcher */}
            <div className="space-y-3 md:col-span-2 mt-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-50">
                  <TerminalSquare className="w-3 h-3 text-green-400" />
                  Launch_Mesh.bat (Zero-Touch Bootstrapper)
                </div>
                <button 
                  onClick={() => alert('Launcher bundle downloaded to your local machine.')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded text-[10px] font-mono font-bold transition-colors"
                >
                  <Download className="w-3 h-3" />
                  DOWNLOAD BUNDLE
                </button>
              </div>
              <div className="bg-black/50 p-4 rounded border border-white/10 overflow-x-auto">
                <pre className="text-[11px] font-mono text-green-300 leading-relaxed">
                  {launchMeshBat}
                </pre>
              </div>
              <p className="text-[10px] font-mono opacity-40">
                The "One-Click" Master Launcher: Auto-installs dependencies, runs the SEO Agent to map local IPs, ignites parallel pipelines, and launches the portal.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
