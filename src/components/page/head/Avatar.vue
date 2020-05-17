<template>
    <div class="avatar flex items-center h-full">
        <el-dropdown>
            <div class="flex items-center">
                <div class="flex px-1">
                    <el-avatar :size="32" :src="getAvatarView(userInfo.avatar)"></el-avatar>
                </div>
                <div class="flex items-center">
                    <span class="px-1">{{userInfo.realname}}</span>
                </div>
            </div>
            <el-dropdown-menu>
                <el-dropdown-item @click.native="toggleDept">
                    <i class="fa fa-bank"></i>切换部门
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout" divided>
                    <i class="iconfont icon-wy-log-out"></i>登出
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <div class="dept">
                <el-select v-model="userInfo.currentDept" class="w-full" clearable filterable @change="setCurrentDept">
                <span slot="prefix">
                    <i class="fa fa-fx fa-bank"></i>
                </span>
                    <template v-for="{id,departName} in userInfo.ownerDept">
                        <el-option :value="id" :label="departName"></el-option>
                    </template>
                </el-select>
            </div>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {constant, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'

    export default {
        name: "Avatar",
        components: {
            DragDialog
        },
        data() {
            return {
                dialog: {
                    width: 380,
                    height: 200,
                    minHeight: 200,
                    name: 'choseDept',
                    title: '部门选择',
                    showFooter : true
                },
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        methods: {
            ...mapMutations({
                setCurrentDept: 'SET_CURRENT_DEPT',
                dialogLoading: 'DIALOG_LOADING',
            }),
            ...mapActions({
                logout: 'LOGIN_OUT'
            }),
            confirm() {
                let {currentDept} = this.userInfo
                if (currentDept) {
                    this.dialogLoading(true)
                    sweetAlert.successWithTimer('部门切换成功')
                    this.$nextTick(() => {
                        this.dialogLoading(false)
                        let {name} = this.dialog
                        this.$nextTick(() => {
                            this.$modal.hide(name)
                        })
                    })
                } else {
                    sweetAlert.errorWithTimer('请选择一个部门')
                }
            },
            toggleDept() {
                let {currentDept} = this.userInfo
                if(currentDept){
                    let {name} = this.dialog
                    this.$nextTick(() => {
                        this.$modal.show(name)
                    })
                }else{
                    sweetAlert.warnWithTimer('您尚未设置部门信息')
                }
            },
            getAvatarView(avatar) {
                let {config: {baseUrl: {staticDomainURL}}} = constant
                return `${staticDomainURL}/${avatar}`
            },
        }
    }
</script>

<style scoped lang="less">
    .avatar {
        padding: 0 8px;
        width: auto;
        .dept {
            padding-bottom: 1rem;

            /deep/ .el-input {
                &__prefix {
                    top: 8px;
                    left : 8px;
                }
            }
        }
    }
</style>
