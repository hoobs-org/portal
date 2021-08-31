const network = require("@hoobs/network");

class Ethernet {
    constructor(app) {
        app.post("/api/:iface/up", (request, response) => this.connect(request, response));
        app.post("/api/:iface/down", (request, response) => this.disconnect(request, response));
    }

    connect(request, response) {
        network.ethernet.up(request.params.iface);
        response.send();
    }

    disconnect(request, response) {
        network.ethernet.down(request.params.iface);
        response.send();
    }
}

module.exports = (app) => new Ethernet(app);
