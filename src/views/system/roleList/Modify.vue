<template>
    <div class = "modify">
        <avue-form v-model="form.model" :option="form.option" ref="form">

        </avue-form>
    </div>
</template>

<script>
    import {http, apiList, constant,sweetAlert} from '@/utils'

    export default {
        name: "Modify",
        data(){
            return {
                form: {
                    option: {
                        menuBtn: false,
                        column: [
                            {
                                label : '角色名称',
                                prop: 'roleName',
                                span: 24,
                                rules : [
                                    {required : true,message:'必填',trigger:'change'}
                                ]
                            },
                            {
                                label : '角色编码',
                                prop: 'roleCode',
                                span: 24
                            },
                            {
                                label : '描述',
                                prop: 'description',
                                type : 'textarea',
                                span: 24
                            },
                        ]
                    },
                    model: {}
                }
            }
        },
        methods : {
            async saveData(){
                await http.post()
            }
        },
    }
</script>

<style scoped>

</style>