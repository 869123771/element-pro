<template>
    <drag-dialog :drag-dialog="dialog" @confirm="confirm">
        <el-row>
            <el-form ref = "form" :model = "form" label-width="100px">
                <el-col :span = "24">
                    <el-form-item label = "过滤条件匹配">
                        <el-select v-model = "form.superQueryMatchType" clearable filterable class = "w-full">
                            <template v-for = "{value,label} in select.superQueryMatchType">
                                <el-option :value = "value" :label = "label"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span = "18">
                    <template v-if = "conditions.length">
                        <el-row v-for = "(item,index) in conditions" :key = "index">
                            <el-form-item label-width="0px">
                                <el-col :span = "6">
                                    <el-select v-model = "item.field" clearable filterable class = "w-full" placeholder="选择查询字段">
                                        <template v-for = "{prop,label,type,selectData} in highSearch.type">
                                            <el-option :value = "prop" :label = "label"></el-option>
                                        </template>
                                    </el-select>
                                </el-col>
                                <el-col :span = "6" class = "px-4">
                                    <el-select v-model = "item.rule" clearable filterable class = "w-full" placeholder="匹配规则">
                                        <template v-for = "{value,label} in select.rule">
                                            <el-option :value = "value" :label = "label"></el-option>
                                        </template>
                                    </el-select>
                                </el-col>
                                <el-col :span = "6">
                                    <template v-if = "isSelect(item.field,highSearch.type)">
                                        <el-select v-model = "item.val" clearable filterable class = "w-full">
                                            <template v-for = "{itemValue,itemText} in highSearch[item.field]">
                                                <el-option :value = "itemValue" :label = "itemText"></el-option>
                                            </template>
                                        </el-select>
                                    </template>
                                    <template v-else>
                                        <el-input v-model = "item.val" placeholder = "请输入值" class = "w-full"></el-input>
                                    </template>
                                </el-col>
                                <el-col :span = "4" class = "pl-4 handle-btn">
                                    <el-button plain class = "el-icon-plus" @click = "plus"></el-button>
                                    <el-button plain class = "el-icon-minus" @click = "minus(index)"></el-button>
                                </el-col>
                            </el-form-item>
                        </el-row>
                    </template>
                    <template v-else>
                        <div class = "text-center">
                            <img src = "@/assets/empty.svg"/>
                        </div>
                        <div class = "text-center">
                            <span>没有任何条件</span>
                            <el-divider direction = "vertical"></el-divider>
                            <el-button type = "text" @click = "plus">点击新增</el-button>
                        </div>
                    </template>
                </el-col>
                <el-col :span = "6">
                    <el-card>
                        <div slot = "header">
                            <span>保存的查询</span>
                        </div>
                        <template v-if = "saveQuerys && saveQuerys.length">
                            <template  v-for = "(item,index) in saveQuerys">
                                <div class = "flex justify-between query-item" @click = "assignRecords(item.records)">
                                    <div>
                                        <i class = "el-icon-document pr-1"></i>
                                        <span>{{item.title}}</span>
                                    </div>
                                    <div class = "remove" @click.prevent = "removeRecords(index)">
                                        <i class = "el-icon-close cursor-pointer"></i>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <template v-else>
                            <img src = "@/assets/empty.svg"/>
                        </template>
                    </el-card>
                </el-col>
            </el-form>
        </el-row>
        <div slot = "footer" class = "modal-footer flex justify-between px-4">
            <div>
                <el-button plain @click = "resetFields">重置</el-button>
                <el-popover
                    placement="top"
                    trigger="click"
                    v-model = "show.save"
                >
                    <el-input v-model = "form.title" placeholder = "请输入保存的名称"></el-input>
                    <div class = "pt-3 text-right">
                        <el-button size="mini" type="text" @click="show.save = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="saveQueryConditions">确定</el-button>
                    </div>
                    <el-button slot = "reference" plain>保存查询条件</el-button>
                </el-popover>
            </div>
            <div>
                <el-button plain @click="close">{{$t('common_cancel')}}</el-button>
                <el-button type="primary" :loading="dialog.loading" @click="confirm">查询</el-button>
            </div>
        </div>
    </drag-dialog>
