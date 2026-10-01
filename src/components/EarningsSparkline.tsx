import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface EarningsSparklineProps {
  currentPlanId: string;
  signingFee: number;
  retentionBonus: number;
  activeClients: number;
  isLight?: boolean;
}

interface DataPoint {
  clients: number;
  earnings: number;
  isCurrent: boolean;
}

export default function EarningsSparkline({
  currentPlanId,
  signingFee,
  retentionBonus,
  activeClients,
  isLight = false,
}: EarningsSparklineProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Generate curve points across client volumes (1 to 10)
    const points: DataPoint[] = [];
    const maxRange = Math.max(10, activeClients + 2);
    
    for (let c = 1; c <= maxRange; c++) {
      const upfront = signingFee * c;
      const retention = retentionBonus * c;
      const milestone = c >= 3 ? 1000 : 0;
      points.push({
        clients: c,
        earnings: upfront + retention + milestone,
        isCurrent: c === activeClients,
      });
    }

    const width = 140;
    const height = 52;
    const margin = { top: 6, right: 8, bottom: 6, left: 6 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Definitions for linear gradients and glow filter
    const defs = svg.append('defs');

    // Area Gradient
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', `sparkline-area-grad-${currentPlanId}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#f97316')
      .attr('stop-opacity', isLight ? 0.35 : 0.4);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f97316')
      .attr('stop-opacity', 0);

    // Glow filter
    const filter = defs.append('filter').attr('id', 'sparkline-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', 2).attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X and Y Scales
    const xScale = d3
      .scaleLinear()
      .domain([1, maxRange])
      .range([0, innerWidth]);

    const maxEarnings = d3.max(points, (d) => d.earnings) || 1000;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxEarnings * 1.05])
      .range([innerHeight, 0]);

    // Area generator
    const areaGenerator = d3
      .area<DataPoint>()
      .x((d) => xScale(d.clients))
      .y0(innerHeight)
      .y1((d) => yScale(d.earnings))
      .curve(d3.curveMonotoneX);

    // Line generator
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.clients))
      .y((d) => yScale(d.earnings))
      .curve(d3.curveMonotoneX);

    // Render Area Fill
    g.append('path')
      .datum(points)
      .attr('fill', `url(#sparkline-area-grad-${currentPlanId})`)
      .attr('d', areaGenerator);

    // Render Sparkline Path
    const path = g
      .append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke', isLight ? '#ea580c' : '#fb923c')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', lineGenerator);

    // Animate Line Drawing via stroke-dashoffset
    const totalLength = path.node()?.getTotalLength() || 150;
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(450)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Find the current active point
    const currentPoint = points.find((p) => p.clients === activeClients) || points[0];
    const cx = xScale(currentPoint.clients);
    const cy = yScale(currentPoint.earnings);

    // Pulsing outer halo on active node
    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 6)
      .attr('fill', '#f97316')
      .attr('opacity', 0.25)
      .attr('class', 'animate-ping')
      .style('animation-duration', '2.5s');

    // Outer ring on active node
    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 4.5)
      .attr('fill', isLight ? '#ffffff' : '#020617')
      .attr('stroke', isLight ? '#ea580c' : '#f97316')
      .attr('stroke-width', 2);

    // Solid center dot
    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 2)
      .attr('fill', isLight ? '#ea580c' : '#f97316');

    // Inflection marker for milestone ($1,000 bonus at 3 clients)
    if (maxRange >= 3) {
      const milestoneX = xScale(3);
      const milestonePt = points.find((p) => p.clients === 3);
      if (milestonePt) {
        const milestoneY = yScale(milestonePt.earnings);
        g.append('circle')
          .attr('cx', milestoneX)
          .attr('cy', milestoneY)
          .attr('r', 2)
          .attr('fill', '#10b981')
          .attr('stroke', isLight ? '#ffffff' : '#020617')
          .attr('stroke-width', 1)
          .attr('opacity', 0.9);
      }
    }

    // Interactive hover overlay across the sparkline
    const bisect = d3.bisector((d: DataPoint) => d.clients).center;
    const hoverGroup = g.append('g').style('display', 'none');

    const hoverLine = hoverGroup
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', isLight ? 'rgba(15,23,42,0.2)' : 'rgba(255,255,255,0.2)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 2');

    const hoverDot = hoverGroup
      .append('circle')
      .attr('r', 3.5)
      .attr('fill', '#f97316')
      .attr('stroke', isLight ? '#ffffff' : '#0f172a')
      .attr('stroke-width', 1.5);

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mouseenter', () => hoverGroup.style('display', null))
      .on('mouseleave', () => hoverGroup.style('display', 'none'))
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const adjustedX = mx - margin.left;
        const x0 = xScale.invert(adjustedX);
        const i = bisect(points, x0);
        const d = points[i];
        if (!d) return;

        const px = xScale(d.clients);
        const py = yScale(d.earnings);

        hoverLine.attr('x1', px).attr('x2', px);
        hoverDot.attr('cx', px).attr('cy', py);
      });
  }, [currentPlanId, signingFee, retentionBonus, activeClients, isLight]);

  return (
    <div className="relative inline-flex flex-col items-center group">
      <svg
        ref={svgRef}
        width={140}
        height={52}
        className="overflow-visible select-none"
        aria-label={`Growth potential curve for ${activeClients} clients`}
      />
      <div className="flex items-center gap-1.5 -mt-0.5">
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          Trajectory {activeClients}x
        </span>
        <span className="w-1 h-1 rounded-full bg-emerald-400" />
      </div>
    </div>
  );
}
