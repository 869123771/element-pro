<template>
    <!--// 下拉框中树形高度
    // 下拉框中树形宽度
    // 输入框的尺寸: medium/small/mini
    // 树结构的数据
    // 树结构的props
    // 多选
    // 可清空选择
    // 多选时将选中值按文字的形式展示
    // 多选时，严格遵循父子不互相关联

    // 绑定nodeKey，默认绑定'id'

    // 传递默认选中的节点key组成的数组
    // 事件有两个参数：第一个是所有选中的节点ID，第二个是所有选中的节点数据-->

    <select-tree :height="400"
                 :width="200"
                 size="small"
                 :data="data"
                 :defaultProps="defaultProps"
                 multiple
                 clearable
                 collapseTags
                 checkStrictly
                 :nodeKey="nodeKey"
                 :checkedKeys="defaultCheckedKeys"
                 @popoverHide="popoverHide">
    </select-tree>

</template>

<script>
    import SelectTree from '@/components/selectTree';

    var menus = [
        {
            'menuId': 1,
            'menuName': '系统管理',
            'childrenList': [
                {
                    'menuId': 100,
                    'menuName': '用户管理',
                    'childrenList': [
                        {
                            'menuId': 1000,
                            'menuName': '用户查询'
                        },
                        {
                            'menuId': 1001,
                            'menuName': '用户新增'
                        },
                        {
                            'menuId': 1002,
                            'menuName': '用户修改'
                        },
                        {
                            'menuId': 1003,
                            'menuName': '用户删除'
                        }
                    ]
                },
                {
                    'menuId': 101,
                    'menuName': '角色管理',
                    'childrenList': [
                        {
                            'menuId': 1006,
                            'menuName': '角色查询'
                        },
                        {
                            'menuId': 1007,
                            'menuName': '角色新增'
                        },
                        {
                            'menuId': 1008,
                            'menuName': '角色修改'
                        },
                        {
                            'menuId': 1011,
                            'menuName': '删除角色'
                        }
                    ]
                }
            ]
        }
    ];
    export default {
        name: "DepartUserList",
        components: {SelectTree},
        data() {
            return {
                data: menus,
                defaultProps: {
                    children: 'childrenList',
                    label: 'menuName'
                },
                nodeKey: 'menuId',
                defaultCheckedKeys: []
            };
        },
        created() {
        },
        mounted() {
            // 组建中增加了监听数据变化的，
            // 此处初始化defaultCheckedKeys的值，有效果
            this.defaultCheckedKeys = [1001];
        },
        methods: {
            // 改变默认选中的节点数据
            initChecked() {
                this.defaultCheckedKeys = [1006, 1007];
            },
            popoverHide(checkedIds, checkedData) {
                console.log(checkedIds);
                console.log(checkedData);
            }
        }
    };
</script>

<style scoped>

</style>