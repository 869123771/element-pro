<template>
    <wg-container v-on="$listeners">
        <template v-slot:header>
            <div>请选择一下选项</div>
        </template>
        <template v-slot:body>
            <el-row>
                <el-cascader v-model = "item.value" :options="item.list" :props = "{value:code,label:'name'}">

                </el-cascader>
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
        name: "WgCascade",
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