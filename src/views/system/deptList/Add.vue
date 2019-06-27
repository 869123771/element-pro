<template>
    <div class = "add">
        <avue-form :option="form.option" v-model="form.model" ref="add">

        </avue-form>
    </div>
</template>

<script>
    import {phoneCheck} from '@/utils/modules/validate'

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
                                span: 24
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
                                disabled: true,
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
                                maxlength: 200,
                                span: 24
                            },
                        ]
                    },
                    modal : {

                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>