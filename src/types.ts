export enum AggregateType { AVG = 'AVG', SUM = 'SUM', CNT = 'CNT', MIN = 'MIN', MAX = 'MAX', FIRST = 'FIRST', LAST = 'LAST' }
export enum FragmentType { MINUTE = 'MINUTE', QUARTER = 'QUARTER', HOUR = 'HOUR' }
export enum ColorMode { CUSTOM = 'CUSTOM', SPECTRUM = 'SPECTRUM' }
export enum ColorSpace { RGB = 'RGB', HSL = 'HSL', HCL = 'HCL', LAB = 'LAB', CUBEHELIX = 'CUBEHELIX' }

export interface CarpetPlotOptions {
  aggregate: string;
  fragment: string;
  color: {
    mode: string;
    colorScheme: string;
    nullColor: string;
    customColors: Array<{ color: string; breakpoint?: number }>;
    colorSpace: string;
  };
  scale: { min: number | null; max: number | null };
  xAxis: { show: boolean };
  yAxis: { show: boolean };
  tooltip: { show: boolean };
  legend: { show: boolean; placement: string };
  data: { unitFormat: string; decimals: number | null };
}

export interface DayBucket {
  time: moment.Moment;
  buckets: (number | null)[];
}

export interface CarpetPlotData {
  data: DayBucket[];
  stats: { min: number; max: number };
}