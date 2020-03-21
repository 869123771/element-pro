<template>
    <div class = "auth">
        <menu-search :menu-search="menuSearch" ref = "menuSearch" v-bind="$attrs" v-on="$listeners"></menu-search>
    </div>
</template>

<script>
    import {http,apiList,constant} from '@/utils'
    import MenuSearch from './MenuSearch'
    export default {
        name: "Auth",
        props : {
            data : {
                type : Object
            }
        },
        components : {
            MenuSearch,
        },
        data(){
            return {
                menuSearch : {
                    defaultCheckedKeys : [],
                    defaultExpandKes : [],
                    checkStrict : true,
                    show : true,
                }
            }
        },
        watch : {
            data : {
                handler(props){
                    let {id} = props
                    if(id){
                        this.queryPermissionByRole(id)
                        this.queryTreeRole()
                    }
                },
                immediate : true
            },
        },
        methods : {
            getMenuRef(){
                return this.$refs.menuSearch
            },
            getTreeRef(){
                return this.getMenuRef().$refs.tree
            },
            getCheckedKeys(){
                let {defaultCheckedKeys} = this.menuSearch
                return {
                    lastpermissionIds : defaultCheckedKeys.join(','),
                    permissionIds : this.getTreeRef().getCheckedKeys().join(',')
                }
            },
            setCheckedKeys(keys){
                this.getTreeRef().setCheckedKeys(keys)
            },
            connect(){  //父子关联
                this.menuSearch = {
                    ...this.menuSearch,
                    checkStrict : false
                }
            },
            cancelConnect(){    //取消父子关联
                this.menuSearch = {
                    ...this.menuSearch,
                    checkStrict : true
                }
            },
            selectAll(){        //全选
                let {ids} = this.menuSearch
                this.getTreeRef().setCheckedKeys(ids);
            },
            selectNone(){       //全不选
                this.getTreeRef().setCheckedKeys([]);
            },
            expandAll(){        //展开全部
                let {ids} = this.menuSearch
                this.menuSearch = {
                    ...this.menuSearch,
                    defaultExpandKes : [...ids],
                }
            },
            shrinkAll(){        //收起全部
                this.menuSearch = {
                    ...this.menuSearch,
                    show : false,
                }
                this.$nextTick(()=>{
                    this.menuSearch = {
                        ...this.menuSearch,
                        show : true,
                        defaultExpandKes : [],
                    }
                })
            },
            async queryPermissionByRole(roleId){
                let params = {
                    roleId
                }
                let {success,result} = await http.get(apiList.sys_role_query_permission_by_role,params)
                if(success){
                    this.menuSearch = {
                        ...this.menuSearch,
                        defaultCheckedKeys : result,
                        roleId
                    }
                    this.setCheckedKeys(result)
                }
            },
            async queryTreeRole() {
                let {success, result} = await http.get(apiList.sys_role_query_tree_list)
                if (success) {
                    let {ids, treeList} = result
                    this.menuSearch = {
                        ...this.menuSearch,
                        data: treeList,
                        ids,
                        defaultExpandKes: ids
                    }
                }
            }
        },

    }
</script>

<style scoped>

</style>