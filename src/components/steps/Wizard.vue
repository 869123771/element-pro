<template>
    <div class = "wizard">
        <template v-for = "({text,html},index) in items">
            <div class = "wizard-item" :class = "`xs:w-auto sm:w-full md:w-1/${items.length} lg:w-1/${items.length} xl:w-1/${items.length}`">
                <div class = "wizard-item-title" :class = "titleHandle(index)">
                    <span class = "px-2"v-html = "html"></span>
                    <span class = "">{{text}}</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: "Wizard",
        props: {
            // 步骤总数
            items: {
                type: Array,
                required: true
            },
            // 当前步骤
            activeIndex: {
                type: Number,
                default: 0,
                required: true
            }
        },
        methods : {
            titleHandle(index){
                let titleHandleClass = ''
                if(index === 0){
                    titleHandleClass += ' wizard-item-title-first '
                }else if(index === this.items.length - 1){
                    titleHandleClass += ' wizard-item-title-last '
                }
                if(index + 1 === this.activeIndex){
                    titleHandleClass += ' wizard-item-title-active '
                }
                return titleHandleClass
            }
        }
    }
</script>

<style scoped lang = "less">
    .angle{
        content: ' ';
        display: block;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 20px 0px 20px 13px;
        border-color: transparent transparent transparent #E8EBEF;
        position: absolute;
        left: 0;
        top: 0;
    }
    .wizard{
        width : 100%;
        &-item{
            float: left;
            text-align: center;
            padding-right: 18px;
            margin-bottom: 12px;
            &-title{
                position: relative;
                padding: 10px 0 10px 8px;
                line-height: 20px;
                background: #E8EBEF;
                white-space: nowrap;
                overflow: visible;
                color: #3c4353;
                &:not(&-first){
                    &:before{
                        .angle;
                        border-left-color: #fff;
                        z-index: 1;
                    }
                }
                /*&:not(&-last){
                    &:after{
                        .angle;
                        border-left-color: #E8EBEF;
                        left: auto;
                        right: -10px;
                        z-index: 2;
                    }
                }*/
                &:after{
                    .angle;
                    border-left-color: #E8EBEF;
                    left: auto;
                    right: -13px;
                    z-index: 2;
                }
                &-active{
                    transition: background-color linear 0.3s;
                    background-color: #409EFF;
                    color: #fff;
                    &:after{
                        border-left-color: #409EFF;
                        transition: border-left-color linear 0.3s;
                    }
                }
            }
        }
    }
</style>