<template>
    <v-dialog
            draggable
            resizable
    >
        <!--<div slot="title">
            <span>{{dialog.title}}</span>
            <span class="arrow">
                <i class="iconfont icon-expend" v-if="!dialog.fullscreen" @click="full"></i>
                <i class="iconfont icon-compress" v-else @click="exit"></i>
            </span>
        </div>-->
        hello world
        <slot></slot>
    </v-dialog>
</template>
<!--v-draggable="options"-->
<!--
 ref="dragDialog"
:close-on-click-modal="dialog.closeOnClickModal"
:visible.async="dialog.visible"
:fullscreen="dialog.fullscreen"
:width="dialog.width"
 :clickToClose = "dialog.closeOnClickModal"
@close="close"-->
<script>
    import {constant} from '@/utils'

    export default {
        name: "DragDialog",
        props: {
            dragDialog: {
                type: Object
            },
            visible: {
                type: Boolean,
                default: false
            },
            closeOnClickModal: {
                type: Boolean,
                default: false
            },
        },
        watch: {
            dragDialog: {
                handler(props) {
                    this.dialog = {
                        ...this.dialog,
                        ...props
                    }
                },
                immediate: true
            }

        },
        data() {
            let {dialog} = constant
            return {
                options: {
                    trigger: '.el-dialog__header',
                    body: '.el-dialog',
                    recover: true
                },
                dialog: {
                    ...dialog
                }
            }
        }
        ,
        methods: {
            full() {
                this.dialog = {
                    ...this.dialog,
                    fullscreen: true
                }
            },
            exit() {
                this.dialog = {
                    ...this.dialog,
                    fullscreen: false
                }
            },
            close() {
                this.dialog = {
                    ...this.dialog,
                    visible : false
                }
            }
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