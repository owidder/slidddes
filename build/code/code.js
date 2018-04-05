/* global simplAR */

(function () {

    function init() {
        simplAR.initAr();

        const type = simplAR.firstParamSet(["ring", "table", "helix", "sphere", "random"]);
        const radius = simplAR.paramValue("radius");
        switch(type) {
            case "ring":
                simplAR.ring(radius);
                break;

            case "helix":
                simplAR.helix();
                break;

            case "sphere":
                simplAR.sphere(radius);
                break;

            case "random":
                simplAR.sphereRandom(100);
                break;

            default:
                simplAR.table(3, 600, 200, 0, 500);
                break;

        }

        const interval = simplAR.paramValue(type) || 2000;

        simplAR.initTween();

        if(interval > 0) {
            setInterval(function () {
                simplAR.rotate();
            }, interval)
        }

        receiveMessages();
    }

    /* global d3 */

    function changeText(number, text) {
        var page = d3.select(".html" + number + ".title");

        var divs = page.selectAll(".char.font-effect-anaglyph")
            .data(text.split(''));

        divs.enter()
            .append("div")
            .attr("class", "char font-effect-anaglyph")
            .merge(divs)
            .text(function(d) {
                return d;
            });

        divs.exit().remove();
    }

    function sendPosition(socket, pageId) {
        const position = simplAR.getPosition(pageId);
        simplAR.send(socket, JSON.stringify(position));
    }

    function sendRotation(socket, pageId) {
        const rotation = simplAR.getRotation(pageId);
        simplAR.send(socket, JSON.stringify(rotation));
    }

    function setPosition(pageId, newPositionStr, duration) {
        const newPosition = JSON.parse(newPositionStr);
        simplAR.toPosition(pageId, newPosition, duration);
    }

    function setRotation(pageId, newRotationStr, duration) {
        const newRotation = JSON.parse(newRotationStr);
        simplAR.toRotation(pageId, newRotation, duration);
    }

    function receiveMessages() {
        let socket;

        function onMessage(messageString) {
            var parts = messageString.split(";");
            if(parts.length > 1) {
                switch (parts[0]) {
                    case "text":
                        changeText(parts[1], parts[2]);
                        break;

                    case "getpos":
                        sendPosition(socket, parts[1]);
                        break;

                    case "getrot":
                        sendRotation(socket, parts[1]);
                        break;

                    case "setpos":
                        setPosition(parts[1], parts[2], parts[3]);
                        break;

                    case "setrot":
                        setRotation(parts[1], parts[2], parts[3]);
                        break;
                }
            }
        }

        socket = simplAR.connect(onMessage);
    }

    window._startcode = init;

})();
