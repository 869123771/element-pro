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
                        <popover-confirm @confirm = "confirm(item.action)">
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
        data(){
            return {
                dropDownItem: [
                    {
                        label: '详情',
                        icon: '',
                        action: this.handleDetail,
                        popover: false,
                    },
                    {
                        label: '密码',
                        icon: '',
                        action: this.handlePwd,
                        popover: false,
                    },
                    {
                        label: '删除',
                        icon: '',
                        action: this.handleDel,
                        popover: true,
                        popText : '确定要删除吗'
                    },
                    {
                        label: '冻结',
                        icon: '',
                        action: this.frozen,
                        popover: true,
                        popText : '确定要冻结吗'
                    },
                    {
                        label: '代理人',
                        icon: '',
                        action: this.proxyMan,
                        popover: false,
                    },
                ],
            }
        },
        methods : {
            edit(){
                this.$emit('edit')
            },
            handleDetail(){
                this.$emit('handleDetail')
            },
            handlePwd(){
                this.$emit('handlePwd')
            },
            handleDel(){
                this.$emit('handleDel')
            },
            frozen(){
                this.$emit('frozen')
            },
            proxyMan(){
                this.$emit('proxyMan')
            },
            confirm(event){
               event()
            }
        }
    }
</script>

<style scoped>

</style>