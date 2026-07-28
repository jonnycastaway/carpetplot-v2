import moment from 'moment';
import { FragmentType, Fragment } from './types';

const fragments: Record<FragmentType, Fragment> = {
  [FragmentType.MINUTE]: {
    count: 1440,
    getBucketIndex: (time) => time.hour() * 60 + time.minute(),
    getTime: (time, bucketIndex) => moment(time).startOf('day').add(bucketIndex, 'minute'),
    getBucket: (timestamp) => moment(timestamp).startOf('minute').unix(),
    nextTime: (time) => moment(time).add(1, 'minute'),
  },
  [FragmentType.QUARTER]: {
    count: 96,
    getBucketIndex: (time) => time.hour() * 4 + Math.floor(time.minute() / 15),
    getTime: (time, bucketIndex) => moment(time).startOf('day').add(15 * bucketIndex, 'minute'),
    getBucket: (timestamp) => {
      const minutes = Math.floor(moment(timestamp).minute() / 15) * 15;
      return moment(timestamp).startOf('hour').add(minutes, 'minute').unix();
    },
    nextTime: (time) => moment(time).add(15, 'minute'),
  },
  [FragmentType.HOUR]: {
    count: 24,
    getBucketIndex: (time) => time.hour(),
    getTime: (time, bucketIndex) => moment(time).startOf('day').add(bucketIndex, 'hour'),
    getBucket: (timestamp) => moment(timestamp).startOf('hour').unix(),
    nextTime: (time) => moment(time).add(1, 'hour'),
  },
};

export const getFragment = (fragmentType: FragmentType): Fragment => fragments[fragmentType];

export const fragmentOptions = [
  { label: 'Minute', value: FragmentType.MINUTE },
  { label: '15 minutes', value: FragmentType.QUARTER },
  { label: 'Hour', value: FragmentType.HOUR },
];