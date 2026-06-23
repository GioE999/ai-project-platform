"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { KnowledgeGraph as GraphData, GraphNode, GraphEdge } from "@/types/notes";

interface KnowledgeGraphProps {
  data: GraphData;
  onNodeClick?: (nodeId: string) => void;
}

export function KnowledgeGraph({ data, onNodeClick }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight || 500;

    const g = svg.append("g");

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);

    // Force simulation
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(data.edges).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Edges
    const link = g.selectAll("line")
      .data(data.edges)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", (d: GraphEdge) => d.type === "association" ? "4 4" : "none");

    // Nodes
    const nodeColors: Record<string, string> = {
      note: "#6366f1",
      task: "#10b981",
      project: "#f59e0b",
      meeting: "#ef4444",
    };

    const node = g.selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", (d: GraphNode) => nodeColors[d.type] || "#6366f1")
      .attr("cursor", "pointer")
      .on("click", (_, d: GraphNode) => onNodeClick?.(d.id));

    // Labels
    const label = g.selectAll("text")
      .data(data.nodes)
      .join("text")
      .text((d: GraphNode) => d.label)
      .attr("font-size", "10px")
      .attr("dx", 12)
      .attr("dy", 4)
      .attr("fill", "currentColor");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    return () => { simulation.stop(); };
  }, [data, onNodeClick]);

  return (
    <div className="h-[500px] w-full rounded-lg border">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  );
}
