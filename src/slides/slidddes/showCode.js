import * as $ from 'jquery';

import {createReverseStep} from './steps';

const vsprintf = require('sprintf-js').vsprintf;

const Prism = require('prismjs');

export const putIntoPre = (language, html) => {
    return vsprintf('<pre class="language-%s">%s</pre>', [language, html]);
}

export const css = (selector, cssString) => {
    const html = Prism.highlight(cssString, Prism.languages.css);
    const withPre = putIntoPre("css", html);
    $(selector).html(withPre);
}

export const js = (selector, jsString) => {
    const html = Prism.highlight(jsString, Prism.languages.javascript);
    const withPre = putIntoPre("javascript", html);
    $(selector).html(withPre);
}

export const remove = (selector) => {
    $(selector).empty();
}

export const cssStep = (selector, cssString) => {
    return {
        f: () => css(selector, cssString),
        b: () => remove(selector)
    }
}

export const jsStep = (selector, jsString) => {
    return {
        f: () => js(selector, jsString),
        b: () => remove(selector)
    }
}

export const cssStepWithReverse = (selector, cssString) => {
    const step = cssStep(selector, cssString);
    return createReverseStep(step);
}

export const jsStepWithReverse = (selector, jsString) => {
    const step = jsStep(selector, jsString);
    return createReverseStep(step);
}

export const showCode = {
    css,
    js,
    remove,
    cssStep,
    cssStepWithReverse,
    jsStep,
    jsStepWithReverse
}
