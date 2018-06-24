export const round = (num, digits) => {
    const factor = Math.pow(10, digits);

    return Math.round(num * factor) / factor;
}

export const multiplyPosition = (position, factor = 1.0) => {
    return {
        x: position.x * factor,
        y: position.y * factor,
        z: position.z * factor
    };
}

export const math = {
    round, multiplyPosition
}
