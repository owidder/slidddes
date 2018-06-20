import Radars from './Radars';
import {setPositionRotation, TYPE_RING} from '../ar/arPositions';
import {init} from '../ar/argonApp';

export const initRadars = () => {
    const {root} = init();
    const radars = new Radars(250);
    const radarSvgs = radars.draw();
    radarSvgs.each(function (d, i) {
        setPositionRotation(this, root, TYPE_RING, i, radars.numberOfRadars())
    });
}
