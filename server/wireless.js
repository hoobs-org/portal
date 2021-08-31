const network = require("@hoobs/network");
const command = require("@hoobs/network/lib/command");

class Wireless {
    constructor(app) {
        app.get("/api/networks", (_request, response) => this.networks(response));
        app.post("/api/wireless/enable", (_request, response) => this.state(true, response));
        app.post("/api/wireless/disable", (_request, response) => this.state(false, response));
        app.post("/api/:iface/connect", (request, response) => this.connect(request, response));
        app.post("/api/:iface/disconnect", (request, response) => this.disconnect(request, response));
    }

    networks(response) {
        if (network.wireless.enabled) {
            response.send(network.wireless.scan());
        } else {
            response.send();
        }
    }

    state(enabled, response) {
        network.wireless.enabled = enabled;

        response.send();
    }

    connect(request, response) {
        if (network.wireless.enabled) {
            network.wireless.connect(request.body.ssid, request.body.password, request.params.iface);

            if (network.wireless.current().find((connection) => connection.ssid === request.body.ssid)) {
                if (network.hotspot.running) {
                    network.hotspot.stop();

                    command.exec("nmcli", "device", "reapply", `'${(request.params.iface || "").replace(/'/gi, "'\"'\"'")}'`);
                }

                process.exit();
            } else if (network.hotspot.running) {
                network.hotspot.stop();
                network.wireless.disconnect("wlan0");
                network.hotspot.start("HOOBS", "wlan0");
            }
        }

        response.send();
    }

    disconnect(request, response) {
        if (network.wireless.enabled) {
            network.wireless.disconnect(request.params.iface);
            network.wireless.forget(request.body.ssid);
        }

        response.send();
    }
}

module.exports = (app) => new Wireless(app);
