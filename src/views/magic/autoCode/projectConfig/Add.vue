<template>
    <avue-form v-model="form.model" :option="form.option" ref="form">
    </avue-form>
</template>

<script>
    import {http,apiList,sweetAlert} from '@/utils'
    export default {
        name: "Add",
        data(){
            return {
                form: {
                    option: {
                        menuBtn: false,
                        labelWidth: 80,
                        column: [
                            {
                                label: '名称',
                                prop: 'name',
                                span: 24,
                                rules : [
                                    {required : true, message : '必填',trigger : 'change'}
                                ]
                            },
                            {
                                label: '备注',
                                prop: 'remark',
                                type : 'textarea',
                                maxlength:100,
                                showWordLimit:true,
                                span: 24
                            },
                        ]
                    },
                    model: {}
                },
            }
        },
        methods : {
            async saveData(){
                let {model} = this.form
                let params = {
                    ...model,
                    type : 1,
                    token : 'wangyang'
                }
                let {data:{success}} = await http.ajax('post',apiList.project_config_add_project,params)
                if(success){
                    sweetAlert.successWithTimer('操作成功')
                    this.$emit('closeDialog')
                }
            }
        }
    }
</script>

<style scoped>

</style>