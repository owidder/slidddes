import * as _ from 'lodash';

import {paramValue} from '../../util/query';

export const is = () => {
    const demo = paramValue("demo");
    return !_.isUndefined(demo);
}

export const demo = {
    is
}
