<template>
    <form-detail :detail = "detail"></form-detail>
</template>

<script>
    import {mapState} from 'vuex'
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
                        {label : '机构类别',prop : 'orgCategoryName'},
                        {label : '上级部门',prop : 'parentName'},
                        {label : '机构编码',prop : 'orgCode'},
                        {label : '排序',prop : 'departOrder'},
                        {label : '手机号',prop : 'mobile'},
                        {label : '地址',prop : 'address'},
                        {label : '备注',prop : 'memo'},
                    ],
                    data : {}
                }
            }
        },
        computed : {
            ...mapState({
                orgCategory : ({dict}) => dict.orgCategory
            })
        },
        watch : {
            basicInfo : {
                handler(props){
                    if(!isEmpty(props)){
                        let {orgCategory} = props
                        this.detail = {
                            ...this.detail,
                            data : {
                                ...props,
                                orgCategoryName : this.valueMapText(this.orgCategory,orgCategory)
                            }
                        }
                    }
                },
                immediate : true
            }
        },
        methods : {
            valueMapText(data,value){
                return data.find(item=>item.itemValue === value).itemText
            }
        }
    }
</script>

<style scoped>

</style>