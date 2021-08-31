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

        app.use("/", express.static(join(__dirname, "../portal"), {
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
