<template>
    <div>
        <el-row>
            <el-button type="primary" icon="el-icon-plus" @click="plus">新增</el-button>
        </el-row>
        <el-row class="pt-3">
            <fox-table
                    v-if="table.show"
                    highlight-current-row
                    v-loading="table.loading"
                    :column="table.column"
                    :data="GlobalRuleData"
            >
            </fox-table>
        </el-row>
    </div>
</template>

<script>
    import foxTable from '@/components/fox-table'

    export default {
        name: "GlobalRule",
        components: {
            foxTable
        },
        props: {
            GlobalRuleData: {
                type: Array
            }
        },
        data() {
            return {
                table: {
                    show: true,
                    data: [],
                    column: [],
                    loading: false,
                },
            }
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
            }
        },
        methods: {
            plus() {
                this.GlobalRuleData.push({
                    digits: '*',
                    pattern: '',
                    message: '',
                    priority: '1'
                })
            },
            minus(index) {
                this.GlobalRuleData.splice(index, 1)
            },
            setI18n() {
                this.table = {
                    ...this.table,
                    show: false,
                    column: [
                        {
                            label: '操作',
                            prop: 'oper',
                            width: 100,
                            render: (h, {row, $index}) => {
                                return (
                                    <div class="oper-btn">
                                        <el-button plain icon="el-icon-plus" size="small"
                                                   onClick={this.plus}></el-button>
                                        <el-button plain icon="el-icon-minus" size="small"
                                                   onClick={() => this.minus($index)}></el-button>
                                    </div>
                                )
                            }
                        },
                        {
                            label: '优先级',
                            prop: 'priority',
                            render: (h, scope) => {
                                let options = [
                                    {value: '1', label: '优先运行'},
                                    {value: '0', label: '最后运行'}
                                ]
                                return (
                                    <el-select
                                        vModel={scope.row.priority}
                                        class="w-full"
                                    >
                                        {
                                            options.map(({value, label}) => {
                                                return (
                                                    <el-option value={value} label={label}></el-option>
                                                )
                                            })
                                        }
                                    </el-select>
                                )
                            }
                        },
                        {
                            label: '规则（正则表达式）',
                            prop: 'pattern',
                            render: (h, scope) => {
                                return (
                                    <el-input
                                        vModel={scope.row.pattern}
                                        size="small"
                                        clearable={true}
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '提示文本',
                            prop: 'message',
                            render: (h, scope) => {
                                return (
                                    <el-input
                                        vModel={scope.row.message}
                                        size="small"
                                        clearable={true}
                                    ></el-input>
                                )
                            }
                        },
                    ],
                }
                this.$nextTick(() => {
                    this.table = {
                        ...this.table,
                        show: true
                    }
                })
            }
        },
        created() {
            this.setI18n()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .oper-btn {
        .el-button {
            width: 32px;
            height: 32px;
            padding: 0;
            text-align: center;
            line-height: 32 xp;
        }
    }
</style>