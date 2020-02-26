<template>
    <user-list :data = "userList" :ref = "userList.ref"></user-list>
</template>

<script>
    import UserList from "../UserList";
    import {http,apiList,sweetAlert,constant} from '@/utils'
    export default {
        name: "AddUser",
        props : {
          data : {
              type : Object
          }
        },
        components : {
            UserList
        },
        data() {
            return {
                userList: {
                    data : {},
                    ref: 'userList'
                },
            }
        },
        methods : {
            async saveData(roleId){
                let {table:{selection}} = this.$refs[this.userList.ref]
                let params = {
                    roleId,
                    userIdList : selection.map(item=>item.id)
                }
                let {success,message} = await http.post(apiList.sys_role_add_user_role,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('handleSuccess')
                } else {
                    sweetAlert.error(message)
                }
            },

        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>