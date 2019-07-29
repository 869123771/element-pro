<template>
    <avue-form v-model="form.model" :option="form.option" ref="form">
    </avue-form>
</template>

<script>
    export default {
        name: "copy",
        props : {
            data : {
                type : Object
            }
        },
        data(){
            return {
                form: {
                    option: {
                        menuBtn: false,
                        labelWidth: 120,
                        column: [
                            {
                                label: '被复制的项目id',
                                prop: 'id',
                                disabled : true,
                                span: 24
                            },
                            {
                                label: '被复制的项目key',
                                prop: 'projectKey',
                                disabled : true,
                                span: 24
                            },
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
                            {
                                label: '是否默认',
                                prop: 'isDefault',
                                type : 'radio',
                                props : {
                                    label : 'label',
                                    value : 'value'
                                },
                                dicData : [
                                    {label : '是',value : true},
                                    {label : '否',value : false},
                                ],
                                span: 24,
                            }
                        ]
                    },
                    model: {}
                },
            }
        },
        watch : {
            data : {
                handler(props) {
                    if (!this.validatenull(props)) {
                        let {model} = this.form
                        this.form = {
                            ...this.form,
                            model : {
                                ...model,
                                ...props
                            }
                        }
                    }
                },
                immediate : true
            },
        },
    }
</script>

<style scoped>

</style>