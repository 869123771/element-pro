<template>
    <div class = "text-center p-3 m-3 bg-white">
        <vue2-org-tree name="test"
                       :data="deptFilter"
                       :props = "{label:'title',children: 'children'}"
                       :horizontal="horizontal"
                       :collapsable="collapsable"
                       :label-class-name="labelClassName"
                       :render-content="renderContent"
                       @on-expand="onExpand"
                       @on-node-click="onNodeClick"
        />
    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    import Vue from 'vue'
    import Vue2OrgTree from 'vue2-org-tree'
    import {sweetAlert} from '@/utils'

    Vue.use(Vue2OrgTree)

    export default {
        components: {
            Vue2OrgTree
        },
        data() {
            return {
                data: {
                    id: 0,
                    label: "XXX科技有限公司",
                    children: [
                        {
                            id: 2,
                            label: "产品研发部",
                            className : 'bg-gray-500',
                            children: [
                                {
                                    id: 5,
                                    label: "研发-前端",
                                    className : 'bg-red-500',
                                    children : [
                                        {
                                            id: '5-1',
                                            label: "Vue",
                                            className : 'bg-blue-500',
                                        },
                                    ]
                                },
                                {
                                    id: 6,
                                    label: "研发-后端"
                                },
                                {
                                    id: 9,
                                    label: "UI设计"
                                },
                                {
                                    id: 10,
                                    label: "产品经理"
                                }
                            ]
                        },
                        {
                            id: 3,
                            label: "销售部",
                            children: [
                                {
                                    id: 7,
                                    label: "销售一部"
                                },
                                {
                                    id: 8,
                                    label: "销售二部"
                                }
                            ]
                        },
                        {
                            id: 4,
                            label: "财务部"
                        },
                        {
                            id: 9,
                            label: "HR人事"
                        }
                    ]
                },
                horizontal: true,
                collapsable: false,
                expandAll: true,
                labelClassName: this.bgColor
            }
        },
        computed: {
            ...mapState({
                dept: ({system}) => system.dept,
            }),
            deptFilter(){
                return {
                    id : '1000',
                    departName : '大中华区',
                    title : '大中华区',
                    children : this.dept
                }
            },
        },
        methods: {
            ...mapActions({
                getAllDept: 'GET_ALL_DEPT',
            }),
            bgColor(bg){
                return bg.className
            },
            renderContent(h, data) {
                return data.departName;
            },
            onExpand(data) {
                if ("expand" in data) {
                    data.expand = !data.expand;
                    if (!data.expand && data.children) {
                        this.collapse(data.children);
                    }
                } else {
                    this.$set(data, "expand", true);
                }
            },
            onNodeClick(e, data) {
                sweetAlert.noStateWithTimer(data.departName);
            },
            collapse(list) {
                list.forEach(child => {
                    if (child.expand) {
                        child.expand = false;
                    }
                    child.children && this.collapse(child.children);
                });
            },
            expandChange() {
                this.toggleExpand(this.deptFilter, this.expandAll);
            },
            toggleExpand(data, val) {
                if (Array.isArray(data)) {
                    data.forEach((item)=>{
                        this.$set(item, "expand", val);
                        if (item.children) {
                            this.toggleExpand(item.children, val);
                        }
                    });
                } else {
                    this.$set(data, "expand", val);
                    if (data.children) {
                        this.toggleExpand(data.children, val);
                    }
                }
            }
        },
        mounted() {
            this.expandChange()
            this.getAllDept()
        }
    }
</script>

<style>

</style>