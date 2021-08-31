const network = require("@hoobs/network");

class Hotspot {
    constructor(app) {
        app.post("/api/hotspot/start", (request, response) => this.start(request, response));
        app.post("/api/hotspot/stop", (_request, response) => this.stop(response));
    }

    start(request, response) {
        if (!network.hotspot.running && network.wireless.enabled) {
            network.wireless.disconnect(((network.devices() || []).find((device) => device.type === "wifi") || {}).iface);
            network.hotspot.start(request.body.ssid || "HOOBS");
        }

        response.send();
    }

    stop(response) {
        network.hotspot.stop();
        response.send();
    }
}

module.exports = (app) => new Hotspot(app);
