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
