<template>
    <wg-container v-on="$listeners">
        <template v-slot:header>
            <div>请选择一下选项(多选)</div>
        </template>
        <template v-slot:body>
            <el-radio-group v-model = "item.value">
                <template v-for = "{value,label} in item.list">
                    <div class = "my-2">
                        <el-checkbox :label = "value">{{label}}</el-checkbox>
                    </div>
                </template>
            </el-radio-group>
        </template>
    </wg-container>
</template>

<script>
    import WgContainer from './WgContainer'

    export default {
        name: "WgInput",
        components : {
            WgContainer
        },
        props: {
            item: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>