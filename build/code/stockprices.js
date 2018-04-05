/* global simplAR */

(function () {

    function init() {
        simplAR.initAr();

        const type = simplAR.firstParamSet(["ring", "table", "helix", "sphere", "random"]);
        switch (type) {
            case "ring":
                simplAR.ring();
                break;

            case "helix":
                simplAR.helix();
                break;

            case "sphere":
                simplAR.sphere();
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

        setInterval(function () {
            simplAR.rotate();
        }, interval)

        receiveMessages();
    }

    /* global d3 */

    function receiveMessages() {
        function onMessage(messageString) {
            const received = JSON.parse(messageString);

            try {
                const updated = received.updated;
                const trend = received.trend;
                const amount = received.value.amount + " " + received.value.currency;

                document.getElementById("company-" + received.id).innerHTML = received.company;
                document.getElementById("updated-" + received.id).innerHTML = updated;
                document.getElementById("value-" + received.id).innerHTML = amount;
                document.getElementById("shift-" + received.id).innerHTML = received.shift;
                document.getElementById("shift-" + received.id).style.cssText = received.shift > 0 ? "color: green" : "color: red";
                document.getElementById("trend-" + received.id).innerHTML = trend + " %";
                document.getElementById("trend-" + received.id).style.cssText = received.trend > 0 ? "color: green" : "color: red";
            } catch
                (error) {
                console.log(error);
            }
        }
        simplAR.connect(onMessage);
    }

    window._startticker = init;
})();
