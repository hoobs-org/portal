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
            server.start(command.port);
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
