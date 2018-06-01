import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './Title.css';

export class Title extends Component {

    render() {
        return (
            <div className="title-component">
                <h1>{this.props.text}</h1>
            </div>
        )
    }
}

Title.propTypes = {
    text: PropTypes.string
}

const create = (selector, text) => {
    ReactDOM.render(
        <Title text={text}/>,
        document.querySelector(selector)
    )
}

export const title = {
    create
}