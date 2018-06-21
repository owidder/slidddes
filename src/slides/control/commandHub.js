import * as _ from 'lodash';

import {log} from '../../util/log';
import * as query from '../../util/query';

import {slidarGlobal} from '../slidddes/slidarGlobal';
import {execute} from './commandExecutor';

import * as webSocketHub from '../../websocket/webSocketHub';

const WS_HOST_PARAM = "wsHost";

const host = window.location.hostname;
const port = 2337;

export class CommandHub {
    constructor() {
        const wsHostParam = query.paramValue(WS_HOST_PARAM);

        if(_.isEmpty(wsHostParam)) {
            return
        }

        const wsHost = (wsHostParam === "1" ? host : wsHostParam);
        
        this.socket = new WebSocket("ws://" + wsHost + ":" + port);

        this.socket.onmessage = function (event) {
            const commandStr = event.data;
            log.info(commandStr);
            execute(commandStr);
        }

        slidarGlobal.socket = this.socket;
    }
}

export const connect = () => {
    const socket = webSocketHub.connect(2337, (commandStr) => {
        log.info(commandStr);
        execute(commandStr);
    });

    slidarGlobal.socket = socket;
}
