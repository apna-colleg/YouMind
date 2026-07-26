import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as notesService from '../services/notesService';

export default function GraphView() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const simulationRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const loadGraph = async () => {
      try {
        setLoading(true);
        const { nodes, links } = await notesService.fetchAllLinks(user.id);
        renderGraph(nodes, links);
      } catch (err) {
        console.error('Failed to load graph data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGraph();

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [user]);

  const renderGraph = (nodes, links) => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id((d) => d.id)
        .source((d) => d.source_note_id)
        .target((d) => d.target_note_id)
        .distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    simulationRef.current = simulation;

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', 'var(--color-graph-edge)')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.4);

    // Nodes group
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    // Node circles — size based on connections
    node.append('circle')
      .attr('r', (d) => Math.max(6, Math.min(18, 6 + d.connections * 3)))
      .attr('fill', 'var(--color-graph-node)')
      .attr('stroke', 'rgba(217, 119, 6, 0.3)')
      .attr('stroke-width', 2);

    // Node glow
    node.append('circle')
      .attr('r', (d) => Math.max(6, Math.min(18, 6 + d.connections * 3)) + 6)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(217, 119, 6, 0.1)')
      .attr('stroke-width', 4);

    // Node labels
    node.append('text')
      .attr('dy', (d) => Math.max(6, Math.min(18, 6 + d.connections * 3)) + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--color-text-secondary)')
      .attr('font-size', '11px')
      .attr('font-family', 'var(--font-sans)')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')
      .text((d) => {
        const title = d.title || 'Untitled';
        return title.length > 18 ? title.slice(0, 16) + '…' : title;
      });

    // Hover interactions
    node
      .on('mouseover', function (event, d) {
        // Highlight connected nodes and links
        const connectedIds = new Set();
        links.forEach((l) => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source_note_id;
          const targetId = typeof l.target === 'object' ? l.target.id : l.target_note_id;
          if (sourceId === d.id) connectedIds.add(targetId);
          if (targetId === d.id) connectedIds.add(sourceId);
        });

        node.select('circle:first-child')
          .attr('fill', (n) =>
            n.id === d.id || connectedIds.has(n.id)
              ? 'var(--color-graph-node-hover)'
              : 'var(--color-graph-node)'
          )
          .attr('stroke-width', (n) =>
            n.id === d.id ? 3 : 2
          );

        link
          .attr('stroke-opacity', (l) => {
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source_note_id;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target_note_id;
            return sourceId === d.id || targetId === d.id ? 0.8 : 0.15;
          })
          .attr('stroke', (l) => {
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source_note_id;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target_note_id;
            return sourceId === d.id || targetId === d.id
              ? 'var(--color-graph-edge-hover)'
              : 'var(--color-graph-edge)';
          });
      })
      .on('mouseout', function () {
        node.select('circle:first-child')
          .attr('fill', 'var(--color-graph-node)')
          .attr('stroke-width', 2);

        link
          .attr('stroke-opacity', 0.4)
          .attr('stroke', 'var(--color-graph-edge)');
      })
      .on('click', function (event, d) {
        navigate(`/note/${d.id}`);
      });

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Drag handlers
    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Zoom controls
    window.__graphZoom = {
      zoomIn: () => svg.transition().duration(300).call(zoom.scaleBy, 1.4),
      zoomOut: () => svg.transition().duration(300).call(zoom.scaleBy, 0.7),
      reset: () => svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity),
    };
  };

  return (
    <div className="graph-view" ref={containerRef}>
      {/* Back button */}
      <button className="graph-back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        Back to notes
      </button>

      {/* Graph SVG */}
      <svg ref={svgRef} />

      {/* Zoom controls */}
      <div className="graph-controls">
        <button
          className="btn-icon"
          onClick={() => window.__graphZoom?.zoomIn()}
          title="Zoom in"
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
          }}
        >
          <ZoomIn size={16} />
        </button>
        <button
          className="btn-icon"
          onClick={() => window.__graphZoom?.zoomOut()}
          title="Zoom out"
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
          }}
        >
          <ZoomOut size={16} />
        </button>
        <button
          className="btn-icon"
          onClick={() => window.__graphZoom?.reset()}
          title="Reset zoom"
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg-primary)',
          }}
        >
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Loading graph...
          </div>
        </div>
      )}
    </div>
  );
}
