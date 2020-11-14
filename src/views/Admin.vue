<template>
  <div>

    <AdminLog
      v-show="logVisible"
      @close="closeLog"
      @submitEvent="checkInput"
    />

<!--    <table class="admin">-->

<!--      &lt;!&ndash;        {{testData}}&ndash;&gt;-->

<!--      <tr>-->
<!--        <td class="admin-menu">-->

<!--          <div class="buttons-wrap">-->

<!--            <div class="button" v-on:click="imports">-->
<!--              <p>Імпорти</p>-->
<!--            </div>-->

<!--            <div class="button" v-on:click="systemConfig">-->
<!--              <p>Конфігурація</p>-->
<!--            </div>-->

<!--            &lt;!&ndash;                    <div class="button" v-on:click="showLog">&ndash;&gt;-->
<!--            &lt;!&ndash;                        <p>Show log</p>&ndash;&gt;-->
<!--            &lt;!&ndash;                    </div>&ndash;&gt;-->

<!--            &lt;!&ndash;                    <div class="button" v-on:click="closeLog">&ndash;&gt;-->
<!--            &lt;!&ndash;                        <p>Close log</p>&ndash;&gt;-->
<!--            &lt;!&ndash;                    </div>&ndash;&gt;-->

<!--            <div class="button" v-on:click="setContent">-->
<!--              <p style="color: #ee6a44">Зберегти</p>-->
<!--            </div>-->
<!--            <div class="button" v-on:click="showModal = true">-->
<!--              <p style="color: #ee6a44">Reset</p>-->
<!--            </div>-->

<!--            <div class="button" v-on:click="logOut">-->
<!--              <p style="color: #42b983">Вихід</p>-->
<!--            </div>-->

<!--          </div>-->

<!--        </td>-->

<!--        <td class="admin-content">-->

<!--          <h2 class="menu-name">-->
<!--            {{ menuName }}-->
<!--          </h2>-->




<!--          <div class="content-wrap">-->

<!--            &lt;!&ndash;System config&ndash;&gt;-->

<!--            <div class="system-config" v-show="systemConfigVisible">-->

<!--              <table>-->
<!--                <tr v-for="(value, key) in configTest" v-if="toggleConfigVisibility(key)">-->
<!--                  <td class="system-config-key">-->
<!--                    <p>{{ translateKeys(key) }}</p>-->
<!--                  </td>-->
<!--                  <td class="system-config-value">-->
<!--                    <div>-->
<!--                      <input class="input" v-model="configTest[key] = value">-->
<!--                    </div>-->
<!--                  </td>-->

<!--                </tr>-->
<!--              </table>-->

<!--            </div>-->

<!--            &lt;!&ndash;imports&ndash;&gt;-->

<!--            <div class="system-status" v-show="importsVisible">-->

<!--              <table style="text-align: left;">-->
<!--                <tr>-->
<!--                  <td>-->
<!--                    <p>Імпортувати розклад сеансів</p>-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <button v-on:click="this.importsShowtimes">імпорт</button>-->
<!--                  </td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td>-->
<!--                    <p>Імпортувати стан сидінь</p>-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <button v-on:click="this.importsSeats">імпорт</button>-->
<!--                  </td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td>-->
<!--                    <p>Імпортувати холи</p>-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <button v-on:click="this.importsHalls">імпорт</button>-->
<!--                  </td>-->
<!--                </tr>-->
<!--              </table>-->

<!--            </div>-->

<!--          </div>-->

<!--          <div class="content-log">-->
<!--            &lt;!&ndash;                        {{logMessage}}&ndash;&gt;-->
<!--          </div>-->

<!--        </td>-->
<!--      </tr>-->

<!--      <transition name="fade">-->
<!--        <div class="save-alert" v-show="saveAlertVisibility">-->
<!--          <span>Збережено</span>-->
<!--        </div>-->
<!--      </transition>-->
<!--      <transition name="fade">-->
<!--        <div class="save-alert" v-show="resetAlertVisibility">-->
<!--          <span>Оновлено</span>-->
<!--        </div>-->
<!--      </transition>-->

