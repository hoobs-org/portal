<template>
    <div class="network">
        <div class="ssid">{{ network.ssid }}</div>
        <signal :quality="network.quality" :secure="network.security.mode && network.security.mode !== '' && network.security.mode !== 'none'" />
        <chevron class="chevron" />
    </div>
</template>

<script>
    import signal from "./signal.vue";
    import chevron from "./chevron.vue";

    export default {
        name: "network",

        components: {
            signal,
            chevron,
        },

        props: {
            network: {
                type: Object,
                required: true,
            },
        },
    };
</script>

<style lang="scss" scoped>
    .network {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 20px 10px;
        user-select: none;
        cursor: pointer;

        .ssid {
            flex: 1;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            opacity: 0.5;

            @media (min-width: 300px) and (max-width: 815px) {
                font-size: 15px;
            }
        }

        .chevron {
            opacity: 0.5;
        }

        &:hover {
            .ssid {
                opacity: 1;
            }

            .chevron {
                opacity: 1;
            }
        }
    }
</style>
