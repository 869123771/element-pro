<template>
    <el-dialog v-draggable="options"
               v-bind="$attrs"
               v-on="$listeners"
               :visible.sync ="dialog.visible"
               :fullscreen.sync="dialog.fullscreen"
               :close-on-click-modal = "dialog.closeOnClickModal"
    >
        <div slot="title">
            <span>{{dialog.title}}</span>
            <span class="arrow">
                <i class="fa fa-fw fa-arrows-alt" v-if="!dialog.fullscreen" @click="full"></i>
                <i class="fa fa-fw fa-arrows" v-else @click="exit"></i>
            </span>
        </div>
        <slot></slot>
    </el-dialog>
</template>

<script>
    export default {
        name: "DragDialog",
        props: {

        },
        watch: {
            $attrs : {
                handler(props){
                    debugger;
                    let {fullscreen,visible,closeOnClickModal} = props
                    if(!fullscreen){
                        fullscreen = false
                    }
                    if(!visible){
                        visible = false
                    }
                    if(!closeOnClickModal){
                        closeOnClickModal = false
                    }
                    this.dialog = {
                        ...this.dialog,
                        ...props,
                        fullscreen,
                        visible,
                        closeOnClickModal
                    }
                },
                immediate : true
            },
        },
        data() {
            return {
                options: {
                    trigger: '.el-dialog__header',
                    body: '.el-dialog',
                    recover: true
                },
                dialog : {}
            }
        }
        ,
        methods: {
            full() {
                this.dialog = {
                    ...this.dialog,
                    fullscreen : true
                }
            }
            ,
            exit() {
                this.dialog = {
                    ...this.dialog,
                    fullscreen : false
                }
            },
            /*closeDialog(){
                this.dialog = {
                    ...this.dialog,
                    visible: false
                }
            }*/
        }
    }
</script>

<style scoped lang="less">
    .arrow {
        display: inline-block;
        float: right;
        padding-right: 1.25rem;
        color: #909399;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        vertical-align: baseline;
        -webkit-font-smoothing: antialiased;
        font-size: 16px;
        cursor: pointer;
    }
</style>