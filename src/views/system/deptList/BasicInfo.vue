<template>
    <form-detail :detail = "detail"></form-detail>
</template>

<script>
    import FormDetail from '@/components/form/detail'
    import {isEmpty} from '30-seconds-of-code'
    export default {
        name: "BasicInfo",
        props : {
            basicInfo : {
                type : Object
            },
        },
        components : {
            FormDetail
        },
        data(){
            return {
                form : {},
                detail : {
                    options : [
                        {label : '机构名称',prop : 'departName'},
                        {label : '手机号',prop : 'mobile'},
                        {label : '上级部门',prop : 'parentId'},
                        {label : '地址',prop : 'address'},
                        {label : '排序',prop : 'departOrder'},
                        {label : '备注',prop : 'memo'},
                    ],
                    data : {}
                }
            }
        },
        watch : {
            basicInfo : {
                handler(props){
                    if(!isEmpty(props)){
                        let {parentIdName} = props
                        this.detail = {
                            ...this.detail,
                            data : {
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