<template>
    <div class = "single">
        <el-tag type = "primary" class = "rounded-none">题目设置</el-tag>
        <div class = "mt-6">
            <el-row>
                <div class = " item-container border-solid border-b border-gray-300">
                    <span>整题设置</span>
                </div>
                <div class = "item-container border-solid border-b border-gray-300 flex justify-between">
                    <div>此题必答</div>
                    <div>
                        <el-switch v-model = "selectWg.paramsConfig.isConfirmDo"></el-switch>
                    </div>
                </div>
                <div class = "item-container border-solid border-b border-gray-300 flex justify-between">
                    <div>题型</div>
                    <div class = "flex items-center">
                        <el-radio-group v-model = "selectWg.paramsConfig.questionType" size = "small" @change="questionTypeChange">
                            <el-radio-button label = "singleSelect">单选</el-radio-button>
                            <el-radio-button label = "multiSelect">多选</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class = "item-container border-solid border-b border-gray-300 flex justify-between">
                    <div>
                        <span>逻辑设置</span>
                        <el-tooltip placement="top" effect="light">
                        <span slot = "content">
                            加入逻辑设置后，答题者可根据回答,<br/>从而跳转或显示不同题目
                        </span>
                            <span class = "fa fa-fw fa-question-circle-o cursor-pointer"></span>
                        </el-tooltip>
                    </div>
                    <div>
                        <el-button type = "text">设置</el-button>
                    </div>
                </div>
            </el-row>
            <el-row class = "mt-3">
                <div class = "item-container border-solid border-b border-gray-300">
                    <span>选项设置</span>
                </div>
                <div class = "item-container border-solid border-b border-gray-300 flex justify-between">
                    <div>选项随机排列</div>
                    <div>
                        <el-switch v-model = "selectWg.paramsConfig.randomOrder"></el-switch>
                    </div>
                </div>
                <div v-if = "selectWg.paramsConfig.randomOrder">
                    <div class = "item-container border-solid border-b border-gray-300 flex justify-between">
                        <div class = "pl-2">固定最后一个选项</div>
                        <div>
                            <el-switch v-model = "selectWg.paramsConfig.fixedLastItem"></el-switch>
                        </div>
                    </div>
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'
    import {deepClone} from '30-seconds-of-code'

    export default {
        name: "WgSingleSelectConfig",
        computed: {
            ...mapState({
                pageData : ({app}) => app.pageData,
                selectWg: ({app}) => app.selectWg,

            })
        },
        methods : {
            ...mapMutations({
                setSelectWg : 'SET_SELECT_WG',
                setPageData : 'SET_PAGE_DATA'
            }),
            questionTypeChange(type){
                let selectWg = {
                    ...this.selectWg,
                    type
                }
                this.handlePageData(selectWg)
                this.setSelectWg(selectWg)
            },
            handlePageData(selectWg){
                let {list} = this.pageData
                list.forEach(item=>{
                    if(item.key === selectWg.key){
                        item.type = selectWg.type
                    }
                })
                this.setPageData(deepClone(this.pageData))
            },
        }
    }
</script>

<style scoped lang = "less">
    .single{
        .item-container{
            height : 50px;
            line-height : 50px;
        }
    }
</style>