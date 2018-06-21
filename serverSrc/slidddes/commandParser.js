function parse(command) {

    const parts = command.split(' ').filter(function (part) {
        return part !== ' ';
    });

    return {
        command: parts.length > 0 ?  parts[0] : "",
        argument: parts.length > 1 ?  parts[1] : ""
    }
}

module.exports = {parse};
