import {SnakeField} from './SnakeField';
import {snakeForms} from './SnakeForms';

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

const writeSlowSnakesOnce = (selector, width, heigth) => {
    const snakeField = new SnakeField(selector, 300, 300);
    _writeSlowSnakes(snakeField);

    return snakeField;
}

const writeSlowSnakesForever = (selector, width, heigth, duration) => {
    let snakeField = writeSlowSnakesOnce(selector,width, heigth);
    setInterval(async () => {
        await snakeField.destroy();
        snakeField = writeSlowSnakesOnce(selector, width, heigth);
    }, duration > 0 ? duration : 30000);
}

export const moveSlowSnakes = {
    writeSlowSnakesOnce, writeSlowSnakesForever
}
