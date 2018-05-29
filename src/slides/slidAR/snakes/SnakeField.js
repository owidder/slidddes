import * as _ from 'lodash';
import {SvgField} from './SvgField';

export class SnakeField {

    constructor(selector, width, height) {
        this.svgField = new SvgField(selector, width, height);

        this.snakes = {};
    }

    destroy() {
        return this.svgField.removeSvg();
    }

    register(id, x, y) {
        const position = {id, x, y};
        this.newPosition(position);
    }

    newPosition(position) {
        this.snakes[position.id] = position;
        this.svgField.newPosition(position);
        this.svgField.newHeads(this.snakes);
    }

    north(id) {
        const {x, y} = this.snakes[id];
        this.newPosition({id, x, y: y-1});
    }

    south(id) {
        const {x, y} = this.snakes[id];
        this.newPosition({id, x, y: y+1});
    }

    west(id) {
        const {x, y} = this.snakes[id];
        this.newPosition({id, y, x: x-1});
    }

    east(id) {
        const {x, y} = this.snakes[id];
        this.newPosition({id, y, x: x+1});
    }

    command(id, cmd) {
        switch (cmd) {
            case "n":
                this.north(id);
                break;

            case "s":
                this.south(id);
                break;

            case "w":
                this.west(id);
                break;

            case "e":
                this.east(id);
                break;

            default:
                // do nothing
        }
    }

    _doCommandRecusive(id, cmds, duration, index) {
        this.command(id, cmds[index]);
        if(index+1 < cmds.length) {
            setTimeout(() => {
                this._doCommandRecusive(id, cmds, duration, index+1);
            }, duration);
        }
    }

    commands(id, cmds, duration) {
        this._doCommandRecusive(id, cmds, duration, 0);
    }

    registerAndCommands(id, x, y, cmds, duration) {
        const startDuration = _.random(1000, 2000);
        setTimeout(() => {
            this.register(id, x, y);
            setTimeout(() => {
                this.commands(id, cmds, duration);
            }, duration);
        }, startDuration);
    }
}