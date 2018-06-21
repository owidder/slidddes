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
    snakeForms.moveDirections(snakeField, "_3", 60, 60, [[10, S], [10, W], [10, N], [8, E], [8, S]]);
}

const _tailCollision = (snakeField) => {
    snakeForms.moveDirections(snakeField, "_1", 10, 10, [[5, N]]);
    snakeForms.moveDirections(snakeField, "_2", 19, 9, [[9, W]]);
}

const _headCollision = (snakeField) => {
    snakeForms.moveDirections(snakeField, "_1", 10, 10, [[2, S]]);
    snakeForms.moveDirections(snakeField, "_2", 5, 12, [[5, E]]);
}

const _selfCollision = (snakeField) => {
    snakeForms.moveDirections(snakeField, "_1", 10, 10, [[3, N], [2, E], [2, S], [2, W]]);
}

const _doNotMoveOutside = (snakeField) => {
    snakeForms.moveDirections(snakeField, "_1", 15, 15, [[4, S]]);
}

const forever = (slideId, snakeField, duration, command) => {
    command(snakeField);

    const interval = setInterval(() => {
        snakeField.clearSnakes();
        command(snakeField);
    }, duration > 0 ? duration : 30000);

    scripts.registerStopFunction(slideId, () => {
        clearInterval(interval);
        snakeField.clearSnakes();
    })
}

const writeSlowSnakesForever = (slideId, snakeField, duration) => {
    return forever(slideId, snakeField, duration, _writeSlowSnakes);
}

const dance01Forever = (slideId, snakeField, duration) => {
    return forever(slideId, snakeField, duration, _dance01);
}

const tailCollisionForever = (slideId, snakeField, duration) => {
    return forever(slideId, snakeField, duration, _tailCollision);
}

const headCollisionForever = (slideId, snakeField, duration) => {
    return forever(slideId, snakeField, duration, _headCollision);
}

const selfCollisionForever = (slideId, snakeField, duration) => {
    return forever(slideId, snakeField, duration, _selfCollision);
}

const doNotMoveOutsideForever = (slideId, snakeField, duration) => {
    return forever(slideId, snakeField, duration, _doNotMoveOutside);
}

export const moveSlowSnakes = {
    writeSlowSnakesForever,
    dance01Forever,
    tailCollisionForever,
    headCollisionForever,
    doNotMoveOutsideForever,
    selfCollisionForever,
}
