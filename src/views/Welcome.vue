<template>
  <table class="schedule">

    <Welcome
      v-bind:style="styleWelcome"
      :serviceInfo="serviceInfo"
    />

  </table>

</template>

<script>
import axios from 'axios';
import {Mixin} from '../mixins/Mixin.js';
import Welcome from '../components/Welcome';

export default {
  name: 'Schedule',
  components: {
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
        background: 'orange'
      }
    };
  },
  beforeCreate: function () {
    document.body.className = 'home';
  },
  mounted() {
    this.init();

  },
  beforeDestroy() {
    // socket.disconnect();
  },
  methods: {
    init() {
      if (process.env.NODE_ENV === 'development') this.debugConsole = true;

    }
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
  /*color: #edecee;*/
}



</style>
