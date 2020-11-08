<template>
  <table class="schedule">

    <!--        {{testData}}-->

    <tr>
      <td class="schedule-seances">
        <table class="schedule-seances-table">

          <tr class="schedule-seances-header">
            <td class="schedule-seances-header-nearest">
              Найближчі сеанси
            </td>
            <td class="schedule-seances-header-clock">
              <div class="clock-frame">
                {{clock}}
              </div>
            </td>
          </tr>

          <tr class="schedule-seances-movies">
            <td class="schedule-seances-movies-wrap" colspan="2">

              <Movie v-for="(item, index) in moviesStack"
                     :key="index"
                     ref="movie"
                     :width="width"
                     v-bind:style="item.st"
                     v-bind:data="item.data">
              </Movie>


            </td>
          </tr>

        </table>
      </td>

      <td class="schedule-bar">
        <div class="schedule-bar-banners-wrap">

          <Banner v-for="(item, index) in bannerStack"
                  :key="index"
                  v-bind:style="item.st"
                  v-bind:data="item.data">
          </Banner>

        </div>
      </td>
    </tr>

    <!--                <button v-on:click="firstView">firstView</button>-->
    <!--                <button v-on:click="disappear">disappear</button>-->
    <!--                <button v-on:click="deleteObj">deleteObj</button>-->
    <!--        <button v-on:click="updateSeats">updateSeats</button>-->
    <!--        <button v-on:click="loadData">load data</button>-->
    <!--        <button v-on:click="setClock">set clock</button>-->

            <Welcome
                    v-bind:style="styleWelcome"
                    :serviceInfo="serviceInfo"
            />

  </table>

</template>

