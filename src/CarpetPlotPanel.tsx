import React from 'react';
import { PanelProps, getValueFormat } from '@grafana/data';
import { CarpetPlotOptions, CarpetPlotData, FragmentType } from './types';
import { convertData } from './dataConverter';
import { useTheme2 } from '@grafana/ui';

interface Props extends PanelProps<CarpetPlotOptions> {}

const colorSchemes: Record<string, string[][]> = {
  interpolateRdYlGn: [['#a50026','#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837'].reverse(), ['#006837','#1a9850','#66bd63','#a6d96a','#d9ef8b','#ffffbf','#fee08b','#fdae61','#f46d43','#d73027','#a50026']],
  interpolateSpectral: [['#3f007d','#54278f','#756bb1','#9e9ac8','#cbc9e2','#f2f0f7','#fee0b6','#fdbb84','#fc8d59','#e34a33','#b30000'].reverse(), ['#b30000','#e34a33','#fc8d59','#fdbb84','#fee0b6','#f2f0f7','#cbc9e2','#9e9ac8','#756bb1','#54278f','#3f007d']],
  interpolateBlues: [['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'], ['#08306b','#08519c','#2171b5','#4292c6','#6baed6','#9ecae1','#c6dbef','#deebf7','#f7fbff']],
  interpolateGreens: [['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b'], ['#00441b','#006d2c','#238b45','#41ab5d','#74c476','#a1d99b','#c7e9c0','#e5f5e0','#f7fcf5']],
  interpolateOranges: [['#fff5eb','#fee6ce','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#a63603','#7f2704'], ['#7f2704','#a63603','#d94801','#f16913','#fd8d3c','#fdae6b','#fdd0a2','#fee6ce','#fff5eb']],
  interpolatePurples: [['#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#54278f','#3f007d'], ['#3f007d','#54278f','#6a51a3','#807dba','#9e9ac8','#bcbddc','#dadaeb','#efedf5','#fcfbfd']],
  interpolateReds: [['#fff5f0','#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#a50f15','#67000d'], ['#67000d','#a50f15','#cb181d','#ef3b2c','#fb6a4a','#fc9272','#fcbba1','#fee0d2','#fff5f0']],
  interpolateGreys: [['#ffffff','#f0f0f0','#d9d9d9','#bdbdbd','#969696','#737373','#525252','#252525','#000000'], ['#000000','#252525','#525252','#737373','#969696','#bdbdbd','#d9d9d9','#f0f0f0','#ffffff']],
  interpolateBuGn: [['#f7fcfd','#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b'], ['#00441b','#006d2c','#238b45','#41ae76','#66c2a4','#99d8c9','#ccece6','#e5f5f9','#f7fcfd']],
  interpolateBuPu: [['#f7fcfd','#e0ecf4','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#810f7c','#4d004b'], ['#4d004b','#810f7c','#88419d','#8c6bb1','#8c96c6','#9ebcda','#bfd3e6','#e0ecf4','#f7fcfd']],
  interpolateGnBu: [['#f7fcf0','#e0f3d8','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081'], ['#084081','#0868ac','#2b8cbe','#4eb3d3','#7bccc4','#a8ddb5','#ccebc5','#e0f3d8','#f7fcf0']],
  interpolateOrRd: [['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000'], ['#7f0000','#b30000','#d7301f','#ef6548','#fc8d59','#fdbb84','#fdd49e','#fee8c8','#fff7ec']],
  interpolatePuBuGn: [['#fff7fb','#ece2f0','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016c59','#014636'], ['#014636','#016c59','#02818a','#3690c0','#67a9cf','#a6bddb','#d0d1e6','#ece2f0','#fff7fb']],
  interpolatePuBu: [['#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#045a8d','#023858'], ['#023858','#045a8d','#0570b0','#3690c0','#74a9cf','#a6bddb','#d0d1e6','#ece7f2','#fff7fb']],
  interpolatePuRd: [['#f7f4f9','#e7e1ef','#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#980043','#67001f'], ['#67001f','#980043','#ce1256','#e7298a','#df65b0','#c994c7','#d4b9da','#e7e1ef','#f7f4f9']],
  interpolateRdPu: [['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177','#49006a'], ['#49006a','#7a0177','#ae017e','#dd3497','#f768a1','#fa9fb5','#fcc5c0','#fde0dd','#fff7f3']],
  interpolateYlGnBu: [['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58'], ['#081d58','#253494','#225ea8','#1d91c0','#41b6c4','#7fcdbb','#c7e9b4','#edf8b1','#ffffd9']],
  interpolateYlGn: [['#ffffe5','#f7fcb9','#d9f0a3','#addd8e','#78c679','#41ab5d','#238443','#006837','#004529'], ['#004529','#006837','#238443','#41ab5d','#78c679','#addd8e','#d9f0a3','#f7fcb9','#ffffe5']],
  interpolateYlOrBr: [['#ffffe5','#fff7bc','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#993404','#662506'], ['#662506','#993404','#cc4c02','#ec7014','#fe9929','#fec44f','#fee391','#fff7bc','#ffffe5']],
  interpolateYlOrRd: [['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'], ['#800026','#bd0026','#e31a1c','#fc4e2a','#fd8d3c','#feb24c','#fed976','#ffeda0','#ffffcc']],
};

