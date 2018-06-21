import * as _ from 'lodash';
import {slidddesGlobal} from '../slidddes/slidddesGlobal';
import * as webSocketSender from '../../websocket/webSocketSender';

export const send = (data) => {
    if(isOnline()) {
        return webSocketSender.send(slidddesGlobal.socket, data);
    }

    return Promise.resolve();
}

export const isOnline = () => {
    return _.isObject(slidddesGlobal.socket);
}
