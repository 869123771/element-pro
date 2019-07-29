<template>
    <modal
            ref="modal"
            :name="dialog.name"
            class="modal"
            draggable=".modal-header"
            transition="nice-modal-fade"
            :adaptive="true"
            :scrollable="true"
            :min-width="dialog.minWidth"
            :min-height="dialog.minHeight"
            :delay="100"
            :clickToClose="dialog.clickToClose"
            :width="dialog.width"
            :height="dialog.height"
            :resizable="dialog.resizable"
    >
        <div class="modal-header">
            <div class="modal-header-title">{{dialog.title}}</div>
            <div class="modal-header-control">
                <div class="modal-header-control-screen">
                    <div class="iconfont icon-wy-compress handle-icon px-1 hover:color-blue-500 " v-if="dialog.fullScreen" @click="exit"></div>
                    <div class="iconfont icon-wy-expend handle-icon px-1 hover:color-blue-500 " v-else @click="full"></div>
                </div>
                <div class="modal-header-control-close el-icon-close handle-icon hover:color-blue-500 hover:rotate-180" @click="close"></div>
            </div>
        </div>
        <el-scrollbar>
            <div class="modal-body" :style="{maxHeight:dialog.maxHeight + 'px'}">
                <slot></slot>
            </div>
        </el-scrollbar>
        <div class="modal-footer text-center" v-if="dialog.showFooter">
            <el-button plain @click="close">关闭</el-button>
            <el-button type="primary" :loading="dialog.loading" @click="confirm">确认</el-button>
        </div>
    </modal>
</template>
<script>
    import {constant} from '@/utils'

    export default {
        name: "DragDialog",
        props: {
            dragDialog: {
                type: Object
            }
        },
        watch: {
            dragDialog: {
                handler(props) {
                    this.dialog = {
                        ...this.dialog,
                        ...props,
                    }
                    this.$nextTick(() => {
                        this.exit()
                    })
                },
                immediate: true
            }

        },
        data() {
            let {dialog} = constant
            return {
                dialog: {
                    ...dialog
                },
            }
        }
        ,
        methods: {
            full() {
                this.$children[0].modal = {
                    ...this.$children[0].modal,
                    width: 100,
                    height: 100,
                    widthType: '%',
                    heightType: '%'
                }
                this.dialog = {
                    ...this.dialog,
                    fullScreen: true
                }
            },
            exit() {
                let {width, height} = this.dialog

                this.$children[0].modal = {
                    ...this.$children[0].modal,
                    width,
                    height,
                    heightType: Number(width) > 100 ? 'px' : '%',
                    widthType: Number(width) > 100 ? 'px' : '%',
                }

                this.dialog = {
                    ...this.dialog,
                    fullScreen: false
                }
            },
            close() {
                this.$modal.hide(this.dialog.name)
                this.dialog = {
                    ...this.dialog,
                    loading: false
                }
                this.$emit('close')
            },
            confirm() {
                this.$emit('confirm',this.dialog.name)
            }
        }
    }
</script>

<style scoped lang="less">
    .modal {
        z-index: 1200;
        &-header {
            height: 56px;
            padding: 0 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
            &-title {

            }
            &-control {
                position: absolute;
                right: 1rem;
                display: flex;
                align-items: center;
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
        &-body {
            padding: 0 1rem;
        }
        &-footer {
            position: absolute;
            bottom: 0px;
            background: #fff;
            z-index: 99999;
            width: 100%;
            border-top: 1px solid #e2e8f0;
            height: 60px;
            line-height: 60px;
            min-height: 60px;
        }
    }
</style>