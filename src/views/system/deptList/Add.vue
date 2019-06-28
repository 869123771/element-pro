<template>
    <div class = "add">
        <avue-form :option="form.option" v-model="form.model" ref="form">

        </avue-form>
    </div>
</template>

<script>
    import {phoneCheck} from '@/utils/modules/validate'
    import {http,apiList,constant,sweetAlert} from '@/utils'

    export default {
        name: "Add",
        data(){
            return {
                form : {
                    option : {
                        menuBtn : false,
                        column : [
                            {
                                label: '机构名称',
                                prop: 'departName',
                                span: 24,
                                rules : [
                                    {required : true, message : '必填',trigger:'change'}
                                ]
                            },
                            {
                                label: '手机号',
                                prop: 'mobile',
                                span: 24,
                                rules: [
                                    {validator: phoneCheck, trigger: 'change'}
                                ]
                            },
                            {
                                label: '传真',
                                prop: 'fax',
                                span: 24
                            },
                            {
                                label: '地址',
                                prop: 'address',
                                span: 24
                            },
                            {
                                label: '排序',
                                prop: 'departOrder',
                                type: 'number',
                                span: 24
                            },
                            {
                                label: '备注',
                                prop: 'memo',
                                type: 'textarea',
                                span: 24
                            },
                        ]
                    },
                    modal : {

                    }
                }
            }
        },
        methods : {
            async saveData(){
                let {modal} = this.form
                let params = {
                    ...modal
                }
                let {success,message} = await http.post(apiList.sys_dept_add,params)
                if(success){
                    sweetAlert.successWithTimer(message)
                }else{
                    sweetAlert.error(message)
                }
            }
        }
    }
</script>

<style scoped>

</style>