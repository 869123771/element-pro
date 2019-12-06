<template>
    <div>
        <el-row>
            <el-col :span = "4" class = "question-type">
                <div class = "border-solid border-b border-gray-300 px-2 py-3">选择题</div>
                <draggable
                        tag="ul"
                        :list="question.select"
                        :group="{ name:'widget', pull:'clone',put:false}"
                        :sort="false"
                        ghostClass="ghost"
                        class = "question-type-widget-container"
                >
                    <template v-for="{name,iconClass} in question.select">
                        <li class="question-type-widget-label">
                            <a><span class = "pr-1" :class = "iconClass"></span>{{name}}</a>
                        </li>
                    </template>
                </draggable>
            </el-col>
            <el-col :span = "14" class = "px-3">
                <widget-form></widget-form>
            </el-col>
            <transition name = "slide">
                <el-col :span = "6">
                    <el-card class = "card-option" shadow="never" v-if = "!isEmpty(selectWg)">
                        <component :is = "component.is"></component>
                    </el-card>
                </el-col>
            </transition>
        </el-row>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import Draggable from 'vuedraggable'
    import WidgetForm from './askSit/WidgetForm'
    import WgSingleSelectConfig from './askSit/widgetForm/wgFormList/WgSingleSelectConfig'
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "AskSit",
        components : {
            Draggable,
            WidgetForm
        },
        data(){
            return {
                isEmpty,
                component : {
                    is : WgSingleSelectConfig,
                },
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
                            iconClass : 'fa fa-dot-circle-o',
                            paramsConfig : {
                                isConfirmDo : true,              //此题必答
                                questionType : 'single',         //单选
                                randomOrder : false,              //选项随机排列
                                fixedLastItem : false,              //固定最后一个选项
                            }
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
        },
        computed: {
            ...mapState({
                selectWg: ({app}) => app.selectWg,
            })
        },
    }
</script>

<style scoped lang = "less">
    .question-type{
        background-color: #fafafa;
        border-right : 1px solid #dde5ed;
        &-widget-container{
            padding : 0.25rem
        }
        &-widget-label{
            font-size: 14px;
            display: block;
            width: 46%;
            line-height: 32px;
            position: relative;
            float: left;
            left: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 2%;
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
    .card-option{
        position: fixed;
        width: 22%;
        bottom: 0;
        top: 50px;
        border-radius: 0px;
    }
    .slide-enter, .slide-leave-to {
        width : 0;
    }
    .slide-leave, .slide-enter-to {
        width : 22%;
    }
    .slide-enter-active, .slide-leave-active {
        transition: all .2s
    }
</style>