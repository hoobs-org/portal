const { resolve, join } = require("path");

module.exports = {
    outputDir: resolve(__dirname, "./portal"),

    configureWebpack: {
        performance: {
            hints: false,
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
                maxInitialRequests: Infinity,
                minSize: 0,
                maxSize: 10000,
            },
        },
    },

    chainWebpack: (config) => {
        config.performance.maxEntrypointSize(400000).maxAssetSize(400000);
        config.entry("app").clear().add("./interface/main.js").end();
        config.resolve.alias.set("@", join(__dirname, "./interface"));

        config.plugin("html").tap((args) => {
            const payload = args;

            payload[0].title = "HOOBS";

            return payload;
        });
    },
};
