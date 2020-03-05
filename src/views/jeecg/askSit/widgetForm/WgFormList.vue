<template>
    <div>
        <!-- 单选题 -->
        <wg-single-select v-if="item.type === 'singleSelect'" :item="item" v-on="$listeners"/>

        <!-- 多选题 -->
        <wg-multi-select v-if="item.type === 'multiSelect'" :item="item" v-on="$listeners"/>

        <!-- 级联题 -->
        <wg-cascade v-if="item.type === 'cascade'" :item="item" v-on="$listeners"/>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import WgSingleSelect from './wgFormList/WgSingleSelect'
    import WgMultiSelect from './wgFormList/WgMultiSelect'
    import WgCascade from './wgFormList/WgCascade'

    export default {
        name: "WidgetFormList",
        components : {
            WgSingleSelect,
            WgMultiSelect,
            WgCascade
        },
        props: {
            item: Object,
            index: Number,
            data: Array
        },
    }
</script>

<style scoped>

</style>