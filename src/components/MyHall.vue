<script>

    // Helper functions:

    const getScale = (ctxSize, hallSize) => {
        return ctxSize / hallSize
    };

    const getSizeHall = (seats) => {

        let key, obj, xMin = seats[0].x, yMin = seats[0].y, xMax = 0, yMax = 0;
        for (key in seats) {
            obj = seats[key];
            if (xMin > obj.x) xMin = obj.x;
            if (yMin > obj.y) yMin = obj.y;
            if (xMax < obj.x) xMax = obj.x;
            if (yMax < obj.y) yMax = obj.y;
        }

        return {'w': xMax + xMin, 'h': yMax + yMin};
    }

    export default {

        // Gets us the provider property from the parent <my-canvas> component.
        inject: ['provider'],

        props: {
            hallScheme: {required: true},
            showtimeId: {required: false, type: Number},
        },

        data() {
            return {
                // We cache the dimensions of the previous
                // render so that we can clear the area later.
                oldHall: {},
                oldSize: {},
            }
        },

        computed: {
            calculatedBox() {

                const ctx = this.provider.context;
                const canvas = {
                    w: ctx.canvas.width,
                    h: ctx.canvas.height
                }

                const sizeHall = getSizeHall(this.hallScheme);
                const localHallScheme = {};
                const bias = {};

                const scale = {
                    w: getScale(canvas.w, sizeHall.w),
                    h: getScale(canvas.h, sizeHall.h),
                    def: 1
                };

                sizeHall.wsw = sizeHall.w * scale.w;
                sizeHall.hsw = sizeHall.h * scale.w;
                sizeHall.wsh = sizeHall.w * scale.h;
                sizeHall.hsh = sizeHall.h * scale.h;

                let biasX = 0, biasY = 0;

                if (sizeHall.wsw <= canvas.w && sizeHall.wsh > canvas.w) {
                // if (sizeHall.wsw >= canvas.w && sizeHall.hsw < canvas.h) {
                //     console.log('scale by: W')
                    scale.def = scale.w;
                    biasY = ((canvas.h - sizeHall.hsw) / 2);
                } else {
                    // console.log('scale by: H')
                    scale.def = scale.h;
                    biasX = ((canvas.w - sizeHall.wsh) / 2);
                }

                bias.x = biasX;
                bias.y = biasY;

                // console.log(canvas)
                // console.log(sizeHall)
                // console.log(bias)
                // console.log(sizeHall)

                // Get scaled coordinates
                for (let key in this.hallScheme) {
                    localHallScheme[key] = {
                        x: this.hallScheme[key].x * scale.def,
                        y: this.hallScheme[key].y * scale.def,
                        busy: this.hallScheme[key].busy
                    }
                }

                // Yes yes, side-effects. This lets us cache the box dimensions of the previous render.
                // before we re-calculate calculatedBox the next render.
                this.oldSize = sizeHall;
                this.oldHall = localHallScheme;

                return {hall: localHallScheme, bias: bias}
            }
        },
        render() {
            // Since the parent canvas has to mount first, it's *possible* that the context may not be
            // injected by the time this render function runs the first time.
            if (!this.provider.context) return;
            const ctx = this.provider.context;

            // Keep a reference to the box used in the previous render call.
            const oldHall = this.oldHall;
            const oldSize = this.oldSize;

            // Calculate the new box. (Computed properties update on-demand.)
            const newHall = this.calculatedBox;

            // Clear the old area from the previous render.
            ctx.clearRect(0, 0, oldSize.w, oldSize.h);


            this.drowHall(ctx, newHall.hall, newHall.bias.x, newHall.bias.y);

        },
        methods: {
            clearHall(ctx) {

                ctx.clearRect(0, 0, 600, 600);

            },
            drowHall(ctx, seats, biasX = 0, biasY = 0, scale = 1) {
                // console.log('DROW NEW HALL');


                let obj, key, radius = 2, cross = 1.8, lineWidth = 1.2;
                let xMin = seats[0].x, yMin = seats[0].y, xMax = 0, yMax = 0;

                ctx.scale(scale, scale);

                // Hall seats
                for (key in seats) {

                    obj = seats[key];

                    // Min/Max
                    if (xMin > obj.x) xMin = obj.x;
                    if (yMin > obj.y) yMin = obj.y;
                    if (xMax < obj.x) xMax = obj.x;
                    if (yMax < obj.y) yMax = obj.y;

                    // Hall Seats free (Circle)
                    if (!obj.busy) {
                        // ctx.strokeStyle = 'grey';
                        ctx.fillStyle = "grey";
                        ctx.beginPath();
                        ctx.arc(obj.x + biasX, obj.y + biasY, radius, 0, Math.PI * 2, true);
                        ctx.fill();
                        // ctx.stroke();
                    }

                    // Hall Seats busy (Cross)
                    if (obj.busy) {
                        ctx.beginPath();
                        ctx.lineWidth = lineWidth;
                        ctx.strokeStyle = '#a35143';
                        ctx.moveTo((obj.x - cross) + biasX, (obj.y - cross) + biasY);
                        ctx.lineTo((obj.x + cross) + biasX, (obj.y + cross) + biasY);
                        ctx.moveTo((obj.x + cross) + biasX, (obj.y - cross) + biasY);
                        ctx.lineTo((obj.x - cross) + biasX, (obj.y + cross) + biasY);
                        ctx.stroke();
                    }
                }

                // Hall frame
                // this.drawRect(ctx, biasX, biasY, (xMax + xMin), (yMax + yMin));
                // this.roundRect(ctx, biasX, biasY, (xMax + xMin), (yMax + yMin), 30, false, true, '#2e2c54', 1);
            },
            roundRect(ctx, x, y, width, height, radius = 5, fill, stroke = true, color = 'grey', lineWidth = 3) {

                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;

                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                if (stroke) {
                    ctx.stroke();
                }
                if (fill) {
                    ctx.fill();
                }
            },
            drawRect(ctx, x, y, w, h){
                ctx.beginPath();
                ctx.strokeStyle = 'red';
                // ctx.lineWidth = 1;
                ctx.rect(x, y, w, h);
                ctx.stroke();
            },
        }

    }
</script>
