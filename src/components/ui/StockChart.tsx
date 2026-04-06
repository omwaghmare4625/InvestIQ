import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle, CandlestickSeries, LineSeries, AreaSeries, HistogramSeries } from 'lightweight-charts';

interface StockChartProps {
  data: any[];
  mode: 'line' | 'candle';
  height?: number;
}

export const StockChart: React.FC<StockChartProps> = ({ data, mode, height = 400 }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94A3B8',
      },
      grid: {
        vertLines: { color: '#1E293B', style: LineStyle.SparseDotted },
        horzLines: { color: '#1E293B', style: LineStyle.SparseDotted },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#475569', width: 1, style: LineStyle.Dashed },
        horzLine: { color: '#475569', width: 1, style: LineStyle.Dashed },
      },
      timeScale: {
        borderColor: '#2A3657',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#2A3657',
      },
      handleScroll: true,
      handleScale: true,
    });

    if (mode === 'candle') {
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10B981',
        downColor: '#EF4444',
        borderUpColor: '#10B981',
        borderDownColor: '#EF4444',
        wickUpColor: '#10B981',
        wickDownColor: '#EF4444',
      });
      candlestickSeries.setData(data);

      // Add 20-period SMA
      const smaData = data.map((d, i) => {
        if (i < 20) return null;
        const slice = data.slice(i - 20, i);
        const sum = slice.reduce((a, b) => a + b.close, 0);
        return { time: d.time, value: sum / 20 };
      }).filter(d => d !== null);

      const smaSeries = chart.addSeries(LineSeries, {
        color: '#F59E0B',
        lineWidth: 1,
        priceScaleId: 'right',
      });
      smaSeries.setData(smaData as any);

      // Bollinger Bands
      const bbData = data.map((d, i) => {
        if (i < 20) return null;
        const slice = data.slice(i - 20, i);
        const mean = slice.reduce((a, b) => a + b.close, 0) / 20;
        const variance = slice.reduce((a, b) => a + Math.pow(b.close - mean, 2), 0) / 20;
        const stdDev = Math.sqrt(variance);
        return { time: d.time, upper: mean + 2 * stdDev, lower: mean - 2 * stdDev };
      }).filter(d => d !== null);

      const upperBB = chart.addSeries(LineSeries, { color: 'rgba(139, 92, 246, 0.3)', lineWidth: 1, lineStyle: LineStyle.Dashed });
      const lowerBB = chart.addSeries(LineSeries, { color: 'rgba(139, 92, 246, 0.3)', lineWidth: 1, lineStyle: LineStyle.Dashed });
      upperBB.setData(bbData.map(d => ({ time: d!.time, value: d!.upper })));
      lowerBB.setData(bbData.map(d => ({ time: d!.time, value: d!.lower })));
    } else {
      const lineSeries = chart.addSeries(LineSeries, {
        color: '#3B82F6',
        lineWidth: 2,
      });
      lineSeries.setData(data.map(d => ({ time: d.time, value: d.close })));
      
      // Add area for line chart
      const areaSeries = chart.addSeries(AreaSeries, {
        topColor: 'rgba(59, 130, 246, 0.3)',
        bottomColor: 'rgba(59, 130, 246, 0)',
        lineColor: 'transparent',
        lineWidth: 1,
      });
      areaSeries.setData(data.map(d => ({ time: d.time, value: d.close })));
    }

    // Add Volume bars
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#2A3657',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // set as an overlay
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // highest point of the series will be 80% from top
        bottom: 0,
      },
    });

    volumeSeries.setData(data.map(d => ({
      time: d.time,
      value: d.volume,
      color: d.close >= d.open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    })));

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, mode]);

  return <div ref={chartContainerRef} className="w-full" style={{ height }} />;
};