const getColor = (value: number, min: number, max: number, options: CarpetPlotOptions): string => {
  if (value === null || value === undefined) return options.color.nullColor || 'transparent';
  if (options.color.mode === 'CUSTOM' && options.color.customColors?.length >= 2) {
    const sorted = [...options.color.customColors].sort((a, b) => (a.breakpoint ?? 0) - (b.breakpoint ?? 0));
    const first = sorted[0].breakpoint ?? 0;
    const last = sorted[sorted.length - 1].breakpoint ?? 0;
    if (value <= first) return sorted[0].color;
    if (value >= last) return sorted[sorted.length - 1].color;
    for (let i = 0; i < sorted.length - 1; i++) {
      const low = sorted[i].breakpoint ?? 0;
      const high = sorted[i + 1].breakpoint ?? 0;
      if (value >= low && value <= high) {
        const t = (value - low) / (high - low || 1);
        return interpolateHex(sorted[i].color, sorted[i + 1].color, Math.max(0, Math.min(1, t)));
      }
    }
    return sorted[sorted.length - 1].color;
  }
  const scheme = colorSchemes[options.color.colorScheme];
  if (scheme) {
    const palette = scheme[0];
    const range = max - min || 1;
    const t = (value - min) / range;
    const idx = Math.min(Math.floor(t * (palette.length - 1)), palette.length - 2);
    const tt = (t * (palette.length - 1)) % 1;
    return interpolateHex(palette[idx], palette[idx + 1], tt);
  }
  const range = max - min || 1;
  return interpolateHex('#1b9e77', '#d95f02', (value - min) / range);
};

const interpolateHex = (c1: string, c2: string, t: number): string => {
  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
};

const formatValue = (value: number | null, decimals: number | null, unit: string): string => {
  if (value === null || value === undefined) return '-';
  try {
    const fmt = getValueFormat(unit || undefined);
    const result = fmt(value, decimals ?? undefined);
    return result.text + (result.suffix || '');
  } catch {
    if (decimals !== null) return value.toFixed(decimals);
    return value.toFixed(1);
  }
};

