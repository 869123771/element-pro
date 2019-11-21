<template>
    <div class = "text-center">
        <vue2-org-tree name="test"
                       :data="data"
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
    import Vue from 'vue'
    import Vue2OrgTree from 'vue2-org-tree'

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
                horizontal: false,
                collapsable: false,
                expandAll: true,
                labelClassName: this.bgColor
            }
        },
        methods: {
            bgColor(bg){
                return bg.className
            },
            renderContent(h, data) {
                return data.label;
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
                alert(data.label);
            },
            collapse(list) {
                var _this = this;
                list.forEach(function(child) {
                    if (child.expand) {
                        child.expand = false;
                    }
                    child.children && _this.collapse(child.children);
                });
            },
            expandChange() {
                this.toggleExpand(this.data, this.expandAll);
            },
            toggleExpand(data, val) {
                var _this = this;
                if (Array.isArray(data)) {
                    data.forEach(function(item) {
                        _this.$set(item, "expand", val);
                        if (item.children) {
                            _this.toggleExpand(item.children, val);
                        }
                    });
                } else {
                    this.$set(data, "expand", val);
                    if (data.children) {
                        _this.toggleExpand(data.children, val);
                    }
                }
            }
        },
        mounted() {
            this.expandChange()
        }
    }
</script>

<style>

</style>