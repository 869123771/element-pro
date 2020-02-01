<template>
    <drag-dialog :drag-dialog="dialog" @confirm="confirm">
        <el-upload
                :ref="upload.ref"
                class="upload"
                drag
                :multiple = "upload.multiple"
                :auto-upload="false"
                :name = "upload.name"
                :data = "upload.data"
                :action="upload.action"
                :headers="upload.headers"
                :on-success="success"
                :on-error="error"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{$t('common_drag_file_hear')}}<em>{{$t('common_click_upload')}}</em></div>
        </el-upload>
    </drag-dialog>
</template>

<script>
    import dragDialog from '@/components/dragDialog'
    import {getToken} from '@/utils/modules/tools'
    import {sweetAlert} from '@/utils'
    export default {
        name: "fileUpload",
        components: {
            dragDialog
        },
        props: {
            fileUpload: {
                type: Object
            }
        },
        data() {
            return {
                dialog: {
                    name : 'fileUpload',
                    width: 25,
                    height: 50,
                    title: this.$t('common_upload'),
                    showFooter: true,
                },
                upload : {
                    ref : 'fileUpload',
                    name : 'file',
                    multiple : true,
                    action : '',
                    headers: {
                        'X-Access-Token': getToken(),
                    },
                }
            }
        },
        watch: {
            fileUpload: {
                handler(props) {
                    let {name} = this.dialog
                    this.upload = {
                        ...this.upload,
                        ...props
                    }
                    this.dialog = {
                        ...this.dialog,
                        name : props.modalName || name
                    }
                },
                immediate: true
            },
        },
        methods: {
            confirm() {
                this.$refs.fileUpload.submit();
            },
            success(response, file, fileList) {
                let {success,message} = response
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.$emit('uploadSuccess')
                }else{
                    sweetAlert.error(message)
                }
            },
            error(err, file, fileList) {
                sweetAlert.error('上传失败')
            }
        },
    }
</script>

<style scoped lang="less">
    .upload {
        padding: 1rem;
        /deep/ .el-upload {
            display: block;
            .el-upload-dragger {
                width: inherit;
            }
        }
    }

</style>