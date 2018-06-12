import {counter} from '../slidAR/flipcounter/counter';

const time0 = 1528733890540;
const blockCount0 = 2444254;

const timeNow = (new Date()).getTime();
const blocksBetweenTime0AndTimeNow = Math.round((timeNow - time0) / 15000)
const blockCountNow = blockCount0 + blocksBetweenTime0AndTimeNow;

const create = (containerSelector, durationInMsLower = 0, durationInMsUpper = 30000) => {
    counter.create(containerSelector, blockCountNow, durationInMsLower, durationInMsUpper);
}

export const RinkebyBlockCounter = {
    create
}
