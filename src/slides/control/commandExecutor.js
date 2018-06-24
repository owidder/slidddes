import * as _ from 'lodash';

import {log} from '../../util/log';
import {slideControl} from './SlideControl';
import {sendStatusString} from './statusStringSender';
import * as statusStringReceiver from './statusStringReceiver';

const parse = (commandStr) => {
    try {
        const command = JSON.parse(commandStr);
        return  command;
    } catch (e) {
        log.error(e);
        return {
            command: "error"
        }
    }
}

export const COMMAND_FWD = "fwd";
export const COMMAND_BACK = "back";
export const COMMAND_NEXT = "next";
export const COMMAND_NEXT_FOREVER = "next-forever";
export const COMMAND_PREV = "prev";
export const COMMAND_LAST = "last";
export const COMMAND_FIRST = "first";
export const COMMAND_STATUS = "status";
export const COMMAND_INIT = "init";

export const executeCommand = async (command, argument) => {

    log.info("command: " + command);

    switch (command) {
        case "pause":
            slideControl.pauseJs(argument);
            break;

        case "resume":
            slideControl.resumeJs(argument);
            break;

        case COMMAND_FWD:
            slideControl.forwardStep();
            sendStatusString();
            break;

        case COMMAND_BACK:
            slideControl.backwardStep();
            sendStatusString();
            break;

        case COMMAND_LAST:
            await slideControl.gotoLastStep();
            sendStatusString();
            break;

        case COMMAND_FIRST:
            await slideControl.gotoFirstStep();
            sendStatusString();
            break;

        case COMMAND_NEXT:
            slideControl.fwdSlide(() => sendStatusString(COMMAND_NEXT));
            break;

        case COMMAND_NEXT_FOREVER:
            slideControl.fwdSlideForever();
            break;

        case COMMAND_PREV:
            slideControl.backSlide(() => sendStatusString(COMMAND_PREV));
            break;

        case COMMAND_STATUS:
            statusStringReceiver.parse(argument);
            break;

        case COMMAND_INIT:
            sendStatusString();
            break;

        case "connected":
            // do nothing
            break;

        default:
            log.error("cannot execute: " + command);
    }
}

export const execute = (commandObjStr) => {
    const commandObj = parse(commandObjStr);

    if(!_.isEmpty(commandObj.command)) {
        executeCommand(commandObj.command, commandObj.argument);
    }
}