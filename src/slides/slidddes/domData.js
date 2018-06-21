import * as _ from 'lodash';

export const addDataToDomElement = (domElement, data) => {
    if(_.isEmpty(domElement._slidddes)) {
        domElement._slidddes = {...data};
    }
    else {
        domElement._slidddes = {...domElement._slidddes, ...data};
    }
}

export const getDomData = (domElement, data) => {
    if(!_.isObject(domElement._slidddes)) {
        domElement._slidddes = {};
    }
    return domElement._slidddes;
}

export const addAttributeToDomElement = (domElement, attributeName, value) => {
    addDataToDomElement(domElement, {[attributeName]: value});
}

export const getAttributeFromDomElement = (domElement, attributeName) => {
    return getDomData(domElement)[attributeName];
}
