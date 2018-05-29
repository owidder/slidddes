import * as _ from 'lodash';
import {guid} from '../../../util/random';

const S = "s"
const N = "n"
const W = "w"
const E = "e"

const randomDuration = () => {
    return _.random(500, 1500);
}

const _id = (id) => {
    return id + "-" + guid();
}

const s = (snakeField, id, x, y) => {
    const _s = [W, W, W, S, S, E, E, E, S, S, W, W, W];
    snakeField.registerAndCommands(_id(id), x+3, y, _s, randomDuration());
}

const l = (snakeField, id, x, y) => {
    const _l = [S, S, S, S, E, E, E];
    snakeField.registerAndCommands(_id(id), x, y, _l, randomDuration());
}

const o = (snakeField, id, x, y) => {
    const _o = [E, E, E, S, S, S, S, W, W, W, N, N, N];
    snakeField.registerAndCommands(_id(id), x, y, _o, randomDuration());
}

const w = (snakeField, id, x, y) => {
    const _w1 = [S, S, S, S, E, E, E, E, N, N, N, N];
    snakeField.registerAndCommands(_id(id), x, y, _w1, randomDuration());

    const _w2 = [N, N];
    snakeField.registerAndCommands(_id(id), x+2, y+3, _w2, randomDuration());
}

const n = (snakeField, id, x, y) => {
    const _n = [N, N, N, N, E, E, S, S, S, S, E, E, N, N, N, N];
    snakeField.registerAndCommands(_id(id), x, y+4, _n, randomDuration());
}

const a = (snakeField, id, x, y) => {
    const _a1 = [N, N, N, N, E, E, E, S, S, S, S];
    snakeField.registerAndCommands(_id(id), x, y+4, _a1, randomDuration());

    const _a2 = [E];
    snakeField.registerAndCommands(_id(id), x+1, y+3, _a2, randomDuration());
}

const k = (snakeField, id, x, y) => {
    const _k1 = [S, S, S, S];
    snakeField.registerAndCommands(id + "k1", x, y, _k1, randomDuration());

    const _k2 = [E, E, N];
    snakeField.registerAndCommands(id + "k2", x+1, y+1, _k2, randomDuration());

    const _k3 = [E, E, S];
    snakeField.registerAndCommands(id + "k3", x+1, y+3, _k3, randomDuration());
}

const e = (snakeField, id, x, y) => {
    const _e1 = [W, W, W, S, S, S, S, E, E, E];
    snakeField.registerAndCommands(id + "e1", x+3, y, _e1, randomDuration());

    const _e2 = [E];
    snakeField.registerAndCommands(id + "e2", x+1, y+2, _e2, randomDuration());
}

export const snakeForms = {
    a, e, k, l, n, o, s, w,
}