<!--      <AdminLog-->
<!--        v-show="logVisible"-->
<!--        @close="closeLog"-->
<!--        @submitEvent="checkInput"-->
<!--      />-->

<!--    </table>-->
<!--    <transition name="modal" v-if="showModal">-->
<!--      <div class="modal-mask">-->
<!--        <div class="modal-wrapper">-->
<!--          <div class="modal-container">-->
<!--            <div class="modal-header">-->
<!--              <h3>Перезавантажити розклад на всіх пристроях?</h3>-->
<!--            </div>-->
<!--            <div class="modal-footer">-->

<!--              <button class="modal-default-button" @click="showModal = false">-->
<!--                Ні-->
<!--              </button>-->
<!--              <button class="modal-default-button" @click="reset">-->
<!--                Так-->
<!--              </button>-->

<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </transition>-->
<!--    <div class="lds-css" :class="{'show': showLoading}">-->
<!--      <div class="lds-spinner" style="width:100%;height:100%">-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--        <div></div>-->
<!--      </div>-->
<!--    </div>-->


  </div>
</template>

<script>
import { Mixin } from '../mixins/Mixin.js'
import AdminLog from '../components/admin/AdminLog'

var socket

export default {
  name: 'Admin',
  components: {
    AdminLog
  },
  mixins: [Mixin],
  data () {
    return {
      test: 'true',
      menuName: 'Please select menu',

      windowWidth: window.innerWidth,
      testData: 'NO DATA',
      time: '',
      dateCurrentObj: {},

      logVisible: true,
      token: null,
      interval1: null,

      configTest: {},
      inputForm: {},
      systemConfigVisible: false,
      importsVisible: false,

      logMessage: 'Log Data...',
      saveAlertVisibility: false,
      showModal: false,
      showLoading: false,
      resetAlertVisibility: false
    }
  },
  beforeCreate: function () {
    document.body.className = 'home'
  },
  mounted () {
    this.init()
    socket = io('ws://' + location.hostname + ':' + process.env.PORT_SOCKET)
  },
  beforeDestroy () {
    socket.disconnect()
  },
  computed: {},
  methods: {
    init () {
      // Config for prod - /config/prod.env.js
      // Config for dev - /config/dev.env.js
      console.log('URL_API_SHOWTIMES_GET: ' + process.env.URL_API_SHOWTIMES_GET + this.city)
      console.log('APP MODE: ' + process.env.NODE_ENV)

      // this.checkToken()
      // this.timerToken()
    },
    importsShowtimes () {
      this.importss(process.env.URL_API_SHOWTIMES + 'import')
    },
    importsSeats () {
      this.importss(process.env.URL_API_SEATS + 'import')
    },
    importsHalls () {
      this.importss(process.env.URL_API_HALLS + 'import')
    },
    importss (url) {
      this.logMessage = 'Please wait...'

      this.HTTP('POST', url)
        .then(
          response => {
            console.log(response)
            this.logMessage = response
          },
          error => {
            this.logMessage = error
          }
        )
    },
    importsPromise (url) {
      this.logMessage = 'Please wait...'

      return new Promise((resolve, reject) => {
        this.HTTP('POST', url)
          .then(
            response => {
              console.log(response)
              this.logMessage = response
              resolve(true)
            },
            error => {
              this.logMessage = error
              reject(false)
            }
          )
      })
    },
    hideAll () {
      this.systemConfigVisible = false
      this.importsVisible = false
    },
    checkInput (data) {
      this.HTTP('POST', process.env.URL_API_LOGINL, { email: data.user, password: data.pass })
        .then(
          response => {
            console.log(response)
            if (response.accessToken && response.timeToken) {
              // this.$cookie.set('accessToken', response.accessToken, { expires: response.timeToken + 's' })
              // this.checkToken()
            }
          },
          error => {
            this.$bus.$emit('login', {
              mess: error
            })
          }
        )
    },
    getContent () {
      this.HTTP('POST', process.env.URL_API_SYSTEM_CONFIG + 'get', { param1: null, param2: null }, this.token)
        .then(
          response => {
            console.log(response)

            this.configTest = response
            return response
          },
          error => {
            // console.log(error)
            this.logOut()
          }
        )
    },
    setContent () {
      console.log(this.configTest)

      this.HTTP('POST',
        process.env.URL_API_SYSTEM_CONFIG + 'set',
        this.configTest,
        this.token
      ).then(
        response => {
          console.log(response)

          this.saveAlertVisibility = true
          setTimeout(() => {
            this.saveAlertVisibility = false
          }, 4000)

          // this.configTest = response;
          return response
        },
        error => {
          console.log(error)
          // this.logOut();
          this.logMessage = error
        }
      )

      console.log(this.configTest)
    },
    checkToken () {
      this.token = this.$cookie.get('accessToken')
      // If token expired show modal login;
      this.logVisible = this.token === null
    },
    timerToken () {
      this.interval1 = setInterval(function () {
        // this.checkToken()
      }.bind(this), 60000)
    },
    logOut () {
      // this.$cookie.delete('accessToken')
      // this.checkToken()
    },
    imports () {
      console.log('imports')
      this.hideAll()
      this.importsVisible = true
      this.menuName = 'Конфігурація системи'
    },
    systemConfig () {
      console.log('system config')
      this.hideAll()
      this.getContent()
      this.menuName = 'Конфігурація системи'
      this.systemConfigVisible = true

      // this.configTest = await this.getContent();
      // console.log(this.configTest)
    },

    showLog () {
      this.logVisible = true
    },
    closeLog () {
      this.logVisible = false
    },
    HTTP (method, url, object = null, bearer = null) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open(method, url, true)
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        if (bearer) { xhr.setRequestHeader('Authorization', bearer) }

        xhr.onload = function () {
          // if (this.status == 200) {
          if (this.status >= 200 && this.status < 300 || this.status === 304) {
            if (xhr.responseText) {
              resolve(JSON.parse(xhr.responseText))
            }
          } else {
            // let error = new Error(this.statusText);
            // error.code = this.status;
            // reject(error);
            // reject(xhr.status);
            reject(xhr.statusText)
          }
        }

        xhr.onerror = function () {
          reject(new Error('Network Error'))
        }

        xhr.send(JSON.stringify(object))
      })
    },

    translateKeys (value) {
      switch (value) {
        case 'cron_import_seats':
          return 'час оновлення даних по місцям (хв)'

        case 'cron_import_showtimes':
          return 'час оновлення даних по сеансам (хв)'

        case 'theaters':
          return 'сторінки кінотеатрів'

        case 'count_movie':
          return 'кількість фільмів'

        case 'life_time_token_sec':
          return 'час життя токену (сек)'

        default:
          return value
      }
    },

    toggleConfigVisibility (item) {
      switch (item) {
        case 'zero_load_min':
          return false

        case 'next_load_min':
          return false

        default:
          return true
      }
    },
    reset () {
      this.showModal = false
      this.showLoading = true

      this.importsPromise(process.env.URL_API_SHOWTIMES + 'import')
        .then(() => {
          return this.importsPromise(process.env.URL_API_SEATS + 'import')
        }).then(() => {
          socket.emit('reset', 1)
          this.resetAlertVisibility = true

          setTimeout(() => {
            this.resetAlertVisibility = false
          }, 4000)
        }).catch(() => {
          alert('Сталася помилка')
        }).finally(() => {
          this.showLoading = false
        })
    }

  }
}
</script>

