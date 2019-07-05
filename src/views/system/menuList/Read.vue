<template>
    <div class = "read">
        <el-form :model="form" ref = "form" label-width="100px">
            <el-form-item label = "菜单类型">
                {{menuType.find(item=>item.itemValue == form.menuType).itemText}}
            </el-form-item>
            <template v-if = "form.menuType === '2'">
                <el-form-item label = "按钮/权限" prop = "name">
                    {{form.name}}
                </el-form-item>
                <el-form-item label = "父级菜单">
                   {{form.parentId}}
                </el-form-item>
                <el-form-item label = "菜单路径">
                    {{form.url}}
                </el-form-item>
                <el-form-item label = "授权标识">
                    {{form.perms}}
                </el-form-item>
                <el-form-item label = "授权策略">
                    {{permissionType.find(item=>item.itemValue == form.permsType).itemText}}
                </el-form-item>
                <el-form-item label = "状态">
                    {{validStatus.find(item=>item.itemValue == form.status).itemText}}
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item label = "菜单名称" prop = "name">
                    {{form.name}}
                </el-form-item>
                <template v-if = "form.menuType === '1'">
                    <el-form-item label = "父级菜单">
                       {{handleParentId()}}
                    </el-form-item>
                </template>
                <el-form-item label = "菜单路径">
                    {{form.url}}
                </el-form-item>
                <el-form-item label = "前端组件">
                    {{form.component}}
                </el-form-item>
                <template v-if = "form.menuType === '0'">
                    <el-form-item label = "默认跳转地址">
                       {{form.redirect}}
                    </el-form-item>
                </template>
                <el-form-item label = "菜单图标">
                   {{form.icon}}
                </el-form-item>
                <el-form-item label = "排序">
                   {{form.sortNo}}
                </el-form-item>
                <el-form-item label = "是否路由">
                    <span v-if = "form.route">是</span>
                    <span v-else>否</span>
                </el-form-item>
                <el-form-item label = "隐藏路由">
                    <span v-if = "form.hide">是</span>
                    <span v-else>否</span>
                </el-form-item>
                <el-form-item label = "聚合路由">
                    <span v-if = "form.alwaysShow">是</span>
                    <span v-else>否</span>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    let customParams = {
        flag : true,
        menuName : ''
    }
    export default {
        name: "Read",
        props : {
            data : {
                type : Object
            }
        },
        data(){
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
                    perms : '',                      //授权标识
                    status : '1'                      //状态
                },
            }
        },
        computed : {
            ...mapState({
                menuType : ({dict}) => dict.menuType,
                menus : ({system}) => system.menus,
                permissionType : ({dict}) => dict.permissionType,
                validStatus : ({dict}) => dict.validStatus
            })
        },
        watch : {
            data : {
                handler(props) {
                    if (!this.validatenull(props)) {
                        let {menuType} = props
                        this.form = {
                            ...this.form,
                            ...props,
                            menuType : menuType.toString()
                        }
                    }
                },
                immediate : true
            },
        },
        methods : {
            queryMenuById(menus){
                debugger;
                let {parentId} = this.form
                let {flag, menuName} = customParams
                if(flag){
                    menus.forEach(item=>{
                        let {id,children,name} = item
                        if(parentId === id){
                            customParams = {
                                ...customParams,
                                flag : false,
                                menuName : name
                            }
                            this.queryMenuById([])
                        }
                        if(children && children.length){
                            this.queryMenuById(children)
                        }
                    })
                }
                return menuName
            },
            handleParentId(){
                this.queryMenuById(this.menus)
                customParams = {
                    ...customParams,
                    flag : true
                }
                return customParams.menuName
            }
        }
    }
</script>

<style scoped>

</style>