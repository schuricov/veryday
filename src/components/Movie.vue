<template>
    <div class="movie" :style="{width: width}" ref="movie">
        <div class="movie-content">

            <div class="row-one">
                <!--                <td style="vertical-align: top;">-->
                <p class="time-begin">{{ timeBeginParsed }}</p>
                <p class="time-end">Час закінчення: {{ timeEndParsed }}</p>
                <img class="movie-img" alt="Planeta Kino" :src="data.showtime.poster">
                <p class="genres"> {{data.showtime.genres}} </p>
                <!--                </td>-->
            </div>

            <div class="row-name">
                <p class="name-ua">{{data.showtime.nameUa}}</p>
            </div>

            <div class="row-tech">
                <p class="tech">{{data.showtime.technology}} {{data.showtime.format}}</p>
            </div>

            <div class="row-hall">

                <my-canvas style="width: 100%; height: 100%;">

                    <my-hall
                            v-bind:hallScheme="data.hallScheme"
                            v-bind:showtimeId="data.showtime.showtimeId"
                            @statusSeats="setRest"
                    ></my-hall>

                </my-canvas>


            </div>

            <div class="row-rest">
                <p class="rest">Залишилось: {{rest}} {{places}}</p>
                <!--            <p class="rest">Залишилось: {{countSeats}} {{places}}</p>-->
            </div>

            <div class="row-prices">
                <p class="rest"><span class="row-prices-from">Від {{data.showtime.minprice}} грн </span><span v-if="data.showtime.bonus">або {{data.showtime.bonus}} бонусів</span></p>
            </div>

        </div>
    </div>
</template>

<script>
    import {Mixin} from '../mixins/Mixin.js';
    import MyCanvas from './MyCanvas.vue';
    import MyHall from './MyHall.vue';

    export default {
        name: 'Movie',
        mixins: [Mixin],
        components: {
            MyCanvas,
            MyHall
        },
        data: function () {
            return {

                // hallScheme: {},
                // genres: this.data.showtime.genres,
                // showtimeId: this.data.showtime.showtimeId,
                countSeats: 0,
                places: '',
                money: 200,
                bonuses: 4400,

                // hallScheme: this.data.hallScheme
            }
        },
        props: {
            // msg: String
            // showtime: {required: true},
            // hallScheme: {required: true},
            width: {
                type: String,
                default: '20%'
            },

            data: {required: true},
        },
        mounted() {
            // console.log(this.showtime);
            this.countSeats = this.data.hallScheme.length;
        },
        computed: {
            timeBeginParsed: function () {
                return this.dateToTime(this.objDate(this.data.showtime.timeBegin));
            },
            timeEndParsed: function () {
                return this.dateToTime(this.objDate(this.data.showtime.timeEnd));
            },
            rest: function () {
                return this.getCountSeats(this.data.hallScheme)
            }

        },
        methods: {
            // Move to Schedule - getting count during handle new status of seats ???
            getCountSeats(seats) {

                let key, free = 0, busy = 0;
                for (key in seats) {

                    if (seats[key].busy === 0 || seats[key].busy == null)
                        free++;

                    if (seats[key].busy === 1)
                        busy++;
                }

                return free;
            },
            // Old method - DELETE IT!
            setRest(obj) {
                this.countSeats = obj.free;
                this.places = this.getPlaces(this.countSeats);
            },
            getPlaces(countSeats) {

                let declension1 = [1]; // Місто
                let declension2 = [2, 3, 4]; // Місця
                let declension3 = [0, 5, 6, 7, 8, 9, 10]; // Місць

                let lastNumber = Number(countSeats.toString().split('').pop());
                // let lastNumber = 0;

                if (declension1.includes(lastNumber))
                    return 'Місто';

                if (declension2.includes(lastNumber))
                    return 'Місця';

                if (declension3.includes(lastNumber))
                    return 'Місць';

            }

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    /* Main, debugging settings */

    .movie {
        border: solid 1px #35ee33;
        padding: 0;
        height: 100%;
        width: 20%;
        /*padding: 1.5vw;*/
        /*padding: 1.2vw;*/
        display: inline-block;
        /*display: table;*/
    }

    .movie-content {
        padding: 1.5vw;
        height: 100%
    }

    div {
        /*border: solid 1px #0feed8;*/
        /*border-collapse: collapse;*/
    }

    p {
        margin-top: 0;
        margin-bottom: 0;
    }

    /* Main block */

    .time-end, .genres, .tech, .rest {
        font-size: 0.8vw;
        font-weight: 600;
        text-transform: uppercase;
    }

    /*--------------------------------------- MAIN*/

    .row-one {
        height: 57%;
        vertical-align: top;
    }

    .movie-img {
        width: 100%;
        border-radius: 5px;
    }

    .time-begin {
        margin-top: 1vw;
        font-size: 2.2vw;
        line-height: 0.1vw;
        font-weight: 600;
    }

    .time-end {
        margin-top: 1.5vw;
        margin-bottom: 1vw;
    }

    .genres {
        color: #4786ba;

        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /*--------------------------------------- NAME */

    .row-name {
        height: 11%;
        vertical-align: top;
    }

    .name-ua {
        font-size: 1vw;
        font-weight: 600;
        vertical-align: top;

        /* text wrap */
        /*border: 1px solid red;*/
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /*--------------------------------------- TECH */

    .row-tech {
        height: 4%;
        vertical-align: top;
    }

    /*--------------------------------------- HALL */

    .row-hall {
        /*padding-top: 0.6vw;*/
        /*vertical-align: center;*/
        border: solid 2px #454457;
        /*border: solid 0.1vw #454457;*/
        height: 19%;
        border-radius: 5px;
        /*border-radius: 0.3vw;*/
    }

    /*--------------------------------------- REST */

    .row-rest {
        margin-top: 0.6vw;
        height: 2.5%;
    }

    /*--------------------------------------- PRICE */

    .row-prices {
        height: 2.5%;
        white-space: nowrap;
    }

    .row-prices-from {
        color: #e0b64b;
    }

</style>
