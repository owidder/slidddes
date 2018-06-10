import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {makeQrCode} from '../../util/qrutil';

import './Rinkeby.css';

export class Rinkeby extends Component {

    componentDidMount() {
        makeQrCode(".rinkeby .qr", "https://rinkeby.etherscan.io/address/0x7c8665a2697d0c178585e7ebeeab77e1a9932ee9");
    }

    render() {
        return (
            <div className="rinkeby">
                <h1>Contract on the Rinkeby testnet</h1>
                <div className="qr"></div>
            </div>
        )
    }
}

const create = (selector) => {
    ReactDOM.render(
        <Rinkeby/>,
        document.querySelector(selector)
    )
}

export const rinkeby = {
    create
}