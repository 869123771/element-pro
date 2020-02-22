<template>
    <div class = "modify">
        <el-form ref = "form" :model = "form" label-width="90px" :rules = "rules">
            <el-form-item label = "任务类名" prop = "jobClassName">
                <el-input v-model = "form.jobClassName" placeholder = "任务类名" clearable></el-input>
            </el-form-item>
            <el-form-item label = "corn表达式" prop = "cronExpression">
                <el-input @click.native="cornClick" v-model = "form.cronExpression" placeholder = "corn表达式" readonly></el-input>
            </el-form-item>
            <el-form-item label = "参数" prop = "parameter">
                <el-input
                        type = "textarea"
                        v-model = "form.parameter"
                        placeholder = "参数"
                        :rows = "4"
                        showWordLimit
                ></el-input>
            </el-form-item>
            <el-form-item label = "描述" prop = "description">
                <el-input
                        type = "textarea"
                        v-model = "form.description"
                        placeholder = "描述"
                        clearable
                        maxlength = "100"
                        showWordLimit
                ></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="form.status">
                    <template v-for="{itemValue,itemText} in statusFilter">
                        <el-radio-button :label="itemValue">{{itemText}}</el-radio-button>
                    </template>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <drag-dialog :drag-dialog="dialog">
            <vcrontab @hide="cornClose" @fill="cronChange" :expression="form.cronExpression"></vcrontab>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, constant,sweetAlert} from '@/utils'
    import {isEmpty} from '30-seconds-of-code'
    import DragDialog from '@/components/dragDialog'
    import vcrontab from 'vcrontab'
    export default {
        name: "Modify",
        components : {
            DragDialog,
            vcrontab
        },
        props : {
            data : {
                type : Object
            }
        },
        data(){
            return {
                show : {
                    corn : false
                },
                dialog: {
                    width: 300,
                    height: 300,
                    name: 'job',
                    showFooter : false
                },
                form: {
                    jobClassName : '',
                    cronExpression : '',
                    parameter : '',
                    description : '',
                    status : '0'
                },
                rules : {
                    jobClassName : [
                        {required : true, message : '必填', trigger : 'change'}
                    ],
                },
            }
        },
        computed : {
            ...mapState({
                taskStatus : ({dict})=> dict.taskStatus
            }),
            statusFilter(){
                return this.taskStatus.filter(item=>item.itemValue !== '-1')
            },
        },
        watch : {
            data : {
                handler(props) {
                    if (!isEmpty(props)) {
                        let {status} = props
                        this.form = {
                            ...this.form,
                            ...props,
                            status : status === -1 ? status = 1 : status
                        }
                    }
                },
                immediate : true
            },
        },
        methods : {
            cornClick(){
                debugger;
                this.dialog = {
                    ...this.dialog,
                    name: 'corn',
                    title : 'corn表达式',
                    width : 540,
                    height : 720,
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            cornClose(){
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.hide(name)
                })
            },
            cronChange(cronExpression){
                this.form = {
                    ...this.form,
                    cronExpression
                }
                this.cornClose()
            },
            saveData(){
                let {id} = this.data
                let params = {
                    ...this.form
                }
                if(id){
                    this.update(params)
                }else{
                    this.add(params)
                }
            },
            async add(params){
                let {success,message} = await http.post(apiList.sys_quertz_job_add,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
            async update(params){
                let {success,message} = await http.put(apiList.sys_quertz_job_edit,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            }
        },
    }
</script>

<style scoped>

</style>