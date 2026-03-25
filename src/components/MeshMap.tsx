import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Peer } from '../types';

interface MeshMapProps {
  peers: Peer[];
  activePeerId?: string;
}

export const MeshMap: React.FC<MeshMapProps> = ({ peers, activePeerId }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Draw grid lines
    const gridStep = 40;
    for (let x = 0; x <= width; x += gridStep) {
      svg.append("line")
        .attr("x1", x).attr("y1", 0)
        .attr("x2", x).attr("y2", height)
        .attr("stroke", "rgba(255,255,255,0.05)");
    }
    for (let y = 0; y <= height; y += gridStep) {
      svg.append("line")
        .attr("x1", 0).attr("y1", y)
        .attr("x2", width).attr("y2", y)
        .attr("stroke", "rgba(255,255,255,0.05)");
    }

    // Draw connections
    peers.forEach((p, i) => {
      peers.slice(i + 1).forEach(p2 => {
        const dist = Math.sqrt(Math.pow(p.location.x - p2.location.x, 2) + Math.pow(p.location.y - p2.location.y, 2));
        if (dist < 40) {
          svg.append("line")
            .attr("x1", p.location.x * width / 100)
            .attr("y1", p.location.y * height / 100)
            .attr("x2", p2.location.x * width / 100)
            .attr("y2", p2.location.y * height / 100)
            .attr("stroke", "rgba(0, 255, 65, 0.1)")
            .attr("stroke-width", 1);
        }
      });
    });

    // Draw nodes
    const nodes = svg.selectAll(".node")
      .data(peers)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: Peer) => `translate(${d.location.x * width / 100}, ${d.location.y * height / 100})`);

    nodes.append("circle")
      .attr("r", (d: Peer) => d.id === activePeerId ? 6 : 4)
      .attr("fill", (d: Peer) => d.id === activePeerId ? "#00ff41" : "rgba(255,255,255,0.3)")
      .attr("filter", (d: Peer) => d.id === activePeerId ? "drop-shadow(0 0 8px #00ff41)" : "none");

    nodes.append("text")
      .attr("dy", 15)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.5)")
      .attr("font-size", "8px")
      .attr("font-family", "monospace")
      .text((d: Peer) => d.id.slice(0, 4));

  }, [peers, activePeerId]);

  return (
    <div className="relative w-full h-full bg-black/20 overflow-hidden border border-white/5 rounded-lg">
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <h2 className="text-[10px] font-mono uppercase tracking-widest opacity-50">The Scout // Discovery Agent</h2>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
