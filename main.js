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
const program = require("commander");
const pjson = require("./package.json");
const log = require("./server/logger")();
const server = require("./server")(log);

function daemon() {
    program.version(pjson.version, "-v, --version", "output the current version");
    program.option("-d, --debug", "turn on debug level logging", () => { log.debugging = true; });

    program.command("start", { isDefault: true })
        .description("start the portal service")
        .option("-p, --port <port>", "change the port the portal runs on")
        .action((command) => {
            if (!network.connected) server.start(command.port);
        });

    program.parse(process.argv);
}

function teardown() {
    if (server) server.stop();
}

process.on("exit", teardown);
process.on("SIGINT", teardown);
process.on("SIGTERM", teardown);
process.on("SIGUSR1", teardown);
process.on("SIGUSR2", teardown);

module.exports = daemon;
