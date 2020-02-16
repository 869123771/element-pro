<template>
    <div class="message">
        <el-popover
                placement="bottom"
                trigger="click"
                popover-class="message-popover"
                width="350"
        >
            <el-tabs v-model="tabs.activeName">
                <el-tab-pane :label="`我的消息(${tabs.myMessage.total})`" name="myMessage" lazy>
                    <el-row class="message-item" type="flex" align="center">
                        <el-col :span="18" class="flex items-center">标题</el-col>
                        <el-col :span="6" class="text-center flex justify-center items-center">
                            <span>紧急度</span>
                        </el-col>
                    </el-row>
                    <template v-for="{titile,time,priority} in tabs.myMessage.data">
                        <el-row class="message-item" type="flex" align="center">
                            <el-col :span="18" class="flex items-center">{{titile}}</el-col>
                            <el-col :span="6" class="text-center flex justify-center items-center">
                                <template v-if="priority === 'L'">
                                    <el-tag type="primary">一般</el-tag>
                                </template>
                                <template v-else-if="priority === 'M'">
                                    <el-tag type="warning">紧急</el-tag>
                                </template>
                                <template v-else>
                                    <el-tag type="danger">特级</el-tag>
                                </template>
                            </el-col>
                        </el-row>
                    </template>
                    <el-row>
                        <div class="message-more">
                            <el-link type="primary" @click="$router.push('/isps/userAnnouncement')">加载更多</el-link>
                        </div>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane :label="`系统通告(${tabs.sysAnnouncement.total})`" name="sysAnnouncement">
                    <el-row class="message-item" type="flex" align="center">
                        <el-col :span="18" class="flex items-center">标题</el-col>
                        <el-col :span="6" class="text-center flex justify-center items-center">
                            <span>紧急度</span>
                        </el-col>
                    </el-row>
                    <template v-for="{titile,time,priority} in tabs.sysAnnouncement.data">
                        <el-row class="message-item" type="flex" align="center">
                            <el-col :span="18" class="flex items-center">{{titile}}</el-col>
                            <el-col :span="6" class="text-center flex justify-center items-center">
                                <template v-if="priority === 'L'">
                                    <el-tag type="primary">一般</el-tag>
                                </template>
                                <template v-else-if="priority === 'M'">
                                    <el-tag type="warning">紧急</el-tag>
                                </template>
                                <template v-else>
                                    <el-tag type="danger">特级</el-tag>
                                </template>
                            </el-col>
                        </el-row>
                    </template>
                    <el-row>
                        <div class="message-more">
                            <el-link type="primary" @click="$router.push('/isystem/annountCement')">加载更多</el-link>
                        </div>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
            <el-badge :value="`${tabs.myMessage.total + tabs.sysAnnouncement.total}`" slot="reference">
                <i class="el-icon-bell cursor-pointer"></i>
            </el-badge>
        </el-popover>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'

    export default {
        name: "Message",
        data() {
            return {
                tabs: {
                    activeName: 'myMessage',
                    myMessage: {
                        data: [],
                        total: 0,
                    },
                    sysAnnouncement: {
                        data: [],
                        total: 0,
                    }
                }
            }
        },
        computed: {
            ...mapState({
                priority: ({dict}) => dict.priority,
            })
        },
        methods: {
            ...mapActions({
                getPriority: 'GET_PRIORITY',
            }),
            async messageQuery() {
                let params = {
                    pageNo: 1,
                    pageSize: 5,
                }
                let {success, result: {records: data, total}} = await http.get(apiList.sys_my_message_query_list, params)
                if (success) {
                    this.tabs.myMessage = {
                        ...this.tabs.myMessage,
                        data,
                        total
                    }
                }
            },
            async sysAnnouncementQuery() {
                let params = {
                    pageNo: 1,
                    pageSize: 5,
                }
                let {success, result: {records: data, total}} = await http.get(apiList.sys_sys_announcement_query_list, params)
                if (success) {
                    this.tabs.sysAnnouncement = {
                        ...this.tabs.sysAnnouncement,
                        data,
                        total
                    }
                }
            },
        },
        created() {
            this.getPriority()

        },
        mounted() {
            this.messageQuery()
            this.sysAnnouncementQuery()
        }
    }
</script>

<style scoped lang="less">
    .message {
        line-height: 56px;
        padding: 0 12px;
        display: inline-block;
        width: auto;

        /deep/ .el-badge__content.is-fixed {
            top: 16px;
        }

        &-item {
            border-bottom: 1px solid #ebeaec;
            padding: 0.5rem;
            cursor: pointer;
        }

        &-item:hover {
            background-color: #f0faff;
        }

        &-more {
            border-bottom: 1px solid #ebeaec;
            padding: 0.5rem;
            cursor: pointer;
            text-align: center;
        }
    }
</style>