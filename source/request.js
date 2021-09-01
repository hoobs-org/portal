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

import axios from "axios";

const MAX_REQUESTS_COUNT = 5;
const INTERVAL_MS = 10;

let PENDING_REQUESTS = 0;

const request = axios.create({});

request.interceptors.request.use((config) => (new Promise((resolve) => {
    const interval = setInterval(() => {
        if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
            PENDING_REQUESTS += 1;

            clearInterval(interval);
            resolve(config);
        }
    }, INTERVAL_MS);
})));

request.interceptors.response.use((response) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);

    return Promise.resolve(response);
}, (error) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);

    return Promise.reject(error);
});

export default request;
