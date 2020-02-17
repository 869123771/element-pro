<template>
    <div>
        <el-tooltip :content="$t('common_flush')" placement="top">
            <el-button circle icon = "el-icon-refresh" @click = "search"></el-button>
        </el-tooltip>
        <el-tooltip :content="$t('common_show') + '/' + $t('common_hide')" placement="top">
            <el-button circle icon = "el-icon-menu" @click = "showColumn"></el-button>
        </el-tooltip>
        <drag-dialog :drag-dialog = "dialog">
            <el-transfer
                    :titles = "[$t('common_show'),$t('common_hide')]"
                    v-model = "transfer.values"
                    :data = "transfer.data"
                    @change = "dataChange"
            ></el-transfer>
        </drag-dialog>
    </div>
</template>

<script>
    import DragDialog from "@/components/dragDialog";
    export default {
        name: "OperMenu",
        components: {
            DragDialog
        },
        props : {
            handleMenus : {
                type : Array
            }
        },
        data(){
            return {
                dialog : {
                    width : '30',
                    height : '80',
                    title : '',
                    showFooter : false
                },
                transfer : {
                    values : [],
                    data : []
                }
            }
        },
        methods : {
            search(){
                this.$emit('search')
            },
            dataChange(data){
                let showData = this.handleMenus.filter(item=>!data.includes(item.prop))
                this.$emit('showColumn',showData)
            },
            handleData(){
                let data = []
                this.handleMenus.forEach(item=>{
                    let {label,prop} = item
                    if(label && prop){
                        data.push({label,key:prop})
                    }
                })
                this.transfer = {
                    ...this.transfer,
                    data
                }
            },
            showColumn(){
                this.dialog = {
                    ...this.dialog,
                    width : 550,
                    height : 380,
                    title : this.$t('common_show') + '/' + this.$t('common_hide'),
                    name : 'showHide'
                }
                this.handleData()
                let {name} = this.dialog
                this.$nextTick(()=>{
                    this.$modal.show(name)
                })
            }
        }
    }
</script>

<style scoped lang = "less">
    /deep/ .el-transfer__button{
        border-radius: 50%;
        padding: 12px;
        display: block;
        margin-left: 0px;
    }
    /deep/ .el-transfer__button:first-child{
        margin-bottom : 10px;
    }
</style>