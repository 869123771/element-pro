<template>
    <div>
        <!-- 单选题 -->
        <wg-single-select v-if="item.type === 'singleSelect'" :item="item" v-on="$listeners"/>

        <!-- 多选题 -->
        <wg-multi-select v-if="item.type === 'multiSelect'" :item="item" v-on="$listeners"/>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import WgSingleSelect from './wgFormList/WgSingleSelect'
    import WgMultiSelect from './wgFormList/WgMultiSelect'

    export default {
        name: "WidgetFormList",
        components : {
            WgSingleSelect,
            WgMultiSelect
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