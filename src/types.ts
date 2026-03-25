export interface Peer {
  id: string;
  latency: number;
  gpu: string;
  vram: number;
  trustScore: string;
  status: 'idle' | 'busy';
  location: { x: number; y: number };
}

export interface GameRequirements {
  id: string;
  name: string;
  vulkan: string;
  vram: number;
  url: string;
}

export interface Bid {
  peerId: string;
  latency: number;
  gpu: string;
  trustScore: string;
  price: number;
  velocityScore: number;
}
