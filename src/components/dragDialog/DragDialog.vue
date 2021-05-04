<template>
    <modal
            v-bind="$attrs"
            v-on="$listeners"
            ref="modal"
            :name="dialog.name"
            class="modal"
            :draggable="'.modal-header' || true"
            transition="nice-modal-fade"
            :adaptive="true"
            :scrollable="dialog.height ? false : true"
            :min-width="dialog.minWidth"
            :min-height="dialog.minHeight"
            :delay="100"
            :clickToClose="dialog.clickToClose"
            :width="dialog.width || '100'"
            :height="dialog.height || 'auto'"
            :resizable="dialog.resizable"
            v-loading="dialogLoading"
    >
        <div class="modal-header" v-if="dialog.showHeader">
            <div class="modal-header-title" v-html="dialog.title"></div>
            <div class="modal-header-control" v-if="dialog.showHeaderHandle">
                <div class="modal-header-control-screen">
                    <div class="iconfont icon-wy-compress handle-icon px-1 hover:color-blue-500 "
                         v-if="dialog.fullScreen" @click="exit"></div>
                    <div class="iconfont icon-wy-expend handle-icon px-1 hover:color-blue-500 " v-else
                         @click="full"></div>
                </div>
                <div class="modal-header-control-close el-icon-close handle-icon hover:color-blue-500 hover:rotate-180"
                     @click="close"></div>
            </div>
        </div>
        <!--style=" max-height: calc(100vh - 130px)"-->
        <div class="modal-body">
            <slot></slot>
        </div>
        <template v-if="dialog.showFooter">
            <div class="modal-footer text-center">
                <el-button plain @click="close" v-show="dialog.showCancelBtn">{{$t('common_cancel')}}</el-button>
                <el-button type="primary" :loading="dialog.loading" @click="confirm">{{dialog.confirmText ||
                    $t('common_confirm')}}
                </el-button>
            </div>
        </template>
        <template v-else>
            <slot name="footer"></slot>
        </template>
    </modal>
</template>
<script>
    import {constant} from '@/utils'
    import {mapState} from "vuex";

    export default {
        name: "DragDialog",
        props: {
            dragDialog: {
                type: Object
            }
        },
        computed: {
            ...mapState({
                dialogLoading: ({app}) => app.dialogLoading
            })
        },
        watch: {
            dragDialog: {
                handler(props) {
                    let {dialog} = constant
                    this.dialog = {
                        ...dialog,
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
            return {
                dialog: {},
            }
        }
        ,
        methods: {
            full() {
                this.$refs.modal.modal = {
                    ...this.$refs.modal.modal,
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
                    heightType: Number(height) > 100 ? 'px' : '%',
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
                this.$emit('confirm', this.dialog.name)
            }
        }
    }
</script>

<style scoped lang="less">
    .modal {
        z-index: 1200;

        /deep/ .v--modal {
            border-radius: 0px;
        }

        &-header {
            height: 56px;
            padding: 0 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
            border-bottom: solid #f7fafc;

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
            padding: 22px 1rem 0;
            overflow: auto;
        }

        &-footer {
            position: absolute;
            bottom: 0px;
            background: #fff;
            z-index: 10;
            width: 100%;
            border-top: 1px solid #f7fafc;
            height: 60px;
            line-height: 60px;
            min-height: 60px;
        }

        /deep/ .vue-modal-resizer {
            z-index: 10;
        }
    }
</style>
