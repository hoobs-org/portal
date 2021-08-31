const network = require("@hoobs/network");

class Network {
    constructor(app) {
        app.get("/api", (_request, response) => this.status(response));
    }

    status(response) {
        response.send({
            connected: network.connected,
            connections: network.current(),
            wireless: network.wireless.enabled,
            hotspot: network.hotspot.status,
            devices: network.devices(),
        });
    }
}

module.exports = (app) => new Network(app);
