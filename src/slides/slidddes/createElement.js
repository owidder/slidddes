import * as $ from 'jquery';

const vsprintf = require('sprintf-js').vsprintf;

export const div = (selector, id, classes, text) => {

    const htmlString = vsprintf("<div id='%s' class='%s'>%s</div>", [id, classes.join(" "), text]);
    $(selector).append(htmlString);
}

export const remove = (selector) => {
    $(selector).remove();
}

export const divStep = (selector, id, classes, text) => {
    return {
        f: () => div(selector, id, classes, text),
        b: () => remove("#" + id)
    }
}

export const createElement = {
    div,
    remove,
    divStep
}