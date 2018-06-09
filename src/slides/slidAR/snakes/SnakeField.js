import * as _ from 'lodash';
import {SvgField} from './SvgField';
import {slidarGlobal} from '../slidarGlobal';
import {scripts} from '../scripting/scripts';

const defaultSize = () => {
    return Math.min(slidarGlobal.width, slidarGlobal.height) * .9;
}

export class SnakeField {

    constructor(slideId, selector, width, height, dimX, dimY) {
        this.slideId = slideId;
        this.selector = selector;
        this.width = width > 0 ? width : defaultSize();
        this.height = height > 0 ? height : this.width;
        this.dimX = dimX;
        this.dimY = dimY;

        this.svgField = new SvgField(selector, this.width, this.height, dimX, dimY);

        this.snakes = {};
    }

    clear(parentSelector) {
        this.svgField.clear(parentSelector);
    }

    clearSnakes() {
        this.snakes = {};
        this.svgField.clearRects();
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

    move(id, diffX, diffY) {
        if(!_.isUndefined(this.snakes[id])) {
            const {x, y} = this.snakes[id];
            this.newPosition({id, x: x+diffX, y: y+diffY});
        }
    }

    north(id) {
        this.move(id, 0, -1);
    }

    south(id) {
        this.move(id, 0, +1);
    }

    west(id) {
        this.move(id, -1, 0);
    }

    east(id) {
        this.move(id, +1, 0);
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

    _doCommandRecursive(id, cmds, duration, index, stoppedObj) {
        this.command(id, cmds[index]);
        if(index+1 < cmds.length) {
            if(stoppedObj.stopped) return;
            setTimeout(() => {
                this._doCommandRecursive(id, cmds, duration, index+1, stoppedObj);
            }, duration);
        }
    }

    commands(id, cmds, duration) {
        const stoppedObj = {stopped: false};
        scripts.registerStopFunction(this.slideId, () => {
            stoppedObj.stopped = true;
        })
        this._doCommandRecursive(id, cmds, duration, 0, stoppedObj);
    }

    registerAndCommands(id, x, y, cmds, duration) {
        const startDuration = _.random(1000, 2000);
        let stopped = false;
        setTimeout(() => {
            if(stopped) return;
            this.register(id, x, y);
            setTimeout(() => {
                if(stopped) return;
                this.commands(id, cmds, duration);
            }, duration);
        }, startDuration);

        scripts.registerStopFunction(this.slideId, () => {
            stopped = true;
        })
    }
}