import * as d3 from 'd3';

import {classUtil} from './classUtil';
import {highlight} from './highlight';
import {tooltip} from './tooltip';
import {steps} from './steps';
import {showCode} from './showCode';
import {createElement} from './createElement';
import {cube} from './cube';
import {canvas} from './canvas';
import {demo} from './demo';
import {positionRotation} from './positionRotation';
import {slidarGlobal} from './slidarGlobal';
import {math} from '../../util/mathUtil';
import {qrUtil} from '../../util/qrutil';
import {counter} from './flipcounter/counter';
import {SvgField} from './snakes/SvgField';
import {SnakeField} from './snakes/SnakeField';
import {snakeForms} from './snakes/SnakeForms';
import {moveSlowSnakes} from './snakes/moveSlowSnakes';
import {glowText} from './coolText/GlowText';
import {scripts} from './scripting/scripts';
import {totalRewards} from '../slowSnakes/TotalRewards';
import {title} from './coolText/Title';
import {rinkeby} from '../slowSnakes/Rinkeby';
import {initPhase} from './initPhase';

const coolText = {
    glowText, title
}

const slowSnakes = {
    moveSlowSnakes, rinkeby, totalRewards, SvgField, SnakeField, snakeForms
}

export const slidAR = {
    d3,
    classUtil,
    highlight,
    tooltip,
    steps,
    showCode,
    createElement,
    cube,
    canvas,
    demo,
    positionRotation,
    slidarGlobal,
    math,
    qrUtil,
    counter,
    coolText,
    scripts,
    slowSnakes,
    initPhase,
};

