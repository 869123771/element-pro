<template>
    <div class = "config m-3">
        <collapse :collapse-props = "collapse.projectList">
            <div slot = "collapse-title">
                <span class = "el-icon-tickets pr-1"></span>
                <span>项目列表</span>
            </div>
            <div slot = "collapse-content">

            </div>
        </collapse>
    </div>
</template>

<script>
    import Collapse from '@/components/collapse'

    export default {
        name: "ProjectConfig",
        components : {
            Collapse
        },
        data(){
            return {
                collapse : {
                    projectList : {
                        title : '项目列表',
                        name : 'projectList'
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>