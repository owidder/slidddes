import {SnakeField} from './SnakeField';

const S = "s"
const N = "n"
const W = "w"
const E = "e"

const s = (snakeField, id, x, y) => {
    const _s = [W, W, W, S, S, E, E, E, S, S, W, W, W];
    snakeField.registerAndCommands(id + "-s", x+3, y, _s, 1000);
}

const l = (snakeField, id, x, y) => {
    const _l = [S, S, S, S, E, E, E];
    snakeField.registerAndCommands(id + "-l", x, y, _l, 1000);
}

const o = (snakeField, id, x, y) => {
    const _o = [E, E, E, S, S, S, S, W, W, W, N, N, N];
    snakeField.registerAndCommands(id + "-o", x, y, _o, 1000);
}

const w = (snakeField, id, x, y) => {
    const _w1 = [S, S, S, S, E, E, E, E, N, N, N, N];
    snakeField.registerAndCommands(id + "-w1", x, y, _w1, 1000);

    const _w2 = [N, N];
    snakeField.registerAndCommands(id + "-w2", x+2, y+3, _w2, 1000);
}

const n = (snakeField, id, x, y) => {
    const _n = [N, N, N, N, E, E, S, S, S, S, E, E, N, N, N, N];
    snakeField.registerAndCommands(id + "n", x, y+4, _n, 1000);
}

const a = (snakeField, id, x, y) => {
    const _a1 = [N, N, N, N, E, E, E, S, S, S, S];
    snakeField.registerAndCommands(id + "a1", x, y+4, _a1, 1000);

    const _a2 = [E];
    snakeField.registerAndCommands(id + "a2", x+1, y+3, _a2, 1000);
}

const k = (snakeField, id, x, y) => {
    const _k1 = [S, S, S, S];
    snakeField.registerAndCommands(id + "k1", x, y, _k1, 1000);

    const _k2 = [E, E, N];
    snakeField.registerAndCommands(id + "k2", x+1, y+1, _k2, 1000);

    const _k3 = [E, E, S];
    snakeField.registerAndCommands(id + "k3", x+1, y+3, _k3, 1000);
}

const e = (snakeField, id, x, y) => {
    const _e1 = [W, W, W, S, S, S, S, E, E, E];
    snakeField.registerAndCommands(id + "e1", x+3, y, _e1, 1000);

    const _e2 = [E];
    snakeField.registerAndCommands(id + "e2", x+1, y+2, _e2, 1000);
}

export const snakeForms = {
    a, e, k, l, n, o, s, w,
}