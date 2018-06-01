import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './GlowText.css';

const renderLines = (lines) => {
    return lines.map((line, i) => {
        return (
            <span key={"glow-line-" + i}>
                <span className="glow">{line}</span>
                <br/>
            </span>
        )
    })
}

class GlowText extends Component {

    render() {
        return (
            <div className="GlowText">
                {renderLines(this.props.lines)}
            </div>
        )
    }
}

GlowText.propTypes = {
    text: PropTypes.string,
    lines: PropTypes.array
}

const create = (selector, lines) => {
    ReactDOM.render(<GlowText lines={lines}/>, document.querySelector(selector));
}

export const glowText = {
    create
}