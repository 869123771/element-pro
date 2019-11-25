<template>
    <div class = "proxy">
        <el-form ref = "form" :model = "form" :rules = "rules" label-width="110px">
            <el-form-item :label="$t('sys_user_account')" prop = "userName">
                <el-input v-model = "form.userName" readonly></el-input>
            </el-form-item>
            <el-form-item :label = "$t('sys_user_proxy_man_name')" prop = "agentUserName" class = "slot-label">
                <div slot = "label" class = "truncate">
                    <el-tooltip :content = "$t('sys_user_proxy_man_name')" placement="top">
                        <span>{{$t('sys_user_proxy_man_name')}}</span>
                    </el-tooltip>
                </div>
                <el-input v-model = "form.agentUserName"
                          readonly
                          suffix-icon="el-icon-more"
                          @click.native = "selectAgent"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('sys_user_proxy_time')" prop="proxyTime">
                <el-date-picker
                        class="w-full"
                        v-model="form.proxyTime"
                        type="datetimerange"
                        :start-placeholder="$t('common_time_start')"
                        :end-placeholder="$t('common_time_end')"
                        value-format="yyyy-MM-dd hh:mm:ss"
                ></el-date-picker>
            </el-form-item>
            <el-form-item :label = "$t('sys_user_status')" prop = "status">
                <el-radio-group v-model = "form.status">
                    <template v-for = "item in validStatus">
                        <el-radio :label = "item.itemValue">{{item.itemText}}</el-radio>
                    </template>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <component
                    :is="component.is"
                    :ref="component.ref"
                    :data="component.data"
                    @closeDialog="closeDialog"></component>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import SelectUserByDept from './proxyManConfig/SelectUserByDept'

    export default {
        name: "ProxyManConfig",
        props: {
            proxyMan: {
                type: Object,
            }
        },
        components: {
            DragDialog,
            SelectUserByDept
        },
        data() {
            return {
                form: {
                    status : '1',
                },
                rules : {
                    agentUserName : [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    startTime : [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    endTime : [
                        {required: true, message: '必填', trigger: 'change'}
                    ]
                },
                dialog: {
                    width: 900,
                    height: 80,
                    title: this.$t('sys_user_select_user'),
                    name : 'selectUser',
                    showFooter: true,
                },
                component: {
                    is: SelectUserByDept,
                    ref: 'selectUser',
                    data: {}
                },
            }
        },
        computed: {
            ...mapState({
                validStatus: ({dict}) => dict.validStatus
            })
        },
        methods: {
            ...mapActions({
                getValidStatus: 'GET_VALID_STATUS',
            }),
            selectAgent(){
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            closeDialog() {
                let {name} = this.dialog
                this.$modal.hide(name)
            },
            confirm(){
                let {ref} = this.component
                let {table:{selection}} = this.$refs[ref]
                let {name} = this.dialog
                let agentUserName = selection.map(item=>item.username).join(',')
                this.form = {
                    ...this.form,
                    agentUserName
                }
                this.$modal.hide(name)
            },
            async saveData(){
                let {proxyTime : [startTime,endTime],...res} = this.form

                let params = {
                    ...res,
                    startTime,
                    endTime
                }
                let {success,message} = await http.put(apiList.sys_user_agent_edit,params)
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.$emit('successClose')
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            },
            async getProxyUserInfo() {
                let {username: userName} = this.proxyMan
                let {success, result} = await http.get(apiList.sys_user_agent_user_info_query, {userName})
                if (success) {
                    this.form = {
                        ...this.form,
                        ...result,
                    }
                }
            }
        },
        mounted() {
            this.getProxyUserInfo()
            this.getValidStatus()
        }
    }
</script>

<style scoped lang = "less">
    /deep/ .slot-label{
        .el-form-item__label{
            display : flex;
            justify-content: flex-end;
        }
    }
</style>