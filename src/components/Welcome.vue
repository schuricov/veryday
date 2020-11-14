<template>
    <transition name="welcome-modal-fade">
        <div class="welcome-modal-backdrop">
            <div class="welcome-modal-wrap">

                <div class="welcome-modal-wrap__image-holder">
                    <img style="height: 30%; margin-top: 0%" class="welcome-modal-wrap__image" src="../assets/logo_very_day.png">
<!--                        <img style="height: 30%; margin-top: 75%" src="../assets/planeta_logo_2.jpg">-->
                </div>
                <div class="welcome-modal-wrap__status-holder">
<!--                    {{serviceInfo}}-->
                  We try our best...
                </div>

            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'welcome',
        data() {
            return {
                // serviceInfo: 'Loading...',
            }
        },
        props: {
            serviceInfo: {required: true},
        },
        mounted() {

        },
        methods: {

        },
    };
</script>

<style>
    div {
        /*border: solid 1px #edecee;*/
    }

    .welcome-modal-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        /* background-color: rgb(255, 214, 0); */
        /*background-color: rgb(17, 18, 62);*/
        /*background-color: #fedb1a;*/
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .welcome-modal-wrap {
        /* width: 20%; */
        height: 100%;
        display: table;
        width: 100%;
    }

    .welcome-modal-wrap__image-holder {
        display: table-cell;
        height: 95%;
        overflow-x: hidden;
        align-items: center;
        vertical-align: middle;
        text-align: center;
    }

    .welcome-modal-wrap__image {
        margin: auto;
    }

    .welcome-modal-wrap__status-holder {
        height: 5%;
        display: table-row;
        text-align: center;
      color: #18172a;
    }
</style>
