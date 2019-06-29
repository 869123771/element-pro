<template>
    <drag-dialog :drag-dialog="dialog" @confirm="confirm">
        <el-upload
                ref="upload"
                class="upload"
                drag
                multiple
                :auto-upload="false"
                :action="upload.action"
                :headers="upload.headers"
                :on-success="success"
                :on-error="error"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
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
                    title: '上传',
                    showFooter: true,
                },
                upload : {
                    headers: {
                        'X-Access-Token': getToken(),
                    },
                }
            }
        },
        watch: {
            fileUpload: {
                handler(props) {
                    debugger;
                    this.upload = {
                        ...this.upload,
                        ...props
                    }
                },
                immediate: true
            },
        },
        methods: {
            confirm() {
                this.$refs.upload.submit();
            },
            success(response, file, fileList) {
                debugger;
                let {success,message} = response
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.$emit('uploadSuccess')
                }else{
                    sweetAlert.error(message)
                }
            },
            error(err, file, fileList) {
                debugger;
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