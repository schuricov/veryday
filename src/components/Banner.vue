<template>
    <div class="banner">
        <!--        <div class="wrapper">-->

        <table style="width: 100%; height: 100%; text-align: center; vertical-align: top; border-collapse: collapse;">
            <tr>
                <td class="time-begin">
                    {{timeBeginParsed}}
                </td>

                <td class="movie-info">

                    <div class="movie-info-name">
                        {{data.showtime.nameUa}}
                    </div>

                    <div class="movie-info-tech">
                        {{data.showtime.technology}} {{data.showtime.format}}
                    </div>

                </td>
            </tr>
        </table>

        <!--        </div>-->
    </div>
</template>

<script>
    import {Mixin} from '../mixins/Mixin.js';

    export default {
        name: 'Banner',
        components: {},
        mixins: [Mixin],
        data: function () {
            return {
                time: '00:00',
                name: 'name',
                tech: 'tech',
            }
        },
        props: {
            data: {required: true},
        },
        mounted() {
        },
        computed: {
            timeBeginParsed: function () {
                return this.dateToTime(this.objDate(this.data.showtime.timeBegin));
            }
        },
        methods: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    /* Main, debugging settings */

    td {

        /*border: solid 0.1vw #0feed8;*/

    }

    div {
        /*border: solid 0.01vw #0feed8;*/
        /*border-collapse: collapse;*/
    }

    .banner {
        /*border: #42b983 solid 1px;*/
        width: 100%;
        height: 10%;
    }

    .time-begin {

        width: 25%;
        vertical-align: top;
        font-size: 1.3vw;
        line-height: 1.4vw;
        font-weight: 800;
    }

    .movie-info {
        width: 75%;
        vertical-align: top;
        text-align: left;
    }

    .movie-info-name {
        padding-left: 1vw;
        font-size: 1.3vw;
        line-height: 1.4vw;
        font-weight: 800;

        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .movie-info-tech {
        padding-left: 1vw;
        font-size: 1vw;
        line-height: 1.1vw;
        font-weight: 600;
    }

    /*.wrapper {*/
    /*    display: inline;*/
    /*}*/


</style>
