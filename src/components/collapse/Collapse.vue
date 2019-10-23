<template>
    <el-collapse v-model="collapse.activeNames" class="collapse">
        <el-collapse-item :name="collapse.name">
            <template slot="title">
                <slot name="collapse-title"></slot>
            </template>
            <slot name="collapse-content"></slot>
        </el-collapse-item>
    </el-collapse>
</template>

<script>
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "Collapse",
        props: {
            collapseProps: {
                type: Object
            }
        },
        watch: {
            collapseProps: {
                handler(props) {
                    if (!isEmpty(props)) {
                        let {activeNames} = this.collapse
                        let {title, name} = props
                        if (name) {
                            activeNames = [
                                ...activeNames,
                                name
                            ]
                        }
                        this.collapse = {
                            ...this.collapse,
                            activeNames,
                            title,
                            name
                        }
                    }
                },
                immediate: true
            },
        },
        data() {
            return {
                collapse: {
                    activeNames: [],
                    title: '',
                    name: ''
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .collapse {
        border : none;
        /deep/ .el-collapse-item {
            &__header {
                font-size: 14px;
                color: #1c2438;
                font-weight: 700;
                white-space: nowrap;
                display : block;
                border-left: 4px solid #66b1ff;
                background: #f0f2f5;
                text-align:center;
                height : 42px;
                line-height: 42px;
                /deep/ .el-collapse-item__arrow{
                    display: none;
                }
            }
            &__header.is-active{
                border-bottom-color : inherit;
            }
            &__content{
                padding-bottom: 0px !important;
            }
        }
    }
</style>