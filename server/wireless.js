/**************************************************************************************************
 * hoobs-portal                                                                                   *
 * Copyright (C) 2021 HOOBS                                                                       *
 *                                                                                                *
 * This program is free software: you can redistribute it and/or modify                           *
 * it under the terms of the GNU General Public License as published by                           *
 * the Free Software Foundation, either version 3 of the License, or                              *
 * (at your option) any later version.                                                            *
 *                                                                                                *
 * This program is distributed in the hope that it will be useful,                                *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of                                 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                                  *
 * GNU General Public License for more details.                                                   *
 *                                                                                                *
 * You should have received a copy of the GNU General Public License                              *
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.                          *
 **************************************************************************************************/

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
