<template>
    <div>
        <el-form ref="form" :model="form" label-width="100px" :rules="rules" status-icon>
            <el-form-item v-bind="formParams.ruleName">
                <el-input v-model="form.ruleName" placeholder="规则名称" clearable></el-input>
            </el-form-item>
            <el-form-item v-bind="formParams.ruleCode" :rules="[
                 {required : true, message : '必填',trigger : 'change'},
                 data.id ? {} : {validator : this.uniqueCheck}
            ]">
                <el-input v-model="form.ruleCode" placeholder="规则Code" clearable :disabled="data.id"></el-input>
            </el-form-item>
            <el-form-item v-bind="formParams.ruleClass">
                <el-input v-model="form.ruleClass" placeholder="规则实现类" clearable></el-input>
            </el-form-item>
            <el-form-item v-bind="formParams.ruleParams">
                <el-input type="textarea" v-model="form.ruleParams" placeholder="规则参数" rows="4"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "Modify",
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                form: {
                    dataRule: '',
                    ruleCode: '',
                    ruleClass: '',
                    ruleParams: ''
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
                    ruleClass: {
                        label: '规则实现类',
                        prop: 'ruleClass'
                    },
                    ruleParams: {
                        label: '规则参数',
                        prop: 'ruleParams'
                    }
                },
                rules: {
                    ruleName: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    ruleClass: [
                        {required: true, message: '必填', trigger: 'change'}
                    ]
                }
            }
        },
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                        this.form = {
                            ...this.form,
                            ...props
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
                let params = {
                    ...this.form,
                }
                let res = {}
                if (id) {
                    res = await http.put(apiList.sys_fill_rule_edit, params)
                } else {
                    res = await http.post(apiList.sys_fill_rule_add, params)
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