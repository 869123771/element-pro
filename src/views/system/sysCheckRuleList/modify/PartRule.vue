<template>
    <fox-table
            v-if="table.show"
            highlight-current-row
            v-loading="table.loading"
            :column="table.column"
            :data="partRuleData"
    >
    </fox-table>
</template>

<script>
    import foxTable from '@/components/fox-table'

    export default {
        name: "PartRule",
        components: {
            foxTable
        },
        props: {
            partRuleData: {
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
            plus(){
                this.partRuleData.push({
                    digits : undefined,
                    pattern : '',
                    message : ''
                })
            },
            minus(index){
                this.partRuleData.splice(index,1)
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
                            render: (h, {row,$index}) => {
                                return (
                                    <div class="oper-btn">
                                        <el-button plain icon="el-icon-plus" size="small" onClick = {this.plus}></el-button>
                                        {
                                            $index > 0 ? <el-button plain icon="el-icon-minus" size="small" onClick = {()=>this.minus($index)}></el-button> : ''
                                        }
                                    </div>
                                )
                            }
                        },
                        {
                            label: '位数',
                            prop: 'digits',
                            render: (h, scope) => {
                                return (
                                    <el-tooltip
                                        content="位数不能为空"
                                        placement="top"
                                    >
                                        <el-input-number
                                            vModel={scope.row.digits}
                                            min={1}
                                            size="small"
                                            class="w-full"
                                        ></el-input-number>
                                    </el-tooltip>
                                )
                            }
                        },
                        {
                            label: '规则（正则表达式）',
                            prop: 'pattern',
                            render: (h, scope) => {
                                return (
                                    <el-tooltip
                                        content="规则不能为空"
                                        placement="top"
                                    >
                                        <el-input
                                            vModel={scope.row.pattern}
                                            size="small"
                                            clearable={true}
                                        ></el-input>
                                    </el-tooltip>
                                )
                            }
                        },
                        {
                            label: '提示文本',
                            prop: 'message',
                            render: (h, scope) => {
                                return (
                                    <el-tooltip
                                        content="提示文本不能为空"
                                        placement="top"
                                    >
                                        <el-input
                                            vModel={scope.row.message}
                                            size="small"
                                            clearable={true}
                                        ></el-input>
                                    </el-tooltip>
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