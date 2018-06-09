import * as _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './GlowText.css';

const renderLines = (lines, type = "") => {
    return lines.map((line, i) => {
        return (
            <span key={"glow-line-" + i}>
                <span className={"glow " + type}>{line}</span>
                <br/>
            </span>
        )
    })
}

class GlowText extends Component {

    render() {
        return (
            <div className="GlowText">
                {renderLines(this.props.lines, this.props.type)}
            </div>
        )
    }
}

GlowText.propTypes = {
    text: PropTypes.string,
    lines: PropTypes.array,
    type: PropTypes.string
}

const create = (selector, lines, type) => {
    ReactDOM.render(<GlowText lines={lines} type={type}/>, document.querySelector(selector));
}

export const glowText = {
    create
}