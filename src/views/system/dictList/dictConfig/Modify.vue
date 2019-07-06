<template>
    <div class = "modify">
        <avue-form v-model="form.model" :option="form.option" ref="form">
            <template slot = "status" slot-scope = "scope">
                <el-radio-group v-model = "form.model.status">
                    <template v-for = "item in dictItemStatus">
                        <el-radio-button :label = "item.itemValue">{{item.itemText}}</el-radio-button>
                    </template>
                </el-radio-group>
            </template>
        </avue-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, constant,sweetAlert} from '@/utils'

    export default {
        name: "Modify",
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
                        column: [
                            {
                                label : '名称',
                                prop: 'itemText',
                                span: 24,
                                rules : [
                                    {required : true,message:'必填',trigger:'change'}
                                ]
                            },
                            {
                                label : '数据值',
                                prop: 'itemValue',
                                span: 24,
                                rules : [
                                    {required : true,message:'必填',trigger:'change',}
                                ]
                            },
                            {
                                label : '描述',
                                prop: 'description',
                                span: 24
                            },
                            {
                                label : '排序值',
                                type : 'number',
                                prop: 'sortOrder',
                                span: 24
                            },
                            {
                                label : '是否启用',
                                prop: 'status',
                                formslot : true,
                                span: 24
                            },
                        ]
                    },
                    model: {
                        status : '1'
                    }
                }
            }
        },
        computed : {
            ...mapState({
                dictItemStatus : ({dict}) => dict.dictItemStatus
            })
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
        methods : {
            saveData(){
                let {id} = this.data
                let {model} = this.form
                let params = {
                    ...model
                }
                if(id){
                    this.updateDictItem(params)
                }else{
                    this.addDictItem(params)
                }
            },
            async addDictItem(params){
                let {success,message} = await http.post(apiList.sys_dict_item_add,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
            async updateDictItem(params){
                let {success,message} = await http.put(apiList.sys_dict_item_edit,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            }
        },
    }
</script>

<style scoped>

</style>