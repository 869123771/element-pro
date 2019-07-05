<template>
    <div class = "modify">
        <avue-form v-model="form.model" :option="form.option" ref="form">
            <template slot = "status" slot-scope = "{value}">
                <el-radio-group v-model = "form.model.status">
                    <template v-for = "item in validStatus">
                        <el-radio-button :label = "item.itemValue">{{item.itemText}}</el-radio-button>
                    </template>
                </el-radio-group>
            </template>
        </avue-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "Modify",
        data(){
            return {
                form: {
                    option: {
                        menuBtn: false,
                        labelWidth: 80,
                        props : {
                            label : 'itemText',
                            value : 'itemValue'
                        },
                        column: [
                            {
                                label: '规则名称',
                                prop: 'ruleName',
                                span: 24,
                                rules : [
                                    {required : true, message : '必填',trigger : 'change'}
                                ]
                            },
                            {
                                label: '规则字段',
                                prop: 'ruleColumn',
                                span: 24,
                            },
                            {
                                label: '条件规则',
                                prop: 'ruleConditions',
                                type : 'select',
                                span: 24,
                                rules : [
                                    {required : true, message : '必填',trigger : 'change'}
                                ]
                            },
                            {
                                label: '规则值',
                                prop: 'ruleValue',
                                span: 24,
                                rules : [
                                    {required : true, message : '必填',trigger : 'change'}
                                ]
                            },
                            {
                                label : '状态',
                                prop: 'status',
                                formslot : true,
                                type : 'radio',
                                span: 24
                            }
                        ]
                    },
                    model: {
                        status : '1'
                    }
                },
            }
        },
        methods : {
            setRuleConditions(){
                this.$refs.form.updateDic('ruleConditions', this.ruleConditions)
            },
        },
        computed : {
            ...mapState({
                ruleConditions : ({dict}) => dict.ruleConditions,
                validStatus : ({dict}) => dict.validStatus
            })
        },
        mounted(){
            this.setRuleConditions()
        }
    }
</script>

<style scoped>

</style>