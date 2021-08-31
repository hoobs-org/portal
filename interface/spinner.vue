<template>
    <div v-if="display" class="spinner">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.46 283.46" xml:space="preserve">
            <defs>
                <marker class="marker" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
                    <circle cx="5" cy="5" r="1.5" stroke-width="3" />
                </marker>
            </defs>
            <path class="fill" d="M262.46,134.8l-27.73-27.73c-2.21-2.21-3.48-5.27-3.48-8.38V47.87c0-6.54-5.32-11.86-11.86-11.86h-13.74 c-6.54,0-11.86,5.32-11.86,11.86v18.24L148.4, 22.18c-4.63-4.49-12.1-4.41-16.65,0.14L21.78,132.29c-4.63,4.62-4.66,12.13,0,16.79 l10.44,10.44c4.58,4.59,12.09,4.62,16.72,0.07l84.54-83.28c4.64-4.56, 12.14-4.53,16.73,0.07l82.83,82.85 c4.62,4.63,4.62,12.16,0,16.79l-10.18,10.18c-4.57,4.55-12.04,4.61-16.65,0.12l-58.15-56.49c-4.64-4.5-12.12-4.45-16.68, 0.14 l-55.85,56.11c-4.61,4.62-4.59,12.15,0.02,16.76l10.33,10.33c4.6,4.6,12.1,4.62,16.73,0.04l30.1-29.74 c4.6-4.54,12.06-4.55,16.66-0.02l29.92, 29.4c4.71,4.62,4.73,12.19,0.07,16.85l-35.73,35.73" marker-end="url(#circlecap)" marker-start="url(#circlecap)" />
        </svg>
    </div>
</template>

<script>
    export default {
        name: "spinner",

        data() {
            return {
                display: false,
            };
        },

        mounted() {
            setTimeout(() => {
                this.display = true;
            }, 500);
        },
    };
</script>

<style lang="scss" scoped>
    @keyframes loading {
        to {
            stroke-dashoffset: 1166 * 1.1;
        }
    }

    .spinner {
        display: inline-flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        user-select: none;

        svg {
            width: 47px;
            height: 47px;

            .fill {
                fill: none;
                stroke: #feb400;
                stroke-width: 15.225;
                stroke-linecap: round;
                stroke-dasharray: (1166 * .9) (1166 * .1);
                stroke-dashoffset: (1166 * .1);
                animation: loading 2s linear infinite;
            }

            .marker {
                fill: #feb400;
            }
        }
    }
</style>
