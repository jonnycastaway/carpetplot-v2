import moment from 'moment';
import { aggregate } from './aggregates';
import { getFragment } from './fragments';
import { AggregateType, FragmentType, DayBucket, CarpetPlotData } from './types';
import { DataFrame, FieldType } from '@grafana/data';

const createArray = (length: number, initiator: () => any = () => null): any[] =>
  Array.from({ length }, initiator);

const prepareData = (from: Date, to: Date, fragment: ReturnType<typeof getFragment>) => {
  const data: Record<string, { time: moment.Moment; values: number[] }> = {};
  const fromUtc = moment(from).utc().startOf('day');
  const toUtc = moment(to).utc().startOf('day').add(1, 'day');
  for (let time = moment(fromUtc); time.isBefore(toUtc); time = fragment.nextTime(time)) {
    data[time.unix()] = { time: moment(time), values: [] };
  }
  return { data, from: fromUtc, to: toUtc };
};

const groupData = (
  from: Date,
  to: Date,
  fragment: ReturnType<typeof getFragment>,
  dataList: DataFrame[]
) => {
  const container = prepareData(from, to, fragment);
  for (const frame of dataList) {
    const timeField = frame.fields.find((f) => f.type === FieldType.time);
    const valueField = frame.fields.find((f) => f.type === FieldType.number);
    if (!timeField || !valueField) continue;
    for (let i = 0; i < timeField.values.length; i++) {
      const value = valueField.values[i];
      if (value === null || value === undefined) continue;
      const timestamp = timeField.values[i];
      const bucket = fragment.getBucket(timestamp);
      if (bucket in container.data) {
        container.data[bucket].values.push(value);
      }
    }
  }
  return container;
};

const aggregateData = (
  from: Date,
  to: Date,
  fragment: ReturnType<typeof getFragment>,
  data: Record<string, { time: moment.Moment; values: number[] }>,
  aggregateType: AggregateType
): CarpetPlotData => {
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  const aggregateFunc = aggregate(aggregateType || AggregateType.AVG);
  const result: DayBucket[] = [];

  const createBucket = (time: moment.Moment): DayBucket => ({
    time,
    buckets: createArray(fragment.count) as (number | null)[],
  });

  let bucket = createBucket(moment(from).startOf('day'));
  for (const item of Object.values(data)) {
    const timeLocal = item.time.local();
    if (timeLocal.isBefore(bucket.time)) continue;
    const value = item.values.length > 0 ? aggregateFunc(item.values) : null;
    if (value !== null && value < min) min = value;
    if (value !== null && value > max) max = value;
    const day = moment(timeLocal).startOf('day');
    if (!day.isSame(bucket.time)) {
      result.push({ ...bucket });
      bucket = createBucket(day);
    }
    const bucketIndex = fragment.getBucketIndex(timeLocal);
    bucket.buckets[bucketIndex] = value;
  }
  if (bucket.buckets.some((b) => b !== null)) {
    result.push(bucket);
  }

  return { data: result, stats: { min, max } };
};

export const convertData = (
  from: Date,
  to: Date,
  dataList: DataFrame[],
  aggregateType: AggregateType,
  fragmentType: FragmentType
): CarpetPlotData => {
  const fragment = getFragment(fragmentType);
  const container = groupData(from, to, fragment, dataList);
  const result = aggregateData(from, to, fragment, container.data, aggregateType);
  return { ...result };
};