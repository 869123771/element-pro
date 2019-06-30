<template>
    <div class = "auth">
        <menu-search :menu-checked-ids="menuCheckedIds" ref = "menuSearch"></menu-search>
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
                menuCheckedIds : []
            }
        },
        methods : {
            getCheckedKeys(){
                let menuRef =  this.$refs.menuSearch
                return {
                    lastpermissionIds : this.menuCheckedIds.join(','),
                    permissionIds : menuRef.$refs.tree.getCheckedKeys().join(',')
                }
            },
            async queryPermissionByRole(){
                let {id:roleId} = this.data
                let params = {
                    roleId
                }
                let {success,result} = await http.get(apiList.sys_role_query_permission_by_role,params)
                if(success){
                    this.menuCheckedIds = result
                }
            }
        },
        created(){
            this.queryPermissionByRole()
        }
    }
</script>

<style scoped>

</style>