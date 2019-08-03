<template>
    <avue-form v-model="form.model" :option="form.option" ref="form">

    </avue-form>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    import {http,apiList,sweetAlert} from '@/utils'
    export default {
        name: "ProxyManConfig",
        props : {
            proxyMan : {
                type : Object,
            }
        },
        data(){
            return {
                form: {
                    option: {
                        menuBtn: false,
                        labelWidth: 100,
                        column: [
                            {
                                label: '用户名',
                                prop: 'userName',
                                readonly : true,
                                span: 24
                            },
                            {
                                label: '代理人用户名',
                                prop: 'agentUserName',
                                span: 24
                            },
                            {
                                label: "代理开始时间",
                                prop: "startTime",
                                type: "datetime",
                                format: "yyyy-MM-dd hh:mm:ss",
                                valueFormat: "yyyy-MM-dd hh:mm:ss",
                                span : 24
                            },
                            {
                                label : '代理结束时间',
                                prop: "endTime",
                                type: "datetime",
                                format: "yyyy-MM-dd hh:mm:ss",
                                valueFormat: "yyyy-MM-dd hh:mm:ss",
                                span : 24
                            },
                            {
                                label : '状态',
                                prop: 'status',
                                type : 'radio',
                                span: 24,
                            },
                        ]
                    },
                    model: {}
                },
            }
        },
        computed : {
            ...mapState({
                validStatus : ({dict}) => dict.validStatus
            })
        },
        methods : {
            ...mapActions({
                getValidStatus : 'GET_VALID_STATUS',
            }),
            setValidStatus(){
                this.$refs.form.updateDic('status', this.getValidStatus)
            },
            async getProxyUserInfo(){
                let {username:userName} = this.proxyMan
                let {success,result} = await http.get(apiList.sys_user_agent_user_info_query,{userName})
                if(success){
                    let {model} = this.form
                    this.form = {
                        ...this.form,
                        model: {
                            ...model,
                            ...result,
                        }
                    }
                }
            }
        },
        created(){
            this.getValidStatus()
        },
        mounted(){
            this.getProxyUserInfo()
            this.setValidStatus()
        }
    }
</script>

<style scoped>

</style>