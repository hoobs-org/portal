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

const http = require("http");
const express = require("express");
const network = require("@hoobs/network");
const compression = require("compression");
const { createHttpTerminator } = require("http-terminator");
const { join } = require("path");

class Server {
    constructor(log) {
        this.log = log;
        this.running = false;

        const app = express();

        app.use(compression());
        app.use(express.json());
        app.disable("x-powered-by");

        this.server = http.createServer(app);
        this.listner = createHttpTerminator({ server: this.server });

        app.use((request, _response, next) => {
            this.log.debug(`request [${request.method}] ${request.url}`);

            next();
        });

        app.use("/", express.static(join(__dirname, "../interface"), {
            setHeaders: (response) => { response.setHeader("cache-control", "public, max-age=1209600000"); },
        }));

        require("./network")(app);
        require("./ethernet")(app);
        require("./wireless")(app);
        require("./hotspot")(app);

        app.use((_request, response) => response.redirect("/"));
    }

    start(port) {
        network.wireless.enabled = true;

        this.log.info("starting portal");

        this.server.listen(parseInt(port, 10) || 80, () => {
            this.running = true;

            network.wireless.disconnect("wlan0");
            network.hotspot.start("HOOBS", "wlan0");

            this.log.info(`listening on port ${parseInt(port, 10) || 80}`);
        });
    }

    stop() {
        if (this.running) {
            this.running = false;

            this.log.info("shutting down portal");

            network.hotspot.stop();

            this.listner.terminate().then(() => this.log.info("stopped"));
        }
    }
}

module.exports = (log) => new Server(log);