</template>

<script>
    import {sweetAlert} from '@/utils'
    import {localSave, localRead} from '@/utils/modules/tools'
    import DragDialog from '@/components/dragDialog'
    export default {
        name: "HighSearch",
        props : {
            highSearch : {
                type : Object
            }
        },
        components : {
            DragDialog
        },
        data(){
            return {
                form : {
                    superQueryMatchType : 'and',
                    title : ''
                },
                select : {
                    superQueryMatchType : [
                        {value : 'and' , label : 'AND（所有条件都要求匹配）'},
                        {value : 'or' , label : 'OR（条件中的任意一个匹配）'}
                    ],
                    rule : [
                        {value : 'eq',label : '等于'},
                        {value : '><',label : '不等于'},
                        {value : '>',label : '大于'},
                        {value : '>=',label : '大于等于'},
                        {value : '<',label : '小于'},
                        {value : '<=',label : '小于等于'},
                        {value : 'start',label : '以..开始'},
                        {value : 'end',label : '以..结尾'},
                        {value : 'include',label : '包含'},
                        {value : 'in',label : '在..中'},
                    ]
                },
                show : {
                    save : false
                },
                conditions : [
                    {val : '',rule : '',field : ''}
                ],
                saveQuerys : [],
                dialog: {
                    width: 1000,
                    height: 500,
                    name: 'highSearch',
                    loading : false,
                    title: '高级查询构造器'
                },
            }
        },
        methods : {
            isSelect(field,data){
                return field ? data.find(item=>item.prop === field).type === 'select' : false
            },
            plus(){
                this.conditions.push({
                    val : '',
                    rule : '',
                    field : ''
                })
            },
            minus(index){
                this.conditions.splice(index,1)
            },
            resetFields(){
                this.conditions.forEach(item=>{
                    item.val = ''
                    item.rule = ''
                    item.field = ''
                })
            },
            assignRecords(records){
                this.conditions = [
                    ...records
                ]
            },
            removeRecords(index){
                this.saveQuerys.splice(index)
                localSave('HIGH_SEARCH_ON_LINE_FORM',this.saveQuerys)
                this.getQueryConditions()
            },
            getQueryConditions(){
                this.saveQuerys = [
                    ...localRead('HIGH_SEARCH_ON_LINE_FORM') || []
                ]
            },
            saveQueryConditions(){
                let {title} = this.form
                if(!title){
                    sweetAlert.errorWithTimer('请输入保存的名称')
                }else{
                    let saveConditions = localRead('HIGH_SEARCH_ON_LINE_FORM')
                    if(saveConditions){
                        saveConditions = [
                            ...saveConditions,
                            {
                                title,
                                records : this.conditions
                            }
                        ]
                    }else{
                        saveConditions = [
                            {
                                title,
                                records : this.conditions
                            }
                        ]
                    }
                    localSave('HIGH_SEARCH_ON_LINE_FORM',saveConditions)
                    sweetAlert.successWithTimer('保存成功')
                    this.getQueryConditions()
                }
            },
            close(){
                let {name} = this.dialog
                this.$modal.hide(name)
            },
            confirm(){
                let {superQueryMatchType} = this.form
                let params = {
                    superQueryMatchType,
                    superQueryParams : encodeURIComponent(JSON.stringify(this.conditions))
                }
                this.$emit('superQuery',params)
            }
        }
    }
</script>

<style scoped lang = "less">
    .handle-btn{
        button{
            width: 36px;
            height: 36px;
            padding: 0px;
        }
    }
    .modal-footer{
        position: absolute;
        bottom: 0px;
        background: #fff;
        z-index: inherit;
        width: 100%;
        border-top: 1px solid #e2e8f0;
        height: 60px;
        line-height: 60px;
        min-height: 60px;
    }
    .query-item{
        padding : 3px 6px;
        .remove{
            display: none;
        }
        &:hover{
            background-color: #F5F7FA;
            .remove{
                display: inline-block;
            }
        }
    }
    /deep/ .el-popover__reference{
        margin-left : 10px;
    }
</style>
