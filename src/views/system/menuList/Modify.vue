<template>
    <div class="modify">
        <el-form :model="form" l="form" :rules="rules" ref = "form" label-width="100px" :status-icon = "true">
            <el-form-item label = "菜单类型">
                <el-radio-group v-model = "form.menuType">
                    <template v-for = "item in menuType">
                        <el-radio :label = "item.itemValue">{{item.itemText}}</el-radio>
                    </template>
                </el-radio-group>
            </el-form-item>
            <template v-if = "form.menuType === '2'">
                <el-form-item label = "按钮/权限" prop = "name">
                    <el-input v-model = "form.name" placeholder = "请输入按钮名称" clearable ></el-input>
                </el-form-item>
                    <el-form-item label = "父级菜单">
                        <el-cascader
                                :options="menus"
                                :props="{ checkStrictly: true,label:'name',value : 'id'}"
                                clearable
                                filterable
                                class = "w-full"
                        >
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label = "菜单路径">
                        <el-input v-model = "form.url" placeholder = "请输入菜单路径" clearable></el-input>
                    </el-form-item>
                    <el-form-item label = "授权标识">
                        <el-input v-model = "form.url" placeholder = "多个用逗号分隔, 如: user:list,user:create" clearable></el-input>
                    </el-form-item>
                    <el-form-item label = "授权策略">
                        <el-radio-group v-model = "form.permsType">
                            <template v-for = "item in permissionType">
                                <el-radio :label = "item.itemValue">{{item.itemText}}</el-radio>
                            </template>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label = "状态">
                        <el-radio-group v-model = "form.status">
                            <template v-for = "item in validStatus">
                                <el-radio :label = "item.itemValue">{{item.itemText}}</el-radio>
                            </template>
                        </el-radio-group>
                    </el-form-item>
            </template>
            <template v-else>
                <el-form-item label = "菜单名称" prop = "name">
                    <el-input v-model = "form.name" placeholder = "请输入菜单名称" clearable ></el-input>
                </el-form-item>
                <template v-if = "form.menuType === '1'">
                    <el-form-item label = "父级菜单">
                        <el-cascader
                                :options="menus"
                                :props="{ checkStrictly: true,label:'name',value : 'id'}"
                                clearable
                                filterable
                                class = "w-full"
                        >
                        </el-cascader>
                    </el-form-item>
                </template>
                <el-form-item label = "菜单路径">
                    <el-input v-model = "form.url" placeholder = "请输入菜单路径" clearable></el-input>
                </el-form-item>
                <el-form-item label = "前端组件">
                    <el-input v-model = "form.component" placeholder = "请输入菜单组件" clearable></el-input>
                </el-form-item>
                <template v-if = "form.menuType === '0'">
                    <el-form-item label = "默认跳转地址">
                        <el-input v-model = "form.redirect" placeholder = "请输入默认跳转地址" clearable></el-input>
                    </el-form-item>
                </template>
                <el-form-item label = "菜单图标">
                    <el-input v-model = "form.icon" placeholder = "请输入菜单图标" clearable>
                        <i slot="suffix" class="el-input__icon el-icon-setting" @click = "checkIcons"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label = "排序">
                    <el-input-number v-model = "form.sortNo" :min = "0" class = "w-full"></el-input-number>
                </el-form-item>
                <el-form-item label = "是否路由">
                    <el-switch v-model = "form.route"></el-switch>
                </el-form-item>
                <el-form-item label = "隐藏路由">
                    <el-switch v-model = "form.hide"></el-switch>
                </el-form-item>
                <el-form-item label = "聚合路由">
                    <el-switch v-model = "form.alwaysShow"></el-switch>
                </el-form-item>
            </template>
        </el-form>
        <drag-dialog :drag-dialog="dialog">
            <icons></icons>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {phoneCheck} from '@/utils/modules/validate'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import Icons from './icon/Icons'
    import DragDialog from '@/components/dragDialog'

    let customParams = {}

    export default {
        name: "Modify",
        components : {
            Icons,
            DragDialog
        },
        data() {
            return {
                form : {
                    menuType: '0',                  //菜单类型
                    name : '',                      //菜单名称
                    parentId : '',                  //父级菜单
                    url : '',                       //菜单路径
                    component : '',                 //前端组件
                    redirect : '',                  //默认跳转地址
                    icon : '',                      //菜单图标
                    sortNo : '',                    //排序
                    route: true,                    //是否路由
                    hide: false,                    //隐藏路由
                    alwaysShow: false,              //聚合路由
                    permsType : '',                  //授权策略
                    status : '1'                      //状态
                },
                rules : {
                    name : [
                        {required : true, message : '必填',trigger :'change'}
                    ]
                },
                dialog: {
                    width: '80',
                    height: '80',
                    name: 'iconSelect',
                    title: '图标选择',
                    showFooter: true,
                },
            }
        },
        computed: {
            ...mapState({
                menus: ({system}) => system.menus,
                menuType : ({dict}) => dict.menuType,
                permissionType : ({dict}) => dict.permissionType,
                validStatus : ({dict}) => dict.validStatus
            })
        },
        methods: {
            ...mapActions({
                getMenuType : 'GET_MENU_TYPE',
                getPermissionType : 'GET_PERMISSION_TYPE',
                getValidStatus : 'GET_VALID_STATUS',
            }),
            checkIcons(){
                let {name} = this.dialog
                this.$modal.show(name)
            },
            async saveData() {
                let {model} = this.form
                let params = {
                    ...model
                }
                let {success, message} = await http.post(apiList.sys_menu_add, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('successClose')
                } else {
                    sweetAlert.error(message)
                }
            }
        },
        mounted() {
            this.getMenuType()
            this.getPermissionType()
            this.getValidStatus()
        }
    }
</script>

<style scoped>
    @import '../../../views/iconfont/iconfont.css';
</style>