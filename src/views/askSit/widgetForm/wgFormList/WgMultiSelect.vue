<template>
    <wg-container v-on="$listeners">
        <template v-slot:header>
            <div>请选择一下选项(多选)</div>
        </template>
        <template v-slot:body>
            <el-row>
                <template v-for = "({value,label},index) in item.list">
                    <el-row class = "row-item">
                        <el-col :span = "20" class = "radio-item py-1 px-3">
                            <el-checkbox :label = "value">{{label}}</el-checkbox>
                        </el-col>
                        <el-col :span = "4" class = "config-item py-1 px-2 hidden control-icon">
                            <el-tooltip content = "设置" placement="top" effect="light">
                                <span class = "icon fa fa-fw fa-lg fa-gear cursor-pointer pl-6 pr-8"></span>
                            </el-tooltip>
                            <el-tooltip content = "刪除" placement="top" effect="light">
                                <span class = "icon fa fa-fw fa-lg fa-minus-circle cursor-pointer pr-8" @click = "removeItem(index)"></span>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </template>
            </el-row>

            <div class = "flex mt-3" v-if = "item.active">
                <div class = "add-item" @click = "addSingle">
                    <span class = "fa fa-fw fa-plus pr-2"></span>
                    <span>添加单个选项</span>
                </div>
                <div class = "add-item">
               <span class = "fa-stack">
                   <span class = "fa fa-fw fa-reorder fa-stack-1x"></span>
                   <span class = "fa fa-fw fa-plus fa-stack-1x pt-1 pl-4"></span>
               </span>
                    <span>批量添加选项</span>
                </div>
            </div>

        </template>
    </wg-container>
</template>

<script>
    import WgContainer from './WgContainer'

    export default {
        name: "WgMultiSelect",
        components : {
            WgContainer
        },
        props: {
            item: {
                type: Object,
                required: true
            }
        },
        methods : {
            addSingle(){
                let {list} = this.item
                this.item.list.push({value : list.length + 1,label : `选项${list.length + 1}`})
            },
            removeItem(index){
                this.item.list.splice(index,1)
            }
        }
    }
</script>

<style scoped lang = "less">
    @import "../../widgetForm";
    .row-item:hover{
        .radio-item{
            border : 1px dashed #aaa;
        }
        .config-item{
            display: block;
        }
    }
    .add-item{
        color : #0d84e6;
        cursor: pointer;
        padding: 0px 12px;
        height: 36px;
        line-height: 36px;
    }
    .add-item:hover{
        background-color: #f4f4f4;
        border-radius: 2px;
    }
</style>