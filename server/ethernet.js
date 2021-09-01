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
