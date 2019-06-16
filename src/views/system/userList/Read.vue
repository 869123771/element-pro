<template>
    <div class = "read">
        <el-scrollbar>
            <avue-form :option="detail.option" v-model="detail.model">
                <template v-for = "prop in detailPropsList" :slot="prop" slot-scope = "{value}">
                    <span>{{value}}</span>
                </template>
                <template slot="avatar" slot-scope = "{value}">
                    <avue-avatar :src = "value"></avue-avatar>
                </template>
                <template slot="dept" slot-scope = "{value}">
                    <el-tree
                            ref = "tree"
                            show-checkbox
                            default-expand-all
                            check-strictly
                            node-key = "id"
                            :data="value.data"
                            :props="value.defaultProps"
                    ></el-tree>
                </template>
            </avue-form>
        </el-scrollbar>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, constant} from '@/utils'
    export default {
        name: "Read",
        props : {
            data : {
                type : Object
            },
        },
        data(){
            return {
                detailPropsList : [
                    'username',
                    'realname',
                    'roleName',
                    'birthday',
                    'sex_dictText',
                    'email',
                    'phone',
                    'activitiSync',
                ],
                detail : {
                    option: {
                        menuBtn : false,
                        labelWidth : 100,
                        column: [
                            {
                                label: '用户账号',
                                prop: 'username',
                                formslot: true,
                                span: 24
                            },
                            {
                                label: '用户名字',
                                prop: 'realname',
                                formslot: true,
                                span: 24
                            },
                            {
                                label: '角色分配',
                                prop: 'roleName',
                                formslot: true,
                                span: 24
                            },
                            {
                                label: '生日',
                                prop: 'birthday',
                                formslot: true,
                                span: 24
                            },
                            {
                                label: '性别',
                                prop: 'sex_dictText',
                                formslot: true,
                                span: 24
                            },
                            {
                                label: '邮箱',
                                prop: 'email',
                                formslot: true,
                                span: 24
                            },
                            {
                                label: '手机号码',
                                prop: 'phone',
                                formslot: true,
                                span: 24
                            },
                            {
                                label: '工作流引擎',
                                prop: 'activitiSync',
                                formslot: true,
                                span: 24
                            },
                            {
                                label: '头像',
                                prop: 'avatar',
                                span: 24,
                                formslot: true,
                            },
                            {
                                label: '部门分配',
                                prop: 'dept',
                                formslot: true,
                                span: 24
                            },
                        ]
                    },
                    model: {
                        dept : {
                            data : [],
                            defaultProps : {
                                children: 'children',
                                label: 'departName'
                            },
                        }
                    }
                },
            }
        },
        computed : {
            ...mapState({
                roles: ({system}) => system.roles,
                activitiSync : ({dict}) => dict.activitiSync,
                depts: ({system}) => system.depts,
            })
        },
        watch : {
            data : {
                handler(props){
                    if(props){
                        this.getUserRole(props)
                        this.getUserDept(props)
                    }
                },
                immediate : true
            }
        },
        methods : {
            handleAvatar(avatar){
                let {config:{baseUrl:{imgDomainURL}}} = constant
                return {avatar : `${imgDomainURL}/${avatar}`}
            },
            async getUserRole(row) {
                let {id: userid,activitiSync,avatar} = row
                let {model : {dept}} = this.detail
                let {success, result} = await http.get(apiList.sys_role_query_user_role, {userid})
                if (success) {
                    let roleName = this.roles.filter(item => result.includes(item.id)).map(item => item.roleName).join(',')
                    activitiSync = this.activitiSync.filter(item => item.itemValue === activitiSync).map(item => item.itemText).join(',')
                    this.detail = {
                        ...this.detail,
                        model: {
                            ...row,
                            roleName,
                            activitiSync,
                            ...this.handleAvatar(avatar),
                            dept : {
                                ...dept,
                                data : this.depts
                            }
                        }
                    }
                }
            },
            async getUserDept(row) {
                let {id: userId} = row
                let {success, result} = await http.get(apiList.sys_dept_query_by_user, {userId})
                if (success) {
                    let defaultCheckedKeys = result.map(item=>item.value)
                    this.$refs.tree.setCheckedKeys(defaultCheckedKeys);
                }
            },
        }
    }
</script>

<style scoped>

</style>