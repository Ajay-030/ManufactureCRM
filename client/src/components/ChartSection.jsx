import React, { useState } from 'react';
import { TrendingUp, BarChart4, AreaChart, DollarSign, Calendar } from 'lucide-react';

const ChartSection = () => {
  const [activeTab, setActiveTab] = useState('area'); // 'area' or 'bar'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Hardcoded sales analytics dataset for premium visual indexing
  const salesData = [
    { month: 'Jan', value: 1800000, deals: 3, formatted: '₹1.8M' },
    { month: 'Feb', value: 2400000, deals: 5, formatted: '₹2.4M' },
    { month: 'Mar', value: 3100000, deals: 7, formatted: '₹3.1M' },
    { month: 'Apr', value: 2800000, deals: 4, formatted: '₹2.8M' },
    { month: 'May', value: 4500000, deals: 9, formatted: '₹4.5M' },
    { month: 'Jun', value: 5200000, deals: 11, formatted: '₹5.2M' },
  ];

  const maxVal = Math.max(...salesData.map(d => d.value));
  
  // Dimensions for SVG line/area mapping
  const width = 600;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;

  // Calculate coordinates for points
  const points = salesData.map((d, index) => {
    const x = paddingLeft + (index / (salesData.length - 1)) * graphWidth;
    const y = paddingTop + graphHeight - (d.value / maxVal) * graphHeight;
    return { x, y, ...d };
  });

  // Create SVG path strings
  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    // Generate smooth bezier curve path
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p = points[i];
      const cpX1 = p0.x + (p.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p.x - p0.x) / 2;
      const cpY2 = p.y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }

    // Connect to bottom for filled Area graph
    areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + graphHeight} L ${points[0].x} ${paddingTop + graphHeight} Z`;
  }

  return (
    <div className="glass-panel rounded-2xl p-6 relative border border-slate-800/80">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
            <TrendingUp className="text-brand-400 w-5 h-5" /> Sales Performance Chart
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Monthly closed deal values and metrics</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 self-stretch sm:self-auto justify-between">
          <button
            onClick={() => setActiveTab('area')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${activeTab === 'area' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <AreaChart className="w-3.5 h-3.5" /> Trend Curve
          </button>
          <button
            onClick={() => setActiveTab('bar')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${activeTab === 'bar' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <BarChart4 className="w-3.5 h-3.5" /> Bar Columns
          </button>
        </div>
      </div>

      {/* Main Chart Canvas wrapper */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-slate-500">
          {/* Definition for elegant green glow gradient */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#267f78" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#267f78" stopOpacity="0.0"/>
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + ratio * graphHeight;
            const gridVal = ((1 - ratio) * maxVal / 100000).toFixed(0) + 'L';
            return (
              <g key={i}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="rgba(255,255,255,0.04)" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 4} 
                  className="fill-slate-500 text-[10px] text-right font-medium"
                  textAnchor="end"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Render Area/Line Chart */}
          {activeTab === 'area' && (
            <>
              {/* Gradient Filled Area */}
              <path d={areaPath} fill="url(#areaGradient)" className="animate-fade-in" />
              
              {/* Main Line path */}
              <path 
                d={linePath} 
                fill="none" 
                stroke="#329e94" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Point Markers */}
              {points.map((pt, idx) => (
                <g 
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredIdx === idx ? 6 : 4}
                    fill={hoveredIdx === idx ? '#329e94' : '#0f172a'}
                    stroke="#329e94"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                  {hoveredIdx === idx && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="12"
                      fill="#329e94"
                      fillOpacity="0.15"
                      className="animate-ping"
                    />
                  )}
                </g>
              ))}
            </>
          )}

          {/* Render Bar Columns */}
          {activeTab === 'bar' && (
            <g className="animate-fade-in">
              {points.map((pt, idx) => {
                const barWidth = 32;
                const barHeight = graphHeight - (pt.y - paddingTop);
                const x = pt.x - barWidth / 2;
                return (
                  <rect
                    key={idx}
                    x={x}
                    y={pt.y}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    fill={hoveredIdx === idx ? '#4ebbb0' : '#267f78'}
                    className="transition-colors duration-150 cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })}
            </g>
          )}

          {/* X-Axis labels */}
          {points.map((pt, idx) => (
            <text
              key={idx}
              x={pt.x}
              y={height - 12}
              className="fill-slate-400 text-[10px] font-semibold"
              textAnchor="middle"
            >
              {pt.month}
            </text>
          ))}
        </svg>

        {/* Dynamic HTML Tooltip display absolute */}
        {hoveredIdx !== null && (
          <div 
            className="absolute bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-xl pointer-events-none animate-scale-in"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
              top: `${(points[hoveredIdx].y / height) * 100 - 32}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="flex items-center gap-1.5 text-xs text-brand-400 font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{salesData[hoveredIdx].month} Sales Review</span>
            </div>
            <div className="flex flex-col gap-0.5 text-xs text-slate-200">
              <span>Value: <strong className="text-slate-100 font-bold">{salesData[hoveredIdx].formatted}</strong></span>
              <span>Deals: <strong className="text-slate-100 font-bold">{salesData[hoveredIdx].deals} Closed</strong></span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 items-center justify-between text-xs text-slate-500 border-t border-slate-800/40 pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
            <span>Completed Value</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600/40 border border-brand-500/25" />
            <span>Deals count scale</span>
          </div>
        </div>
        <div>
          <span>Target performance quota: <strong className="text-brand-400">₹4.0M/mo</strong></span>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
