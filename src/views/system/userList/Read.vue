<template>
    <div class="read my-4">
        <el-row class = "pl-6">
            <el-form :model="form" label-width="85px">
                <el-form-item label="用户账号">
                    <span>{{form.username}}</span>
                </el-form-item>
                <el-form-item label="用户名字">
                    <span>{{form.realname}}</span>
                </el-form-item>
                <el-form-item label="角色分配">
                    <span>{{form.roleName}}</span>
                </el-form-item>
                <el-form-item label="生日">
                    <span>{{form.birthday}}</span>
                </el-form-item>
                <el-form-item label="性别">
                    <span>{{form.sex_dictText}}</span>
                </el-form-item>
                <el-form-item label="邮箱">
                    <span>{{form.email}}</span>
                </el-form-item>
                <el-form-item label="手机号码">
                    <span>{{form.phone}}</span>
                </el-form-item>
                <el-form-item label="工作流引擎">
                    <span>{{form.activitiSync}}</span>
                </el-form-item>
                <el-form-item label="头像">
                    <el-avatar :src="form.avatar"></el-avatar>
                </el-form-item>
                <el-form-item label = "部门分配">
                    <el-tree
                            ref="tree"
                            show-checkbox
                            default-expand-all
                            check-strictly
                            node-key="id"
                            :data="form.dept.data"
                            :props="form.dept.defaultProps"
                    ></el-tree>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, constant} from '@/utils'

    export default {
        name: "Read",
        props: {
            data: {
                type: Object
            },
        },
        data() {
            return {
                form: {
                    dept: {
                        data: [],
                        defaultProps: {
                            children: 'children',
                            label: 'departName'
                        },
                    }
                },
            }
        },
        computed: {
            ...mapState({
                roles: ({system}) => system.roles,
                activitiSync: ({dict}) => dict.activitiSync,
                dept: ({system}) => system.dept,
            })
        },
        watch: {
            data: {
                handler(props) {
                    if (props) {
                        this.getUserRole(props)
                        this.getUserDept(props)
                    }
                },
                immediate: true
            }
        },
        methods: {
            handleAvatar(avatar) {
                let {config: {baseUrl: {imgDomainURL}}} = constant
                return {avatar: `${imgDomainURL}/${avatar}`}
            },
            async getUserRole(row) {
                let {id: userid, activitiSync, avatar} = row
                let {dept} = this.form
                let {success, result} = await http.get(apiList.sys_role_query_user_role, {userid})
                if (success) {
                    let roleName = this.roles.filter(item => result.includes(item.id)).map(item => item.roleName).join(',')
                    activitiSync = this.activitiSync.filter(item => item.itemValue === activitiSync).map(item => item.itemText).join(',')
                    this.form = {
                        ...this.form,
                        ...row,
                        roleName,
                        activitiSync,
                        ...this.handleAvatar(avatar),
                        dept: {
                            ...dept,
                            data: this.dept
                        }
                    }
                }
            },
            async getUserDept(row) {
                let {id: userId} = row
                let {success, result} = await http.get(apiList.sys_dept_query_by_user, {userId})
                if (success) {
                    let defaultCheckedKeys = result.map(item => item.value)
                    this.$refs.tree.setCheckedKeys(defaultCheckedKeys);
                }
            },
        }
    }
</script>

<style scoped>

</style>