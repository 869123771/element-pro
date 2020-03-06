import {mapState} from "vuex";
import {eleResize} from '@/utils/modules/tools'
import {debounce} from "30-seconds-of-code";

export default {
    data() {
        return {

        }
    },
    computed : {
        ...mapState({
            menuProps : ({app}) => app.menuProps
        })
    },
    watch : {
        'menuProps.collapse'(){
            let resizeDiv = document.querySelector('.layout-container')
            eleResize.on(resizeDiv,this.listenResize)
        },
    },
    methods: {

    },
    created() {
        this.$nextTick(()=>{
            window.addEventListener('resize',debounce(this.listenResize,2000));
        })
    },
    beforeDestroy() {
        window.removeEventListener("resize",debounce(this.listenResize,2000));
    },
}