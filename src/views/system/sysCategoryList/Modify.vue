<template>
    <div class = "modify">
        <el-form ref = "form" :model = "form" label-width="100px" :rules = "rules" status-icon>
            <el-form-item :label = "$t('sys_dict_category_parent_node')">
                <SelectTree
                        ref = "selectTree"
                        :props = "tree.props"
                        :value = "tree.value"
                        lazy
                        @loadNode = "loadNode"
                        @getValue="getValue($event)"/>
            </el-form-item>
            <el-form-item :label = "$t('sys_dict_category_type_name')">
                <el-input v-model = "form.name" :placeholder = "$t('sys_dict_category_type_code')" clearable></el-input>
            </el-form-item>
           <!-- <el-form-item :label = "$t('sys_dict_category_type_code')">
                <el-input v-model = "form.code" :placeholder = "$t('sys_dict_category_type_code')" clearable></el-input>
            </el-form-item>-->
        </el-form>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import SelectTree from "@/components/treeSelect/TreeSelect"
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "Modify",
        components : {
            SelectTree
        },
        props : {
            data : {
                type : Object
            }
        },
        data() {
            return {
                form : {},
                tree : {
                    value : '',            // 初始ID（可选）
                    props:{                // 配置项（必选）
                        value: 'id',
                        label: 'name',
                        children: 'hasChild',
                        // disabled:true
                    },
                },
                rules : {}
            };
        },
        computed:{

        },
        watch : {
            data : {
                handler(props){
                    if(!isEmpty(props)){
                        let {pid} = props
                        this.form = {
                            ...this.form,
                            ...props
                        }
                        this.queryParentNode(pid)
                    }
                },
                immediate : true
            },
        },
        methods:{
            // 取值
            getValue(value){
                this.tree = {
                    ...this.tree,
                    value
                }
            },
            async loadNode(node,resolve){
                let {level,data:{id}={}} = node
                if (!level) {
                    let {success, result: {records: data}} = await http.get(apiList.sys_dict_category_query_list, {})
                    if(success){
                        resolve(data)
                    }
                }else{
                    let {success, result} = await http.get(apiList.sys_dict_category_query_child, {pid:id})
                    if(success){
                        resolve(result)
                    }
                }
            },
            async saveData(){
                let {id} = this.data
                let {value : pid} = this.tree
                let params = {
                    ...this.form,
                    pid
                }
                let res = {}
                if(id){
                    res = await http.put(apiList.sys_dict_category_edit, params)
                }else{
                    res = await http.post(apiList.sys_dict_category_add, params)
                }
                let {success, message} = res
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess',{pid})
                } else {
                    sweetAlert.error(message)
                }
            },
            async queryParentNode(key){
                let {success,result} = await http.get(apiList.sys_dict_category_query_parent_node_name,{key})
                if(success){
                    this.$refs.selectTree.valueTitle = result
                }
            }
        }
    }
</script>

<style scoped>

</style>