<template>
    <modal name="modal"
           class="modal"
           draggable=".modal-header"
           transition="nice-modal-fade"
           :adaptive="true"
           :scrollable = "true"
           :min-width="300"
           :min-height="300"
           :delay="100"
           :clickToClose = "dialog.clickToClose"
           :width="dialog.width"
           :height = "dialog.height"
           :resizable="dialog.resizable"
    >
        <div class="modal-header">
            <div class="modal-header-title">{{dialog.title}}</div>
            <div class = "modal-header-control">
                <div class="modal-header-control-screen">
                    <div class = "iconfont icon-compress handle-icon" v-if="dialog.fullScreen" @click = "exit"></div>
                    <div class = "iconfont icon-expend handle-icon px-1" v-else @click = "full"></div>
                </div>
                <div class="modal-header-control-close el-icon-close handle-icon" @click="$modal.hide('modal')"></div>
            </div>
        </div>

        <slot></slot>
    </modal>
</template>
<script>
    import {constant} from '@/utils'

    export default {
        name: "DragDialog",
        props: {
            dragDialog : {
                type : Object
            }
        },
        watch: {
            dragDialog: {
                handler(props) {
                    debugger;
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
                debugger;
                this.dialog = {
                    ...this.dialog,
                    width : '100%',
                    height : '100%'
                }
            },
            exit() {
                this.dialog = {
                    ...this.dialog,
                    width : 'inherit',
                    height : 'inherit'
                }
            },
            close() {
                this.dialog = {
                    ...this.dialog,
                    visible: false
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .modal {
        &-header {
            height: 56px;
            padding: 0 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
            &-title {

            }
            &-control{
                position: absolute;
                right : 1rem;
                display : flex;
                align-items : center;
                .handle-icon {
                    display: inline-block;
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
            }

        }
    }
</style>