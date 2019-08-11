export default {
    data() {
        return {

        }
    },
    methods: {
        /*
        * 关闭抽屉
        * */
        popoverConfirm() {
            this.drawer = {
                ...this.drawer,
                show: false
            }
            this.popover = {
                ...this.popover,
                drawerCancel: false
            }
        },
    },
    created() {

    },
    mounted() {},
}