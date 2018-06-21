import * as _ from 'lodash';
import {slidarGlobal} from '../slidddes/slidarGlobal';
import * as webSocketSender from '../../websocket/webSocketSender';

export const send = (data) => {
    if(isOnline()) {
        return webSocketSender.send(slidarGlobal.socket, data);
    }

    return Promise.resolve();
}

export const isOnline = () => {
    return _.isObject(slidarGlobal.socket);
}
