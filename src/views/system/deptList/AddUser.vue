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
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods : {
            async saveData(depId){
                let {table:{selection}} = this.$refs[this.userList.ref]
                let params = {
                    depId,
                    userIdList : selection.map(item=>item.id)
                }
                let {success,message} = await http.post(apiList.sys_user_edit_dept_with_user,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('handleSuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
        },
    }
</script>

<style scoped>
    /deep/ .el-form-item{
        margin-bottom: 0px;
    }
</style>