import QRCode from 'qrcode';

const getCurrentAddressWithRemoveText = (removeText) => {
    const url = window.location.href;
    const urlWithRemoveText = url.replace(removeText, "");

    return urlWithRemoveText;
}

export const qrCurrentAddress = (selector, removeText) => {
    const address = getCurrentAddressWithRemoveText(removeText);
    makeQrCode(selector, address);
    return address;
}

export const makeQrCode = (selector, text) => {
    const element = document.querySelector(selector);
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    QRCode.toCanvas(canvas, text);
}

export const qrUtil = {
    makeQrCode, qrCurrentAddress
}