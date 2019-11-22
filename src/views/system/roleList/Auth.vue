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
                    defaultCheckedkeys : [],
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
                let {defaultCheckedkeys} = this.menuSearch
                return {
                    lastpermissionIds : defaultCheckedkeys.join(','),
                    permissionIds : this.getTreeRef().getCheckedKeys().join(',')
                }
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
                let {menuAssign:{ids}} = this.getMenuRef()
                this.getTreeRef().setCheckedKeys(ids);
            },
            selectNone(){       //全不选
                this.getTreeRef().setCheckedKeys([]);
            },
            expandAll(){        //展开全部
                let {menuAssign:{ids}} = this.getMenuRef()
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
                        defaultCheckedkeys : result,
                        roleId
                    }
                }
            }
        },
        created(){
            //this.queryPermissionByRole()
        }
    }
</script>

<style scoped>

</style>