<script>
    import axios from 'axios';
    import {Mixin} from '../mixins/Mixin.js';
    import Header from "../components/Header";
    import Movie from "../components/Movie";
    import Banner from "../components/Banner";
    import Welcome from '../components/Welcome';

    var socket;


    export default {
  name: 'Schedule',
        components: {
            Header,
            Movie,
            Banner,
            Welcome
        },
        mixins: [Mixin],
        props: ['city'],
        data() {

            return {
                windowWidth: window.innerWidth,
                testData: 'NO TEST DATA',
                debugConsole: false,
                debugConsoleShowtimes: false,

                testTime: {hour: 22, min: 50},
                time: {},
                initTime: {},
                clock: '',

                dateCurrentObj: {},
                triggerLoadData: 0,
                triggerUpdateSeats: 0,
                // Период загрузки состояния сидений (мин.)
                seatsLoad: 2,
                // Период загрузки сеансов (мин.)
                // К этому параметру добаляеться случайное число (0-5) для асинхронных запросов с плазм
                dataLoad: 10,
                // reloadEmptySec: 5,
                reloadEmptySec: 60,
                // Задержка на удаление сенанса (мин.)
                lateness: 9,
                // Время проверки обькта (сек.)
                timeCheck: 60,

                inputData: [],
                lastTime: null,
                countMovie: 0,

                serviceInfo: '',
                serviceInfoOK: 'Loading...',

                moviesStack: [],
                bannerStack: [],

                styleWelcome: {
                    opacity: 1,
                    transition: 'all 1s ease-in-out',
                },
                styleM1: {
                    opacity: 1,
                    transform: '',
                    transition: '',
                },
                styleM2: {
                    opacity: 1,
                    transform: '',
                    transition: '',
                },
                styleM3: {
                    opacity: 1,
                    transform: '',
                    transition: '',
                },
                styleB1: {
                    opacity: 1,
                    transform: '',
                    transition: '',
                },
                styleB2: {
                    opacity: 1,
                    transform: '',
                    transition: '',
                },
                styleB3: {
                    opacity: 1,
                    transform: '',
                    transition: '',
                },
                shiftLeft: 0,
                width: '20%'
            };
        },
        beforeCreate: function () {
            document.body.className = 'home';
        },
        mounted() {
            this.showWelcome(true);
            this.init();
            this.loadData();

            socket = io('ws://' + location.hostname + ':' + process.env.PORT_SOCKET);
            socket.on('resetClient', function (data) {
                if (data) {
                    location.reload();
                }
            });
        },
        beforeDestroy() {
            socket.disconnect();
        },
        methods: {
            init() {
                if (process.env.NODE_ENV === 'development') this.debugConsole = true;

                this.time = this.getTime();
                this.initTime = this.time;

                let max = 5, min = 0, rand;
                rand = min - 0.5 + Math.random() * (max - min + 1);
                this.dataLoad = Math.round(rand) + this.dataLoad;
            },
            getTime() {

                // Debugging clock
                this.testTime.min++;
                if (this.testTime.min === 59) {
                    this.testTime.hour++;
                    this.testTime.min = 0;
                }

                // Test / Prod
                // this.dateCurrentObj = this.objDate('2019-07-25 ' + this.testTime.hour + ':' + this.testTime.min + ':00');
                this.dateCurrentObj = this.objDate();

                let clock = this.dateToTime(this.dateCurrentObj);
                let separate = clock.split(':');

                return {
                    clock: clock,
                    hour: Number(separate[0]),
                    min: Number(separate[1])
                };
            },
            setClock() {

                this.time = this.getTime();
                this.clock = this.time.clock;

                this.controlTrig();
            },
            controlTrig() {

                // Update trigger load data
                // if ((this.time.min + this.time.hour * 60) > (this.initTime.min + this.initTime.hour * 60) && (this.time.min % this.dataLoad) === 0) {
                //     this.initTime = this.time;
                //     this.triggerLoadData++;
                //     if (this.debugConsole) console.log('%cTRIG LOAD READY (' + this.triggerLoadData + ') - Update data every ' + this.dataLoad + ' min. Mins:' + this.time.min, 'color: red;')
                // }

                // Update trigger update seats
                if ((this.time.min + this.time.hour * 60) > (this.initTime.min + this.initTime.hour * 60) && (this.time.min % this.seatsLoad) === 0) {
                    this.initTime = this.time;
                    this.triggerUpdateSeats++;
                    if (this.debugConsole) console.log('%cTRIG SEATS READY (' + this.triggerUpdateSeats + ') - Update seats every' + this.seatsLoad + 'min. Min:' + this.time.min, 'color: red;')
                }
            },
            showWelcome(param) {

                if (param === Object(param) && param.length === 0) {
                    param = true;
                } else if (param === Object(param) && param.length !== 0) {
                    param = false;
                }

                if (param) {

                    this.styleWelcome.opacity = 1;
                    this.styleWelcome.transition = 'all 2s ease-in-out';
                } else {

                    this.styleWelcome.opacity = 0;
                    this.styleWelcome.transition = 'all 2s ease-in-out';
                }

            },
            loadData() {
                if (this.debugConsole) console.log('%cLOAD DATA ...........', 'color: green;');
                this.countMovie = this.inputData.length;

                this.HTTP('POST', process.env.URL_API_SHOWTIMES_GET + this.city, {
                    "lasttime": this.lastTime,
                    "countmovie": this.countMovie,
                })
                    .then(
                        response => {
                            if (this.debugConsole) console.log('%cLast time object: ' + this.lastTime, 'color: green;');
                            if (this.debugConsole) console.log('%cCount objects: ' + this.countMovie, 'color: green;');

                            this.serviceInfo = this.serviceInfoOK;
                            if (this.debugConsole) console.log('%cRESPONCE:', 'color: green;');
                            if (this.debugConsole) console.log(response);
                            this.setData(response);
                        },
                        error => {
                            if (this.debugConsole) console.log('%cERROR:' + error, 'color: red;');
                            this.serviceInfo = error;
                            if (this.inputData.length !== 0) {
                                this.firstView()
                            } else {
                                setTimeout(this.loadData, (this.reloadEmptySec * 1000));
                            }
                        },
                    );
            },
            setData(data) {

                let l = this.inputData.length;

                // Если ответ не пустой - пушим в массив данные
                if (data.length > 0) {

                    for (let key in data) {
                        this.inputData.push(data[key]);
                    }

                    // Getting lasttime & count for next request
                    this.lastTime = this.inputData[this.inputData.length - 1].showtime.timeBegin;

                    this.firstView();

                    // Если ответ пустой и нет массива с фильмами
                } else if (this.inputData.length === 0) {

                    // Показываем pop-up и загружаем данные повторно
                    this.showWelcome(this.inputData);
                    setTimeout(this.loadData, (this.reloadEmptySec * 1000));

                    //  Если ничего не получили но есть данные продолжаем показывать
                } else if (this.inputData.length !== 0) {

                    this.firstView();
                }

            },
            updateSeats() {
                if (this.debugConsole) console.log('%cUPDATE SEATS ...........', 'color: green;');

                let seances = this.getSeances(this.inputData);

                this.HTTP('POST', process.env.URL_API_SEATS + 'getbusy', seances)
                    .then(
                        response => {
                            if (this.debugConsole) console.log(response)

                            this.updateInputData(this.inputData, response);
                        },
                        error => {

                        },
                    );

            },
            getSeances(data) {

                let key, arrayIds = [];
                for (key in data) {
                    arrayIds.push(data[key].showtime.showtimeId);
                }
                return {"seanceIds": arrayIds};
            },
            updateInputData(data, response) {
                let sKey, iKey, seatKey;
                for (sKey in response) {

                    for (iKey in data) {

                        if (data[iKey].showtime.showtimeId === Number(sKey)) {
                            for (seatKey in data[iKey].hallScheme) {

                                if (response[sKey].busySeats.includes(data[iKey].hallScheme[seatKey].seat_id)) {

                                    data[iKey].hallScheme[seatKey].busy = 1;

                                }
                            }

                        }

                    }
                }
            },
            getStack(inputData = [], styles = []) {

                // Debugging
                if (this.debugConsoleShowtimes)
                    for (let key in inputData) {
                        console.log('Input:' + key + ' :' + inputData[key].showtime.nameUa)
                    }

                let stack = [];
                let i = 0;
                for (let k in styles) {

                    // Получаем ключ обьека - колиство рассписаний со стилями {1: this.styleM1}
                    let key = Object.keys(styles[k])[0];

                    // Иттерация по колиству указанных в ключе
                    for (let j = 0; j < key; j++) {

                        // Если существуют входные данне с указанным ключом
                        if (inputData[i]) {

                            // Пушим в массив стиль и данные
                            stack.push({
                                st: styles[k][key],
                                data: inputData[i]
                            });

                            i++;
                        }
                    }
                }

                // Debugging
                if (this.debugConsoleShowtimes) console.log('-----------------------------------');

                return stack;
            },
            firstView() {
                this.showWelcome(this.inputData);
                this.setClock();

                if (this.debugConsole) console.log('%cFIRST VIEW', 'color: blue;');

                this.styleM1.transition = '';
                this.styleM1.opacity = 1;
                this.styleM2.transition = '';
                this.styleM2.transform = 'translate(0%, 0%)';
                this.styleM3.transition = '';
                this.styleM3.transform = 'translate(0%, 100%)';
                this.styleB3.transition = '';
                this.styleB3.transform = 'translate(0%, 100%)';

                this.moviesStack = this.getStack(
                    this.inputData,
                    [
                        {1: this.styleM1},
                        {4: this.styleM2},
                    ]);



                this.bannerStack = this.getStack(
                    this.inputData.slice(5),
                    [
                        {1: this.styleB1},
                        {10: this.styleB2},
                    ]);

                // Update seats
                if (this.triggerUpdateSeats > 0 && this.triggerLoadData === 0 && this.inputData.length !== 0) {
                    this.triggerUpdateSeats = 0;
                    // if (this.debugConsole) console.log('%cTRIG SEATS RUN & RESET', 'color: red;')

                    this.updateSeats();
                }

                let movie = this.$refs.movie;
                if (Array.isArray(movie) && movie.length) {
                    this.width = movie[0].$el.offsetWidth + 'px';
                }

                setTimeout(this.checkObject, this.timeCheck * 1000);
            },
            checkObject() {
                if (this.debugConsole) console.log("CHECK OBJ");

                if(this.inputData.length) {

                  let timeBeginObj = this.objDate(this.inputData[0].showtime.timeBegin);
                  timeBeginObj.setMinutes(timeBeginObj.getMinutes() + this.lateness);

                  if (timeBeginObj < this.dateCurrentObj) {
                    this.deleteObj();

                    // DELETE
                    setTimeout(this.disappear, 1000);
                  } else {

                    // NOT DELETE
                    setTimeout(this.firstView, 5000);                                                                   // устновить нужное время - 1мин?
                  }
                }else{

                  let date = new Date();
                  let now = Date.now();
                  let today = date.getDate(),
                          currMonth = date.getMonth(),
                          currYear = date.getFullYear();

                  let reloadLabel = new Date(currYear, currMonth, today, 7);
                  let relLab = reloadLabel.getTime();

                  let reloadLabelFin = new Date(currYear, currMonth, today, 8);
                  let relLabFin = reloadLabelFin.getTime();

                  if (relLab < now && relLabFin > now){
                    setTimeout(()=>{
                      location.reload();
                    }, 5000);

                  } else{
                    setTimeout(this.firstView, 5000);
                  }

                }
            },
            deleteObj() {
                if (this.debugConsole) console.log('%cDELETED', 'color: red;');

                // Remove 1 el with index 0
                this.inputData.splice(0, 1);

                // debugConsole

                for (let key in this.inputData) {
                    if (this.debugConsole) console.log('Input:' + key + ' :' + this.inputData[key].showtime.nameUa)
                }

            },
            disappear() {

                this.styleM1.transition = 'all 1s ease-in-out';
                this.styleM1.opacity = 0;

                setTimeout(this.slideLeft, 1000);
            },
            slideLeft: function () {

                let movie = this.$refs.movie,
                    shift = '-100%';

                if (Array.isArray(movie) && movie.length) {
                    shift = (movie[0].$el.offsetWidth * -1) + 'px';
                }

                this.styleM2.transform = 'translate(' + shift + ', 0%)';
                this.styleM2.transition = 'all 1s ease-in-out';
                setTimeout(this.evaporation, 1000);
            },
            evaporation() {

                this.styleB1.transition = 'all 0.5s ease-in-out';
                this.styleB1.transform = 'translate(0%, -150%)';
                this.styleB1.opacity = 0;

                setTimeout(this.secondView, 500);
            },
            secondView() {
                if (this.debugConsole) console.log('%cSECOND VIEW', 'color: blue;');

                this.styleM2.transition = '';
                this.styleM2.transform = 'translate(0%, 0%)';

                this.moviesStack = this.getStack(
                    this.inputData,
                    [
                        {4: this.styleM2},
                    ]);

                setTimeout(this.thirdView, 20);
            },
            thirdView() {
                if (this.debugConsole) console.log('%cTHIRD VIEW', 'color: blue;');


                this.styleM1.opacity = 1;
                this.styleB1.opacity = 1;

                this.moviesStack = this.getStack(
                    this.inputData,
                    [
                        {1: this.styleM1},
                        {3: this.styleM2},
                        {1: this.styleM3},
                    ]);

                setTimeout(this.slideUpMovie, 200);
            },
            slideUpMovie: function () {

                this.styleM3.transition = 'all 1s ease-in-out';
                this.styleM3.transform = 'translate(0%, 0%)';

                setTimeout(this.slideUpBanners, 1000);
            },
            slideUpBanners: function () {

                this.styleB2.transition = 'all 0.5s ease-in-out';
                this.styleB2.transform = 'translate(0%, -100%)';

                setTimeout(this.fourthView, 500);
            },
            fourthView() {
                if (this.debugConsole) console.log('%cFOURTH VIEW', 'color: blue;');

                this.styleB1.transition = '';
                this.styleB1.transform = 'translate(0%, 0%)';
                this.styleB1.opacity = 1;

                this.styleB2.transition = '';
                this.styleB2.transform = 'translate(0%, 0%)';

                this.bannerStack = this.getStack(
                    this.inputData.slice(5),
                    [
                        {1: this.styleB1},
                        {10: this.styleB2},
                    ]);

                setTimeout(this.firstView, 5000);

                // setTimeout(this.loadData, 5000);
                // this.nextLoad();

            },
            HTTP(method, url, object = null, bearer = null) {
                return new Promise((resolve, reject) => {

                    const xhr = new XMLHttpRequest();

                    xhr.open(method, url, true);
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                    if (bearer)
                        xhr.setRequestHeader('Authorization', bearer);

                    xhr.onload = function () {
                        // if (this.status == 200) {
                        if (this.status >= 200 && this.status < 300 || this.status === 304) {
                            if (xhr.responseText) {
                                resolve(JSON.parse(xhr.responseText));
                            }
                        } else {
                            reject(xhr.statusText);
                        }
                    };

                    xhr.onerror = function () {
                        reject(new Error("Network Error"));
                    };

                    xhr.send(JSON.stringify(object));
                });
            },
        }
    }