<style>

table {
  width: 100%;
}

/* Main, debugging settings */

tr {
  /*border: solid 1px #ee5c14;*/
}

td {
  /*border: solid 1px #eeae5f;*/
}

div {
  /*border: solid 1px #edecee;*/
}

/* Main block */

/*--------------------------------------- MAIN BLOCK */

.admin {
  /*border: solid 1px #71ee46;*/
  position: relative;
  width: 100%;
  height: 100%;
  /*cursor: none;*/
  cursor: crosshair;
  /*background: #18172a;*/
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: white;
  /*color: #aeadaf;*/
}

/*--------------------------------------- MENU */

.menu-name {
  color: grey;
}

.admin-menu {
  width: 20%;
  height: 100%;
}

.buttons-wrap {
  width: 100%;
  height: 100%;
}

.button {
  width: 100%;
  height: 10%;
  border-bottom: solid 1px #454457;
  text-align: right;
  /*vertical-align: center;*/
  font-size: 1.5vw;
  padding-right: 2vw;

  /* vertical align*/
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}

/*--------------------------------------- CONTENT */

.admin-content {
  width: 80%;
  height: 100%;
  padding: 5vw;
}

.content-wrap {
  width: 100%;
  height: 100%;
}

.content-log {
  height: 10%;
  color: grey;
  /*overflow: hidden;*/
}

