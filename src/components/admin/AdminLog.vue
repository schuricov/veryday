<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal-wrap">

                <table class="modal-table">

                    <tr class="modal-row modal-row-user">
                        <td class="user">
                            User:
                        </td>
                        <td>
                            <input class="input"
                                   placeholder="Please enter email"
                                   v-model="inputUser"
                            >
                        </td>
                    </tr>
                    <tr class="modal-row modal-row-pass">
                        <td class="pass"
                            @click="switchVisibility">
                            Pass:
                        </td>
                        <td>
                            <input class="input"
                                   placeholder="Password"
                                   v-model="inputPass"
                                   v-on:keyup.enter="submit"
                                   :type="passwordFieldType"
                            >
                        </td>
                    </tr>

                    <tr class="modal-row modal-row-mess">
                        <td colspan="2">
                            {{mess}}
                        </td>
                    </tr>
<!--                    <tr class="modal-row modal-row-close">-->
<!--                        <td colspan="2"-->
<!--                            @click="close">-->
<!--                            Close-->
<!--                        </td>-->
<!--                    </tr>-->

                </table>

            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'adminLog',
        data() {

            return {
                inputUser: null,
                inputPass: null,
                passwordFieldType: 'password',
                mess: 'Please enter data...',
                statusLocal: null
            }
        },
        props: {
            // status: {required: true},
        },
        mounted() {
            if (this.status !== '') {

                this.mess = this.status;
            }

            this.$on('returnMess', function (data) {
                console.log(data)
            });

            this.$bus.$on('login', data => {
                this.mess = data.mess;
            })
        },
        methods: {
            close() {
                this.$emit('close');
            },
            submit() {
                this.$emit('submitEvent', {user: this.inputUser, pass: this.inputPass});
            },
            switchVisibility() {
                this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
            }
        },
    };
</script>

<style>
    table {
        /*border: solid 1px #5eeec5;*/
    }

    tr {
        /*border: solid 1px #ee5c14;*/
    }

    td {
        /*border: solid 1px #eeae5f;*/
    }

    div {
        /*border: solid 1px #edecee;*/
    }

    .modal-wrap {
        width: 20%;
        height: 20%;
    }

    .modal-table {
        width: 100%;
        height: 100%;
    }

    .modal-row {
        height: 25%;
    }

    .user, .pass {
        width: 40%;
        text-align: right;
        padding-right: 1vw;
    }

    .modal-row-user, .modal-row-pass {
        border-bottom: solid 1px #42b983;
    }

    .modal-row-mess, .modal-row-close {
        color: #505050;
    }

    .input {
        background-color: rgba(0, 0, 0, 0);
        color: #edecee;
        border-color: rgba(0, 0, 0, 0);
        width: 100%;
        height: 100%;
    }

    .input:focus {
        outline: none !important;
    }

    @-webkit-keyframes autofill {
        to {
            color: inherit;
            background: transparent;
        }
    }

    input:-webkit-autofill {
        -webkit-animation-name: autofill;
        -webkit-animation-fill-mode: both;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