</script>


<style>

  /* Main block */

  .schedule {
    /*border: solid 1px #71ee46;*/
    width: 100%;
    height: 100%;
    /*height: 1065px;*/
    /*padding-left: 1vw;*/
    /*cursor: none;*/
    cursor: crosshair;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
    color: #edecee;
  }

  /* Seances */

  .schedule-seances {
    width: 80%;
    height: 100%;
  }

  .schedule-seances-table {
    width: 100%;
    height: 100%;
  }

  .schedule-seances-header {
    width: 100%;
    height: 15%;
  }

  .schedule-seances-header-nearest {
    width: 80%;
    font-size: 4.5vw;
    text-align: left;
    padding-left: 1vw;
  }

  .clock-frame {
    border: solid 2px #edecee;
    border-radius: 15px;
    margin-left: 10%;
    margin-right: 10%;
  }

  .schedule-seances-header-clock {
    width: 20%;
    font-size: 3.5vw;
  }

  .schedule-seances-movies {
    /*border: solid 1px #edecee;*/
    width: 100%;
    height: 85%;
  }

  .schedule-seances-movies-wrap {
    width: 100%;
    height: 100%;
    /*border: solid 1px #35ee33;*/
    text-align: left;
  }

  /*
      .movie {
          height: 100%;
          width: 20%;
          padding: 1.5vw;
          !*padding: 1.2vw;*!
          display: inline-block;
      }
  */
  /* Right bar */

  .schedule-bar {
    width: 20%;
    height: 100%;
  }

  .schedule-bar-table {
    width: 100%;
    height: 100%;
  }

  .schedule-bar-banners-wrap {
    padding-top: 2vw;
    width: 100%;
    height: 100%;
  }

</style>
