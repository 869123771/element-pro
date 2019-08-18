<template>
    <div class="modify">
        <el-form ref="form" :model="form" :status-icon="true" label-width="80px" :rules="rules">
            <el-form-item :label="$t('sys_dict_item_name')" prop="itemText">
                <el-input v-model="form.itemText" :placeholder="$t('sys_dict_item_name')" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys_dict_item_value')" prop="itemValue">
                <el-input v-model="form.itemValue" :placeholder="$t('sys_dict_item_value')" clearable></el-input>
            </el-form-item>
            <el-form-item prop="sortOrder">
                <div slot = "label">
                    <span>{{$t('sys_dict_order_value')}} </span>
                    <el-tooltip :content = "$t('sys_dict_order_value_tip')" placement="top">
                        <i class = "el-icon-warning-outline"></i>
                    </el-tooltip>
                </div>
                <el-input-number :min="0"
                                 v-model="form.sortOrder"
                                 :placeholder="$t('sys_dict_order_value')"
                                 class="w-full"
                ></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('sys_dict_description')" prop="description">
                <el-input
                        type="textarea"
                        v-model="form.description"
                        :placeholder="$t('sys_dict_description')"
                        maxlength="100"
                        showWordLimit
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys_dict_is_open')" prop="status">
                <el-radio-group v-model="form.status">
                    <template v-for="item in dictItemStatus">
                        <el-radio-button :label="item.itemValue">{{item.itemText}}</el-radio-button>
                    </template>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, sweetAlert} from '@/utils'
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
                    status: '1'
                },
                rules: {
                    itemText: [
                        {required: true, message: '必填', trigger: 'change',}
                    ],
                    itemValue: [
                        {required: true, message: '必填', trigger: 'change',}
                    ]
                }
            }
        },
        computed: {
            ...mapState({
                dictItemStatus: ({dict}) => dict.dictItemStatus
            })
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
            saveData() {
                let {dictId,id} = this.data
                let params = {
                    ...this.form,
                    dictId
                }
                if (id) {
                    this.updateDictItem(params)
                } else {
                    this.addDictItem(params)
                }
            },
            async addDictItem(params) {
                let {success, message} = await http.post(apiList.sys_dict_item_add, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
            async updateDictItem(params) {
                let {success, message} = await http.put(apiList.sys_dict_item_edit, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            }
        },
    }
</script>

<style scoped>

</style>