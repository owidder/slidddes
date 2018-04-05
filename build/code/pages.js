/* global simplAR */

(function () {
    function init() {
        if (window.location.href.indexOf("qrTarget") > 1) {

            // check for qr-code defined param
            const target = simplAR.paramValue("qrTarget");

            switch (target) {
                case "logo":
                    window._pages = [
                        {id: "html1", name: "logo/logo1.html"},
                        {id: "html2", name: "logo/logo2.html"},
                        {id: "html3", name: "logo/logo3.html"},
                        {id: "html4", name: "logo/logo4.html"},
                        {id: "html5", name: "logo/logo5.html"},
                        {id: "html6", name: "logo/logo6.html"},
                        {id: "html7", name: "logo/logo7.html"},
                    ];
                    break;
                case "schedule":
                    window._pages = [
                        {id: "schedule", name: "schedule/schedule.html"}
                    ];
                    break;
                case "stocks":
                    window._pages = [
                        {id: "html1", name: "stocks/lufthansa.html"},
                        {id: "html2", name: "stocks/microsoft.html"},
                        {id: "html3", name: "stocks/prosiebensat1.html"},
                        {id: "html4", name: "stocks/google.html"},
                        {id: "html5", name: "stocks/facebook.html"},
                        {id: "html6", name: "stocks/adidas.html"},
                        {id: "html7", name: "stocks/bmw.html"},
                        {id: "html8", name: "stocks/daimler.html"},
                        {id: "html9", name: "stocks/bahn.html"}
                    ];
                    break;
                default:
                    console.log("qrTarget-parameter " + target + " did not match!");
                // do nothing
            }
        }
        else {
            window._pages = [
                {id: "html1", name: "html1.html"},
                {id: "html2", name: "html2.html"},
                {id: "html3", name: "html3.html"},
                {id: "html4", name: "html4.html"},
                {id: "html5", name: "html5.html"},
                {id: "html6", name: "html6.html"},
                {id: "html7", name: "html7.html"},
                {id: "html8", name: "html8.html"},
                {id: "html9", name: "html9.html"},
            ];
        }
    }

    window._pagesinit = init;

})()
