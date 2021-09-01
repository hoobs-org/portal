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

class Logger {
    constructor() {
        this.debugging = false;
        this.output = console.log;
        this.errors = console.error;
    }

    info(message, ...args) {
        this.print(...[message, ...args]);
    }

    debug(message, ...args) {
        if (this.debugging) this.print(...[message, ...args]);
    }

    error(message, ...args) {
        this.errors(message, ...args);
    }

    print(...args) {
        const now = (new Date()).toLocaleTimeString();
        const today = (new Date()).toLocaleDateString();

        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] === "string") {
                const lines = args[i].toString().split("\n").map((line) => line.trim()).filter((line) => line !== "");

                for (let j = 0; j < lines.length; j++) {
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    process.stdout.write(`[${today} ${now}] ${lines[j]}\n`);
                }
            } else {
                this.output(args[i]);
            }
        }
    }
}

module.exports = () => new Logger();
