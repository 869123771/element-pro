<template>
    <div class="modify">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" :status-icon="true">
            <el-form-item label="菜单类型">
                <el-radio-group v-model="form.menuType">
                    <template v-for="item in menuType">
                        <el-radio :label="item.itemValue">{{item.itemText}}</el-radio>
                    </template>
                </el-radio-group>
            </el-form-item>
            <template v-if="form.menuType === '2'">
                <el-form-item label="按钮/权限" prop="name">
                    <el-input v-model="form.name" placeholder="请输入按钮名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="父级菜单">
                    <el-cascader
                            v-model="form.parentId"
                            :options="menus"
                            :props="{ checkStrictly: true,label:'name',value : 'id'}"
                            clearable
                            filterable
                            class="w-full"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="菜单路径" prop="url">
                    <el-input v-model="form.url" placeholder="请输入菜单路径" clearable></el-input>
                </el-form-item>
                <el-form-item label="授权标识">
                    <el-input v-model="form.perms" placeholder="多个用逗号分隔, 如: user:list,user:create" clearable></el-input>
                </el-form-item>
                <el-form-item label="授权策略">
                    <el-radio-group v-model="form.permsType">
                        <template v-for="item in permissionType">
                            <el-radio :label="item.itemValue">{{item.itemText}}</el-radio>
                        </template>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <template v-for="item in validStatus">
                            <el-radio :label="item.itemValue">{{item.itemText}}</el-radio>
                        </template>
                    </el-radio-group>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入菜单名称" clearable></el-input>
                </el-form-item>
                <template v-if="form.menuType === '1'">
                    <el-form-item label="父级菜单" prop="parentId">
                        <el-cascader
                                v-model="form.parentId"
                                :options="menus"
                                :props="{ checkStrictly: true,label:'name',value : 'id'}"
                                :show-all-levels="false"
                                clearable
                                filterable
                                class="w-full"
                        >
                        </el-cascader>
                    </el-form-item>
                </template>
                <el-form-item label="菜单路径" v-if="form.menuType === '2'">
                    <el-input v-model="form.url" placeholder="请输入菜单路径" clearable></el-input>
                </el-form-item>
                <el-form-item
                        v-else
                        label="菜单路径"
                        prop="url"
                        :rules="[{required : true, message : '必填',trigger :'change'}]">
                    <el-input v-model="form.url" placeholder="请输入菜单路径" clearable></el-input>
                </el-form-item>
                <el-form-item label="前端组件" prop="component">
                    <el-input v-model="form.component" placeholder="请输入菜单组件" clearable></el-input>
                </el-form-item>
                <template v-if="form.menuType === '0'">
                    <el-form-item label="默认跳转地址">
                        <el-input v-model="form.redirect" placeholder="请输入默认跳转地址" clearable></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="菜单图标">
                    <el-input v-model="form.icon" placeholder="请输入菜单图标" readonly clearable>
                        <i slot="suffix" class="el-input__icon el-icon-setting cursor-pointer" @click="checkIcons"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="form.sortNo" :min="0" class="w-full"></el-input-number>
                </el-form-item>
                <el-form-item label="是否路由">
                    <el-switch v-model="form.route"></el-switch>
                </el-form-item>
                <el-form-item label="隐藏路由">
                    <el-switch v-model="form.hidden"></el-switch>
                </el-form-item>
                <el-form-item label="是否缓存路由">
                    <el-switch v-model="form.keepAlive"></el-switch>
                </el-form-item>
                <el-form-item label="聚合路由">
                    <el-switch v-model="form.alwaysShow"></el-switch>
                </el-form-item>
            </template>
        </el-form>
        <drag-dialog :drag-dialog="dialog" @confirm="iconChooseConfirm">
            <icons ref="icons" :icons-checked="icons"></icons>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {phoneCheck} from '@/utils/modules/validate'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import Icons from './icon/Icons'
    import DragDialog from '@/components/dragDialog'
    import {isEmpty} from '30-seconds-of-code'

    let customParams = {}

    export default {
        name: "Modify",
        components: {
            Icons,
            DragDialog
        },
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                form: {
                    menuType: '0',                  //菜单类型
                    name: '',                      //菜单名称
                    parentId: '',                  //父级菜单
                    url: '',                       //菜单路径
                    component: '',                 //前端组件
                    redirect: '',                  //默认跳转地址
                    icon: '',                      //菜单图标
                    sortNo: '',                    //排序
                    route: true,                    //是否路由
                    hidden: false,                    //隐藏路由
                    keepAlive: false,              //是否缓存路由
                    alwaysShow: false,              //聚合路由
                    permsType: '1',                  //授权策略
                    perms: '',                      //授权标识
                    status: '1'                      //状态
                },
                rules: {
                    name: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    // url : [
                    //     {required : true, message : '必填',trigger :'change'}
                    // ],
                    component: [
                        {required: true, message: '必填', trigger: 'change'}
                    ]
                },
                dialog: {
                    width: '50',
                    height: '60',
                    name: 'iconSelect',
                    title: '图标选择',
                    showFooter: true,
                },
                icons: {}
            }
        },
        computed: {
            ...mapState({
                menus: ({system}) => system.menus,
                menuType: ({dict}) => dict.menuType,
                permissionType: ({dict}) => dict.permissionType,
                validStatus: ({dict}) => dict.validStatus
            })
        },
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                        let {menuType} = props
                        this.form = {
                            ...this.form,
                            ...props,
                            menuType: menuType.toString()
                        }
                    }else{
                        this.resetFields()
                        this.$nextTick(()=>{
                            this.$refs.form.resetFields()
                        })
                    }
                },
                immediate: true
            },
        },
        methods: {
            resetFields(){
                this.form = {
                    menuType: '0',                  //菜单类型
                    name: '',                      //菜单名称
                    parentId: '',                  //父级菜单
                    url: '',                       //菜单路径
                    component: '',                 //前端组件
                    redirect: '',                  //默认跳转地址
                    icon: '',                      //菜单图标
                    sortNo: '',                    //排序
                    route: true,                    //是否路由
                    hidden: false,                    //隐藏路由
                    keepAlive: false,              //是否缓存路由
                    alwaysShow: false,              //聚合路由
                    permsType: '1',                  //授权策略
                    perms: '',                      //授权标识
                    status: '1'                      //状态
                }
            },
            checkIcons() {
                let {name} = this.dialog
                let {icon} = this.form
                if (icon) {
                    this.icons = {
                        ...this.icons,
                        name: icon,
                    }
                } else {
                    this.icons = {
                        ...this.icons,
                        name: '',
                        paneName: 'direct'
                    }
                }
                this.$modal.show(name)
            },
            iconChooseConfirm() {
                let {checked: {icon}, pane: {name: paneName}} = this.$refs.icons
                let {name} = this.dialog
                if (icon) {
                    this.form = {
                        ...this.form,
                        icon
                    }
                    this.icons = {
                        ...this.icons,
                        paneName
                    }
                    this.$modal.hide(name)
                } else {
                    sweetAlert.errorWithTimer('请选择图标')
                }
            },
            async saveData() {
                let {parentId} = this.form
                let {id} = this.data
                let params = {
                    ...this.form,
                    parentId: Array.isArray(parentId) ? parentId.slice(-1).join('') : ''
                }
                let res
                if (id) {                     //编辑
                    params = {
                        ...this.data,
                        ...params,
                        parentId: Array.isArray(parentId) ? parentId.slice(-1).join('') : parentId
                    }
                    res = await http.put(apiList.sys_menu_edit, params)
                } else {
                    res = await http.post(apiList.sys_menu_add, params)
                }
                let {success, message} = res
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('successClose')
                } else {
                    sweetAlert.error(message)
                }
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>