/*--------------------------------------- CONTENT (System config) */

.system-config-key {
  width: 25%;
  text-align: right;
  text-transform: uppercase;
  padding-right: 1vw;
  color: #ee6a44;
}

.system-config-value {
  border-bottom: #42b983 solid 1px;
}

.modal-default-button {

  height: 2vw;
  width: 5vw;
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  cursor: pointer;
  border-radius: .25rem;
  margin: 0 10px;
}

.modal-default-button:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}

.save-alert {
  position: absolute;
  bottom: 10px;
  left: 0px;
  padding: 10px 20px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: rgba(238, 238, 238, 0.5);
}

.fade-enter-active, .fade-leave-active {
  transform: translateX(0);
  transition: 180ms ease;
}

.fade-enter, .fade-leave-to {
  transform: translateX(-100%);
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 320px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #18172a;
}

.modal-body {
  margin: 20px 0;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-footer {
  text-align: center;
}

@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-webkit-keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.lds-spinner {
  position: relative;
}

.lds-spinner div {
  left: 94px;
  top: 48px;
  position: absolute;
  -webkit-animation: lds-spinner linear 1s infinite;
  animation: lds-spinner linear 1s infinite;
  background: #93dbe9;
  width: 12px;
  height: 24px;
  border-radius: 40%;
  -webkit-transform-origin: 6px 52px;
  transform-origin: 6px 52px;
}

.lds-spinner div:nth-child(1) {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-animation-delay: -0.916666666666667s;
  animation-delay: -0.916666666666667s;
}

.lds-spinner div:nth-child(2) {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  -webkit-animation-delay: -0.833333333333333s;
  animation-delay: -0.833333333333333s;
}

.lds-spinner div:nth-child(3) {
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
  -webkit-animation-delay: -0.75s;
  animation-delay: -0.75s;
}

.lds-spinner div:nth-child(4) {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -webkit-animation-delay: -0.666666666666667s;
  animation-delay: -0.666666666666667s;
}

.lds-spinner div:nth-child(5) {
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  -webkit-animation-delay: -0.583333333333333s;
  animation-delay: -0.583333333333333s;
}

.lds-spinner div:nth-child(6) {
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}

.lds-spinner div:nth-child(7) {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-animation-delay: -0.416666666666667s;
  animation-delay: -0.416666666666667s;
}

.lds-spinner div:nth-child(8) {
  -webkit-transform: rotate(210deg);
  transform: rotate(210deg);
  -webkit-animation-delay: -0.333333333333333s;
  animation-delay: -0.333333333333333s;
}

.lds-spinner div:nth-child(9) {
  -webkit-transform: rotate(240deg);
  transform: rotate(240deg);
  -webkit-animation-delay: -0.25s;
  animation-delay: -0.25s;
}

.lds-spinner div:nth-child(10) {
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
  -webkit-animation-delay: -0.166666666666667s;
  animation-delay: -0.166666666666667s;
}

.lds-spinner div:nth-child(11) {
  -webkit-transform: rotate(300deg);
  transform: rotate(300deg);
  -webkit-animation-delay: -0.083333333333333s;
  animation-delay: -0.083333333333333s;
}

.lds-spinner div:nth-child(12) {
  -webkit-transform: rotate(330deg);
  transform: rotate(330deg);
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

.lds-spinner {
  width: 200px !important;
  height: 200px !important;
  -webkit-transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
  transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
}

.lds-css {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, .5);
}

.lds-css.show {
  display: flex;
}
</style>
