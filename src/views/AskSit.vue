<template>
    <div>
        <el-row>
            <el-col :span = "4" class = "question-type">
                <div>选择题</div>
                <draggable
                        tag="ul"
                        :list="question.select"
                        :group="{ name:'widget', pull:'clone',put:false}"
                        :sort="false"
                        ghostClass="ghost"
                >
                    <template v-for="{name,iconClass} in question.select">
                        <li class="question-type-widget-label">
                            <a><span class = "pr-1" :class = "iconClass"></span>{{name}}</a>
                        </li>
                    </template>
                </draggable>
            </el-col>
            <el-col :span = "12" class = "mx-3">
                <widget-form></widget-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Draggable from 'vuedraggable'
    import WidgetForm from './askSit/WidgetForm'

    export default {
        name: "AskSit",
        components : {
            Draggable,
            WidgetForm
        },
        data(){
            return {
                question : {
                    select : [
                        {
                            type : "singleSelect",
                            name : '单选题',
                            value : '',
                            list : [
                                {value : '1',label : '选项1'},
                                {value : '2',label : '选项2'},
                            ],
                            iconClass : 'fa fa-dot-circle-o'
                        },
                        {
                            type : "multiSelect",
                            name : '多选题',
                            iconClass : 'fa fa-check-square',
                            list : [
                                {value : '1',label : '选项1'},
                                {value : '2',label : '选项2'},
                            ],
                        },
                    ]
                }
            }
        }
    }
</script>

<style scoped lang = "less">
    .question-type{
        background-color: #fafafa;
        border-right : 1px solid #dde5ed;
        &-widget-label{
            font-size: 14px;
            display: block;
            width: 48%;
            line-height: 32px;
            position: relative;
            float: left;
            left: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 1%;
            color: #333;
            border: 1px solid #d8d8d8;
            cursor: move;
            background: #fff;
            text-align : center;
        }
        &-widget-label:hover{
            color: #409eff;
            border: 1px dashed #409eff;
        }
    }
</style>