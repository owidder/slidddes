import * as _ from 'lodash';
import {SnakeField} from './SnakeField';
import {snakeForms, S, N, W, E} from './SnakeForms';
import {scripts} from '../scripting/scripts';

const _writeSlowSnakes = (snakeField) => {
    snakeForms.s(snakeField, "_1", 0, 0);
    snakeForms.l(snakeField, "_1", 5, 0);
    snakeForms.o(snakeField, "_1", 10, 0);
    snakeForms.w(snakeField, "_1", 15, 0);

    snakeForms.s(snakeField, "_2", 0, 10);
    snakeForms.n(snakeField, "_2", 5, 10);
    snakeForms.a(snakeField, "_2", 11, 10);
    snakeForms.k(snakeField, "_2", 16, 10);
    snakeForms.e(snakeField, "_2", 21, 10);
    snakeForms.s(snakeField, "_2a", 26, 10);
}

const _dance01 = (snakeField) => {
    snakeForms.moveDirections(snakeField, "_1", 5, 90, [[80, N], [80, E]]);
    snakeForms.moveDirections(snakeField, "_2", 90, 5, [[80, S], [80, W]]);
}

const once = (slideId, selector, width, height, command, dimX, dimY) => {
    const snakeField = new SnakeField(slideId, selector, width, height, dimX, dimY);
    command(snakeField);

    return snakeField;
}

const forever = (slideId, selector, width, height, duration, command, dimX, dimY) => {
    const callOnce = () => once(slideId, selector, width, height, command, dimX, dimY);
    let snakeField = callOnce();

    const interval = setInterval(async () => {
        await snakeField.destroy();
        snakeField = callOnce();
    }, duration > 0 ? duration : 30000);

    const handle = {interval, snakeField, selector};

    scripts.registerStopFunction(slideId, () => {
        stop(handle);
    })

    return handle;
}

const writeSlowSnakesForever = (slideId, selector, width, height, duration, dimX, dimY) => {
    return forever(slideId, selector, width, height, duration, _writeSlowSnakes, dimX, dimY)
}

const dance01Forever = (slideId, selector, width, height, duration, dimX, dimY) => {
    return forever(slideId, selector, width, height, duration, _dance01, dimX, dimY);
}

const stop = (handle) => {
    if(!_.isUndefined(handle)) {
        const {interval, snakeField, selector} = handle;
        clearInterval(interval);
        snakeField.clear(selector);
    }
}

export const moveSlowSnakes = {
    writeSlowSnakesForever,
    dance01Forever,
    stop,
}
