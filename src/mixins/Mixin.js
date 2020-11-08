export const Mixin = {
    created: function () {
        this.hello()
    },
    methods: {
        hello: function () {
            // console.log('MIXIN IS HERE')
        },
        dateToTime(date = {}) {

            /*
            It works for browser but
            doesn't work for plazma screen

            let options = {
                // era: 'long',
                // year: 'numeric',
                // month: 'numeric',
                // day: 'numeric',
                // weekday: 'long',
                // timezone: 'UTC',
                hour: 'numeric',
                minute: 'numeric',
                // second: 'numeric'
            };

            return dateObj.toLocaleString("ru", options);
            */

            let hour = date.getHours();
            let minutes = date.getMinutes();
            minutes = minutes > 9 ? minutes : '0' + minutes;
            return hour + ":" + minutes;
            // return hour + ":" + String(minutes).padStart(2, "0");
        },

        /*
        * Date format for Date.parse for plazma screen:
        * Y-m-dTH:i:s
        * or
        * Y-m-dTH:i:sZ
        * */

        objDate(date) {

            let dateObj;

            if (!date)
                dateObj = new Date();

            if (date)
                dateObj = new Date(Date.parse(date));

            return dateObj;
        }
    }
}
