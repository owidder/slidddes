import * as d3 from 'd3';
import * as $ from 'jquery';

import './hudUtil.css';

import {slidarGlobal} from '../slides/slidAR/slidarGlobal';

export const addLeftRightButtons = (hudSelector, onLeftClick, onRightClick) => {
    $(hudSelector).empty();

    if(slidarGlobal.withAr) {
        const menu = d3.selectAll(hudSelector)
            .append("div")
            .attr("class", "menu _hudmenu")

        addHudButton(menu, "lefthud", "arrow_back", onLeftClick);
        menu.append("div")
            .attr("class", "leftright")
            .append("text")
            .text("Press left-/right arrow keys or click on the arrow-buttons")
        addHudButton(menu, "righthud", "arrow_forward", onRightClick);
    }
}

export const addHudButton = (parent, classname, materialIcon, onClick) => {
    const button = parent.append("button")
        .attr("class", classname)
        .on("click", onClick)

    button.append("i")
        .attr("class", "material-icons")
        .text(materialIcon)
}

export const init = (selector, hud) => {
    const hudContainer = document.querySelector(selector);
    hud.hudElements[0].appendChild(hudContainer);
}
