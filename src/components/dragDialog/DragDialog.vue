<template>
    <modal name="modal"
           class="modal"
           draggable=".modal-header"
           transition="nice-modal-fade"
           :adaptive="true"
           width="25%"
           :min-width="300"
           :min-height="300"
           :delay="100"
           :resizable="true"
    >
        <div class="modal-header">
            <div class="modal-header-title">新增用户</div>
            <div class="modal-header-close el-icon-close" @click="$modal.hide('modal')"></div>
        </div>

        <slot></slot>
    </modal>
</template>
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
            &-close {
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
</style>