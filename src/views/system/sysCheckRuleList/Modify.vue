<template>
    <div>
        <el-row>
            <el-form ref="form" :model="form" label-width="100px" :rules="rules" status-icon>
                <el-form-item v-bind="formParams.ruleName">
                    <el-input v-model="form.ruleName" placeholder="规则名称" clearable></el-input>
                </el-form-item>
                <el-form-item v-bind="formParams.ruleCode" :rules="[
                 {required : true, message : '必填',trigger : 'change'},
                 data.id ? {} : {validator : this.uniqueCheck}
            ]">
                    <el-input v-model="form.ruleCode" placeholder="规则Code" clearable :disabled="Boolean(data.id)"></el-input>
                </el-form-item>
                <el-form-item v-bind="formParams.ruleDescription">
                    <el-input type="textarea" v-model="form.ruleDescription" placeholder="规则描述" rows="4"></el-input>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-tabs v-model="tabs.active">
                <el-tab-pane name="part" label="局部规则">
                    <el-row>
                        <el-alert
                                type="info"
                                title="局部规则按照你输入的位数有序的校验。"
                                show-icon
                                :closable="false"
                        >
                        </el-alert>
                    </el-row>
                    <el-row class="mt-3">
                        <part-rule :part-rule-data="ruleData.partRuleData"></part-rule>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane name="global" label="全局规则">
                    <el-row>
                        <el-alert
                                type="info"
                                title="全局规则可校验用户输入的所有字符；全局规则的优先级比局部规则的要高。。"
                                show-icon
                                :closable="false"
                        >
                        </el-alert>
                    </el-row>
                    <el-row class="mt-3">
                        <global-rule :global-rule-data="ruleData.globalRuleData"></global-rule>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {isEmpty} from '30-seconds-of-code'
    import PartRule from "./modify/PartRule";
    import GlobalRule from "./modify/GlobalRule";

    export default {
        name: "Modify",
        props: {
            data: {
                type: Object
            }
        },
        components: {
            PartRule,
            GlobalRule
        },
        data() {
            return {
                form: {
                    dataRule: '',
                    ruleCode: '',
                    ruleDescription: ''
                },
                formParams: {
                    ruleName: {
                        label: '规则名称',
                        prop: 'ruleName'
                    },
                    ruleCode: {
                        label: '规则Code',
                        prop: 'ruleCode'
                    },
                    ruleDescription: {
                        label: '规则描述',
                        prop: 'ruleDescription'
                    }
                },
                tabs: {
                    active: 'part'
                },
                ruleData: {
                    partRuleData: [{
                        digits: undefined,
                        pattern: '',
                        message: ''
                    }],
                    globalRuleData: []
                },
                rules: {
                    ruleName: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                }
            }
        },
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                        let {ruleJson} = props
                        this.form = {
                            ...this.form,
                            ...props
                        }
                        let parseRuleJson = JSON.parse(ruleJson)
                        let partRuleData = parseRuleJson.filter(item => item.digits !== '*')
                        let globalRuleData = parseRuleJson.filter(item => item.digits === '*')
                        this.ruleData = {
                            partRuleData,
                            globalRuleData
                        }
                    }
                },
                immediate: true
            },
        },
        methods: {
            async uniqueCheck(rule, fieldVal, callback) {
                let params = {
                    tableName: 'sys_fill_rule',
                    fieldName: 'rule_code',
                    fieldVal,
                }
                let {success, message} = await http.get(apiList.sys_dict_unique_check, params)
                if (!success) {
                    callback(new Error(message));
                } else {
                    callback();
                }
            },
            async saveData() {
                let {id} = this.data
                let {partRuleData, globalRuleData} = this.ruleData
                let params = {
                    ...this.form,
                    ruleJson: JSON.stringify([...partRuleData, ...globalRuleData])
                }
                let res = {}
                if (id) {
                    res = await http.put(apiList.sys_check_rule_edit, params)
                } else {
                    res = await http.post(apiList.sys_check_rule_add, params)
                }
                let {success, message} = res
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifyResult', true)
                } else {
                    sweetAlert.error(message)
                    this.$emit('modifyResult', false)
                }
            },
        }
    }
</script>

<style scoped>

</style>