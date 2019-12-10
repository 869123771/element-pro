<template>
    <div class = "multi">
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
                        <el-radio-group v-model = "selectWg.paramsConfig.questionType" size = "small">
                            <el-radio-button label = "single">单选</el-radio-button>
                            <el-radio-button label = "multi">多选</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
            </el-row>

        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "WgMultiSelectConfig",
        computed: {
            ...mapState({
                selectWg: ({app}) => app.selectWg,
            })
        },
    }
</script>

<style scoped lang = "less">
    .multi{
        .item-container{
            height : 50px;
            line-height : 50px;
        }
    }
</style>