<template>
    <drag-dialog :drag-dialog="dialog" @confirm="confirm">
        <el-upload
                ref="upload"
                class="upload"
                drag
                multiple
                :auto-upload="false"
                :action="dialog.action"
                :headers="dialog.headers"
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
                    width: '25',
                    height: '400',
                    title: '上传',
                    headers: {
                        'X-Access-Token': getToken(),
                    },
                    showFooter: true,
                },
            }
        },
        watch: {
            fileUpload: {
                handler(props) {
                    debugger;
                    this.dialog = {
                        ...this.dialog,
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