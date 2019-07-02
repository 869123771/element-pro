<template>
    <div class="modify">
        <avue-form :option="form.option" v-model="form.model" ref="form">
        </avue-form>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {phoneCheck} from '@/utils/modules/validate'
    import {http, apiList, constant, sweetAlert} from '@/utils'

    let customParams = {}

    let DIC = {
        MENU_TYPE: [
            {label: '一级菜单', value: '0'},
            {label: '子菜单', value: '1'},
            {label: '按钮/权限', value: '2'},
        ],
    }

    export default {
        name: "Modify",
        data() {
            return {
                form: {
                    option: {
                        menuBtn: false,
                        labelWidth : 100,
                        column: [
                            {
                                label: '菜单类型',
                                type: 'radio',
                                prop: 'menuType',
                                dicData: DIC.MENU_TYPE,
                                span: 24,
                                change : ({value})=>{
                                    let redirectIndex = this.$refs.form.findColumnIndex('redirect');
                                    let prevMenuIndex = this.$refs.form.findColumnIndex('parentId');
                                    console.log(this.form)
                                    let {option:{column}} = this.form
                                    debugger;
                                    switch (value) {
                                        case '0' :
                                            column[redirectIndex].display = true
                                            column[prevMenuIndex].display = false
                                            break;
                                        case '1' :
                                            column[redirectIndex].display = false
                                            column[prevMenuIndex].display = true
                                            break;
                                    }
                                }
                            },
                            {
                                label: '菜单名称',
                                prop: 'name',
                                rules: [
                                    {required: true, message: '必填', trigger: 'change'}
                                ],
                                span: 24
                            },
                            {
                                label: '父级菜单',
                                prop: 'parentId',
                                type : 'cascader',
                                dictData : [],
                                props : {
                                    value : 'id',
                                    label : 'name'
                                },
                                display : false,
                                span: 24
                            },
                            {
                                label: '菜单路径',
                                prop: 'url',
                                span: 24,
                            },
                            {
                                label: '前端组件',
                                prop: 'component',
                                span: 24
                            },
                            {
                                label: '默认跳转地址',
                                prop: 'redirect',
                                display : true,
                                span: 24
                            },
                            {
                                label: '菜单图标',
                                prop: 'icon',
                                span: 24
                            },
                            {
                                label: '排序',
                                prop: 'sortNo',
                                type: 'number',
                                span: 24
                            },
                            {
                                label: '是否路由',
                                prop: 'route',
                                type: 'switch',
                                span: 24
                            },
                            {
                                label: '隐藏路由',
                                prop: 'hide',
                                type: 'switch',
                                span: 24
                            },
                            {
                                label: '聚合路由',
                                prop: 'alwaysShow',
                                type: 'switch',
                                span: 24
                            },
                        ]
                    },
                    model: {
                        menuType: '0',
                        route: true,
                        hide: false,
                        alwaysShow: false
                    }
                },
                selectTree: {
                    data: this.menus,
                    defaultProps: {
                        children: 'children',
                        label: 'menuName'
                    },
                    nodeKey: 'menuId',
                    defaultCheckedKeys: ''
                }
            }
        },
        computed: {
            ...mapState({
                menus: ({system}) => system.menus
            })
        },
        methods: {
            setParentMenu() {
                debugger;
                this.$nextTick(()=>{
                    debugger;
                    this.$refs.form.updateDic('parentId', this.menus)
                })
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
            this.setParentMenu()
        }
    }
</script>

<style scoped>

</style>