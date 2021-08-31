<template>
    <div class="container">
        <div class="title">
            <logo />
            <h1>WiFi</h1>
        </div>
        <p v-if="!connected && !loading && !selected">
            Networks
        </p>
        <p v-if="!connected && !loading && selected">
            {{ selected.ssid }}
        </p>
        <p v-if="connected && !loading">
            Your device is now connected.
        </p>
        <div v-if="!connected && !loading && !selected" class="networks">
            <div v-if="networks.length > 0" class="list">
                <network v-for="(network, index) in networks" :key="index" :network="network" v-on:click="select(network)" />
            </div>
            <div v-else class="list">
                <div class="empty">No Networks Available</div>
            </div>
        </div>
        <form v-else-if="!connected && !loading && selected" class="security" autocomplete="off">
            <div class="password">
                <input type="password" placeholder="Password" v-model="password" autocomplete="off" data-lpignore="true" />
            </div>
            <div class="actions">
                <div class="button" v-on:click="scan()">Cancel</div>
                <div class="button" v-on:click="validate()">Connect</div>
            </div>
        </form>
        <div v-else-if="!connected" class="loading">
            <spinner />
        </div>
    </div>
</template>

<script>
    import request from "./request";
    import network from "./network.vue";
    import spinner from "./spinner.vue";
    import logo from "./logo.vue";

    export default {
        name: "app",

        components: {
            network,
            spinner,
            logo,
        },

        data() {
            return {
                connected: false,
                loading: true,
                interval: null,
                selected: null,
                password: "",
                networks: [],
                iface: null,
            };
        },

        mounted() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }

            this.scan();
        },

        methods: {
            async scan() {
                this.selected = null;

                if (!this.iface) {
                    this.iface = (((((await request.get("/api/")) || {}).data || {}).devices || []).find((device) => device.type === "wifi") || {}).iface || null;
                }

                const response = await request.get("/api/networks/");
                const data = Array.isArray(response.data) ? response.data : [];

                this.networks = data;
                this.loading = false;

                if (!this.interval) this.interval = setInterval(() => this.scan(), 10 * 1000);
            },

            async connect(ssid, password) {
                if (this.iface) {
                    this.loading = true;

                    await request.post(`/api/${this.iface}/connect/`, { ssid, password });

                    if (((((await request.get("/api/")) || {}).data || {}).connections || []).find((connection) => connection.iface === this.iface && connection.ssid === ssid)) {
                        this.connected = true;
                    } else {
                        this.scan();
                    }

                    this.loading = false;
                }
            },

            validate() {
                if (this.password && this.password !== "") {
                    this.connect(this.selected.ssid, this.password);
                }
            },

            select(selected) {
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }

                if (selected.security.mode && selected.security.mode !== "" && selected.security.mode !== "none") {
                    this.selected = { ...selected };
                } else {
                    this.connect(selected.ssid);
                }
            },
        },
    };
</script>

<style lang="scss">
    @font-face {
        font-family: "Montserrat";
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local("Montserrat Regular"), local("Montserrat-Regular"), url(./assets/montserrat.woff) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
    }

    html {
        height: 100%;
    }

    body {
        margin: 0;
        padding: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #141414;
        font-family: "Montserrat", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 12pt;
        color: #999;
    }

    ::-webkit-scrollbar {
        background-color: #252525;
        width: 4px;
    }

    ::-webkit-scrollbar-track {
        background-color: #252525;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #353535;
        border-radius: 0;
    }

    ::-webkit-scrollbar-button {
        display:none;
    }

    .button {
        height: 40px;
        box-sizing: border-box;
        background: #252525;
        color: #fff !important;
        text-decoration: none !important;
        display: inline-flex;
        align-items: center;
        border: 1px #1a1a1a solid;
        padding: 10.5px 14px 9.5px 14px;
        user-select: none;
        margin: 0 0 0 10px;
        white-space: pre;
        cursor: pointer;

        &:first-child {
            margin: 0;
        }

        &:hover {
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.44), 0 2px 1px -1px rgba(0, 0, 0, 0.42), 0 1px 3px 1px rgba(0, 0, 0, 0.5);
            text-decoration: none !important;
        }
    }

    #portal {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;

        .container {
            flex: 1;
            width: 100%;
            max-width: 790px !important;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 30px 20px;
            font-size: 17px;
            overflow: hidden;

            @media (min-width: 300px) and (max-width: 815px) {
                margin: 0;
                width: 100%;
            }

            .title {
                display: flex;
                align-items: center;
                padding: 0 0 7px 0;
                margin: 0 0 10px 0;
                border-bottom: 1px #252525 solid;
                user-select: none;
            }

            h1 {
                font-size: 20px;
                font-weight: normal;
                padding: 0;
                margin: 2px 0 0 0;
                color: #feb400;
                user-select: none;
            }

            h2 {
                margin: 0 0 5px 0;
                padding: 0;
                font-size: 17px;
                line-height: normal;
                font-size: 22px;
                color: #feb400;
                user-select: none;
            }

            p {
                margin: 0;
                user-select: none;
            }

            .logo {
                border-right: 1px #474747 solid;
            }

            .loading {
                flex: 1;
                display: flex;
                padding: 0 0 50% 0;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
            }

            .security {
                flex: 1;
                margin: 10px 0 0 0;
                overflow: overlay;

                .password {
                    display: flex;
                    flex-direction: row;
                    background: #252525;
                    padding: 20px;

                    input {
                        flex: 1;
                        border: 0 none !important;
                        outline: 0 none !important;
                        background: transparent;
                        font-size: 14px;
                        color: #fff;
                    }
                }

                .actions {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    margin: 14px 0 0 0;
                }
            }

            .networks {
                flex: 1;
                margin: 10px 0 0 0;
                overflow: overlay;

                .list {
                    padding: 5px 20px;
                    background: #252525;
                }

                .network {
                    border-bottom: 1px #474747 solid;

                    &:last-child {
                        border-bottom: 0 none;
                    }
                }

                .empty {
                    padding: 20px 10px;
                    color: #fff;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    user-select: none;
                    cursor: default;
                    opacity: 0.5;

                    @media (min-width: 300px) and (max-width: 815px) {
                        font-size: 15px;
                    }
                }
            }
        }
    }
</style>
