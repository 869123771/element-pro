<template>
    <el-dialog v-el-drag-dialog
               v-bind="$attrs"
               v-on="$listeners"
               :visible.sync="visible"
               :fullscreen = "fullscreen"
    >
        <div slot = "title">
           <span>{{title}}</span>
            <span class = "arrow">
                <i class = "fa fa-fw fa-arrows-alt" v-if = "!fullscreen" @click = "full"></i>
                <i class = "fa fa-fw fa-arrows" v-else  @click = "exit"></i>
            </span>
        </div>
        <slot></slot>
    </el-dialog>
</template>

<script>
    import elDragDialog from '@/directive/el-drag-dialog'
    export default {
        name: "DragDialog",
        props : {
            visible : {
                type : Boolean,
                default : false
            },
            title : {
                type : String
            },
            fullscreen : {
                type : Boolean,
                default: false
            }
        },
        directives : {
            elDragDialog
        },
        methods : {
            full(){
                this.fullscreen = true
            },
            exit(){
                this.fullscreen = false
            }
        }
    }
</script>

<style scoped lang = "less">
    .arrow{
        display: inline-block;
        float: right;
        padding-right: 1.25rem;
        color : #909399;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        vertical-align: baseline;
        -webkit-font-smoothing: antialiased;
        font-size: 16px;
        cursor: pointer;
    }
</style>