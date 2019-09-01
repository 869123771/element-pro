<template>
    <el-tree
            :props="tree.props"
            :load="loadNode"
            @node-click = "nodeClick"
            lazy
    >
         <span slot-scope="{ node, data }">
            <span v-if = "data.isLeaf"><i class = "fa fa-fw fa-file-o"></i></span>
             <span v-else><i class = "fa fa-fw fa-folder-open-o"></i></span>
            <span class = "pl-3">{{ node.label }}</span>
         </span>
    </el-tree>
</template>

<script>
    import {http, apiList, sweetAlert} from '@/utils'

    export default {
        name: "SelectFold",
        data() {
            return {
                tree : {
                    current : {},
                    props: {
                        label: 'title',
                        children: 'children',
                        isLeaf: 'isLeaf'
                    },
                }
            };
        },
        methods : {
            nodeClick(current){
                this.tree = {
                    ...this.tree,
                    current
                }
            },
            loadNode(node, resolve) {
                let {level,data,data:{key}={}} = node
                if (!level) {
                    this.getParentNode(resolve)
                }else{
                    this.getChildNode(key,resolve)
                }
            },
            async getParentNode(resolve){
                let {success,result} = await http.get(apiList.online_form_head_root_file_fold_list)
                if(success){
                    resolve(result)
                }
            },
            async getChildNode(parentPath,resolve){
                let {success,result} = await http.get(apiList.online_form_head_file_fold_list,{parentPath})
                if(success){
                    resolve(result)
                }
            },
        }
    }
</script>

<style scoped>

</style>