export const CarpetPlotPanel: React.FC<Props> = ({ data, options, width, height }) => {
  const theme = useTheme2();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [carpetData, setCarpetData] = React.useState<CarpetPlotData | null>(null);
  const [tooltip, setTooltip] = React.useState<{ x: number; y: number; value: number | null; dayLabel: string; timeLabel: string } | null>(null);

  React.useEffect(() => {
    if (!data?.series?.length) { setCarpetData(null); return; }
    const from = new Date(data.timeRange.from.valueOf());
    const to = new Date(data.timeRange.to.valueOf());
    setCarpetData(convertData(from, to, data.series, options.aggregate as any, options.fragment as any));
  }, [data, options.aggregate, options.fragment]);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!carpetData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const legendBottom = (options.legend.show && options.legend.placement === 'bottom') ? 30 : 0;
    const legendRight = (options.legend.show && options.legend.placement !== 'bottom') ? 30 : 0;
    const pad = { top: 20, right: 10, bottom: (options.xAxis.show ? 50 : 10) + legendBottom, left: (options.yAxis.show ? 45 : 10) };
    const plotWidth = width - pad.left - pad.right - legendRight;
    const plotHeight = height - pad.top - pad.bottom;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    ctx.fillStyle = theme.colors.background.primary;
    ctx.fillRect(0, 0, width, height);

    const { data: days, stats } = carpetData;
    if (!days.length) return;
    const cellW = plotWidth / days.length;
    const { min, max } = stats;
    const frag = options.fragment === 'MINUTE' ? { count: 1440 } : options.fragment === 'QUARTER' ? { count: 96 } : { count: 24 };
    const cellH = plotHeight / frag.count;

    for (let di = 0; di < days.length; di++) {
      const day = days[di];
      for (let bi = 0; bi < day.buckets.length; bi++) {
        const val = day.buckets[bi];
        const x = pad.left + di * cellW;
        const y = pad.top + bi * cellH;
        ctx.fillStyle = val !== null ? getColor(val, min, max, options) : (options.color.nullColor || 'transparent');
        ctx.fillRect(x, y, Math.max(cellW, 1), Math.max(cellH, 1));
      }
    }

    if (options.legend.show) {
      const steps = 100;
      if (options.legend.placement === 'bottom') {
        const lx = pad.left;
        const ly = height - legendBottom + 5;
        const lw = plotWidth;
        const lh = 12;
        ctx.save();
        ctx.beginPath();
        ctx.rect(lx, ly, lw, lh);
        ctx.clip();
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const val = min + (max - min) * t;
          ctx.fillStyle = getColor(val, min, max, options);
          ctx.fillRect(lx + (t * lw), ly, lw / steps + 1, lh);
        }
        ctx.restore();
        ctx.strokeStyle = theme.colors.border.weak;
        ctx.strokeRect(lx, ly, lw, lh);
        ctx.fillStyle = theme.colors.text.primary;
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(formatValue(min, options.data.decimals, options.data.unitFormat), lx, ly + lh + 2);
        ctx.textAlign = 'right';
        ctx.fillText(formatValue(max, options.data.decimals, options.data.unitFormat), lx + lw, ly + lh + 2);
        if (options.color.mode === 'CUSTOM' && options.color.customColors?.length) {
          const sorted = [...options.color.customColors].sort((a, b) => (a.breakpoint ?? 0) - (b.breakpoint ?? 0));
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.font = '8px sans-serif';
          for (const c of sorted) {
            const bp = c.breakpoint ?? 0;
            const x = lx + ((bp - min) / (max - min || 1)) * lw;
            ctx.fillText(formatValue(bp, options.data.decimals, options.data.unitFormat), Math.max(0, Math.min(lw, x)), ly + lh + 2);
          }
        }
      } else {
        const lx = width - legendRight + 5;
        const ly = pad.top;
        const lh = plotHeight;
        const lw = 12;
        ctx.save();
        ctx.beginPath();
        ctx.rect(lx, ly, lw, lh);
        ctx.clip();
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const val = min + (max - min) * t;
          ctx.fillStyle = getColor(val, min, max, options);
          ctx.fillRect(lx, ly + lh - (t * lh), lw, lh / steps + 1);
        }
        ctx.restore();
        ctx.strokeStyle = theme.colors.border.weak;
        ctx.strokeRect(lx, ly, lw, lh);
        ctx.fillStyle = theme.colors.text.primary;
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(formatValue(max, options.data.decimals, options.data.unitFormat), lx + lw + 3, ly);
        ctx.textBaseline = 'bottom';
        ctx.fillText(formatValue(min, options.data.decimals, options.data.unitFormat), lx + lw + 3, ly + lh);
        if (options.color.mode === 'CUSTOM' && options.color.customColors?.length) {
          const sorted = [...options.color.customColors].sort((a, b) => (a.breakpoint ?? 0) - (b.breakpoint ?? 0));
          ctx.textAlign = 'left';
          ctx.font = '8px sans-serif';
          for (const c of sorted) {
            const bp = c.breakpoint ?? 0;
            const y = ly + lh - ((bp - min) / (max - min || 1)) * lh;
            ctx.fillText(formatValue(bp, options.data.decimals, options.data.unitFormat), lx + lw + 3, Math.max(0, Math.min(ly + lh, y)));
          }
        }
      }
    }

    if (options.xAxis.show) {
      ctx.fillStyle = theme.colors.text.primary;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const xStep = Math.max(1, Math.floor(days.length / Math.max(2, plotWidth / 70)));
      for (let i = 0; i < days.length; i += xStep) {
        ctx.fillText(days[i].time.format('DD.MM'), pad.left + (i + 0.5) * cellW, height - legendBottom - 4);
      }
    }

    if (options.yAxis.show) {
      ctx.fillStyle = theme.colors.text.primary;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const yStep = Math.max(1, Math.floor(frag.count / Math.max(2, plotHeight / 28)));
      for (let i = 0; i < frag.count; i += yStep) {
        const label = options.fragment === 'HOUR' ? `${String(i).padStart(2, '0')}:00` : `${Math.floor(i * 24 / frag.count)}:${String(Math.round((i * 24 / frag.count % 1) * 60)).padStart(2, '0')}`;
        ctx.fillText(label, pad.left - 6, pad.top + (i + 0.5) * cellH);
      }
    }
  }, [carpetData, width, height, options, theme]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!carpetData || !canvasRef.current || !containerRef.current) { setTooltip(null); return; }
    const pad = { top: 20, left: options.yAxis.show ? 45 : 10 };
    const pw = width - pad.left - 10;
    const ph = height - 70;
    const { data: days } = carpetData;
    if (!days.length) return;
    const cw = pw / days.length;
    const frag = options.fragment === 'MINUTE' ? { count: 1440 } : options.fragment === 'QUARTER' ? { count: 96 } : { count: 24 };
    const ch = ph / frag.count;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const di = Math.floor((mx - pad.left) / cw);
    const bi = Math.floor((my - pad.top) / ch);
    if (di < 0 || di >= days.length || bi < 0 || bi >= frag.count) { setTooltip(null); return; }
    const day = days[di];
    const val = day.buckets[bi];
    const dl = day.time.format('DD.MM.YYYY');
    const hl = options.fragment === 'HOUR' ? `${String(bi).padStart(2, '0')}:00` : `${Math.floor(bi * 24 / frag.count)}:${String(Math.round((bi * 24 / frag.count % 1) * 60)).padStart(2, '0')}`;
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, value: val, dayLabel: dl, timeLabel: hl });
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <div ref={containerRef} style={{ width, height, position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
      {tooltip && options.tooltip.show && (
        <div style={{
          position: 'absolute', left: tooltip.x + 12, top: tooltip.y + 12,
          background: theme.colors.background.secondary,
          border: `1px solid ${theme.colors.border.medium}`,
          padding: '8px 12px', borderRadius: '4px', fontSize: '12px',
          pointerEvents: 'none', zIndex: 1000, whiteSpace: 'nowrap',
        }}>
          <div><strong>{tooltip.dayLabel}</strong> {tooltip.timeLabel}</div>
          <div>{formatValue(tooltip.value, options.data.decimals, options.data.unitFormat)}</div>
        </div>
      )}
    </div>
  );
};