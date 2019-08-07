<template>
    <div>
        <span class="text-blue-500 text-base cursor-pointer">
            <i class="fa fa-fw fa-pencil" @click = "edit"></i>
        </span>
        <el-dropdown placement="bottom" class ="dropdown">
              <span class="text-blue-500 text-base">
                  <i class="fa fa-fw fa-ellipsis-h"></i>
              </span>
            <el-dropdown-menu slot="dropdown">
                <template v-for = "item in dropDownItem">
                    <template v-if = "item.popover">
                        <popover-confirm @confirm = "item.action">
                            <div slot="popover-title">
                                <span>{{item.popText}}</span>
                            </div>
                            <div slot="popover-content">
                                <el-dropdown-item>{{item.label}}</el-dropdown-item>
                            </div>
                        </popover-confirm>
                    </template>
                    <template v-else>
                        <el-dropdown-item @click.native = "item.action">
                            {{item.label}}
                        </el-dropdown-item>
                    </template>
                </template>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    import PopoverConfirm from '@/components/popoverConfirm'

    export default {
        name: "PopDropdown",
        components : {
            PopoverConfirm
        },
        props : {
            popDropdownProps : {
                type : Object
            }
        },
        data(){
            return {
                dropDownItem: [],
            }
        },
        watch : {
            popDropdownProps : {
                handler(props){
                    if(!this.validatenull(props)){
                        let attachTableItem = [
                            {
                                label: '移出',
                                icon: '',
                                action: this.handleRemove,
                                popover: true,
                                popText : '确定要移出吗'
                            },
                            {
                                label: '删除',
                                icon: '',
                                action: this.handleDel,
                                popover: true,
                                popText : '确定要删除吗'
                            },
                        ]

                        let syncItems = [
                            {
                                label: '功能测试',
                                icon: '',
                                action: this.functionalTest,
                                popover: false,
                            },
                            {
                                label: '配置地址',
                                icon: '',
                                action: this.addressConfig,
                                popover: false,
                            },
                            ...attachTableItem
                        ]
                        let asyncItem = [
                            {
                                label: '同步数据库',
                                icon: '',
                                action: this.syncDb,
                                popover: false,
                            },
                            ...attachTableItem
                        ]
                        debugger;
                        let {isDbSynch,tableType} = props
                        if(tableType === 2){                            //附表
                            this.dropDownItem = attachTableItem
                        }else if(isDbSynch === 'Y'){                    //同步
                            this.dropDownItem = syncItems
                        }else{                                          //未同步
                            this.dropDownItem = asyncItem
                        }
                    }
                },
                immediate : true
            }
        },
        methods : {
            edit(){
                this.$emit('edit')
            },
            handleRemove(){
                this.$emit('handleRemove')
            },
            handleDel(){
                this.$emit('handleDel')
            },
            functionalTest(){
                debugger;
                this.$emit('functionalTest')
            },
            addressConfig(){
                this.$emit('addressConfig')
            },
            syncDb(){
                this.$emit('syncDb')
            },
        }
    }
</script>

<style scoped>

</style>