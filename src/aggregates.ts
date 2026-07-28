import { AggregateType } from './types';

const sum = (values: number[]): number => values.reduce((s, n) => s + n, 0);
const min = (values: number[]): number => Math.min(...values);
const max = (values: number[]): number => Math.max(...values);

const aggregates: Record<AggregateType, (values: number[]) => number> = {
  [AggregateType.AVG]: (values) => sum(values) / values.length,
  [AggregateType.SUM]: (values) => sum(values),
  [AggregateType.CNT]: (values) => values.length,
  [AggregateType.MIN]: (values) => min(values),
  [AggregateType.MAX]: (values) => max(values),
  [AggregateType.FIRST]: (values) => (values.length === 0 ? 0 : values[0]),
  [AggregateType.LAST]: (values) => (values.length === 0 ? 0 : values[values.length - 1]),
};

export const aggregate = (type: AggregateType): ((values: number[]) => number) => {
  return (values) => aggregates[type](values);
};

export const aggregateOptions = [
  { label: 'Average', value: AggregateType.AVG },
  { label: 'Sum', value: AggregateType.SUM },
  { label: 'Count', value: AggregateType.CNT },
  { label: 'Minimum', value: AggregateType.MIN },
  { label: 'Maximum', value: AggregateType.MAX },
  { label: 'First', value: AggregateType.FIRST },
  { label: 'Last', value: AggregateType.LAST },
];