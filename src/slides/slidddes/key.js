import {Keyboard} from 'keyboardjs';

import {executeCommand, COMMAND_BACK, COMMAND_FWD, COMMAND_NEXT, COMMAND_PREV, COMMAND_LAST, COMMAND_FIRST} from '../control/commandExecutor';

const usLocale = require('keyboardjs/locales/us');

const keyboard = new Keyboard();
keyboard.setLocale('us', usLocale);

export const init = () => {
    keyboard.bind('right', () => {
        executeCommand(COMMAND_NEXT)
    })

    keyboard.bind('s', () => {
        executeCommand(COMMAND_FWD);
    })

    keyboard.bind('left', () => {
        executeCommand(COMMAND_PREV)
    })

    keyboard.bind('a', () => {
        executeCommand(COMMAND_BACK)
    })

    keyboard.bind('up', () => {
        executeCommand(COMMAND_BACK)
    })

    keyboard.bind('w', () => {
        executeCommand(COMMAND_NEXT)
    })

    keyboard.bind('down', () => {
        executeCommand(COMMAND_FWD);
    })

    keyboard.bind('y', () => {
        executeCommand(COMMAND_PREV)
    })

    keyboard.bind('l', () => {
        executeCommand(COMMAND_LAST)
    })

    keyboard.bind('f', () => {
        executeCommand(COMMAND_FIRST)
    })

}

