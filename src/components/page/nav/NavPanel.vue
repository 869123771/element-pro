<template>
    <el-tabs v-model="tabs" closable @tab-click="clickTab" @tab-remove="removeTab">
        <el-tab-pane
                v-for="{name,title,path,icon} in navTagList"
                :key="name"
                :name="path"
        >
            <span slot="label">
                <template v-if="controlShow.navTagShowIcon">
                     <i class="anticon" :class="'icon-' + icon"></i>
                </template>
                {{title}}</span>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'

    export default {
        name: "NavPanel",
        data() {
            return {
                tabs: ''
            }
        },
        computed: {
            ...mapState({
                navTagList: ({app}) => app.navTagList,
                currentNav: ({app}) => app.currentNav,
                controlShow: ({app}) => app.controlShow,
            })
        },
        watch: {
            currentNav: {
                handler(path) {
                    this.tabs = path
                    this.$router.push(path)
                },
                immediate: true
            }
        },
        methods: {
            ...mapMutations({
                removeCurrent: 'REMOVE_NAV_TAG'
            }),
            clickTab(tab) {
                this.$router.push(tab.name)
            },
            removeTab(path) {
                this.removeCurrent(path)
            }
        }
    }
</script>

<style scoped lang="less">
    .el-tabs {
        padding: 0px 0.75rem;
        height: inherit;
        /deep/ .el-tabs__header {
            margin: 0px;
        }

        /deep/ &__item:not(:first-child) {
            margin-left: 0px;
        }

        /deep/ &__item {
            background: #fff;
            margin-right: 4px;
            padding: 0 12px;
            height: 32px;
            line-height: 32px;
        }

        /deep/ &__active-bar {
            display: none;
        }

        /deep/ &__nav-next,
        /deep/ &__nav-prev {
            line-height: 32px;
        }
    }

    .el-tabs--top {
        /deep/ .el-tabs__item.is-top:nth-child(2) {
            padding-left: 12px !important;
        }

        /deep/ .el-tabs__item.is-top:last-child {
            padding-right: 12px !important;
        }
    }

    /deep/ .el-tabs__nav-wrap::after {
        height: 0px !important;
        display: none;
    }
</style>