<template>
    <avue-detail :option="detail.option" v-model="detail.model"></avue-detail>
</template>

<script>
    export default {
        name: "BasicInfo",
        props : {
            basicInfo : {
                type : Object
            },
        },
        data(){
            return {
                detail : {
                    model : {},
                    option : {
                        column : [
                            {
                                label: '机构名称',
                                prop: 'departName',
                                span : 24,
                            },
                            {
                                label: '上级部门',
                                prop: 'parentId',
                                span : 24,
                            },
                            {
                                label: '手机号',
                                prop: 'mobile',
                                span : 24,

                            },
                            {
                                label: '地址',
                                prop: 'address',
                                span : 24,
                            },
                            {
                                label: '排序',
                                prop: 'departOrder',
                                span : 24,
                            },
                            {
                                label: '备注',
                                prop: 'memo',
                                span : 24,
                            },
                        ]
                    }
                }
            }
        },
        watch : {
            basicInfo : {
                handler(props){
                    debugger;
                    if(!this.validatenull(props)){
                        let {model} = this.detail
                        let {parentIdName} = props
                        this.detail = {
                            ...this.detail,
                            model : {
                                ...model,
                                ...props,
                                parentId : parentIdName
                            }
                        }
                    }
                },
                immediate : true
            }
        },
    }
</script>

<style scoped>

</style>