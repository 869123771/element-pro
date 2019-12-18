<template>
    <global-layout>
        <router-view></router-view>
    </global-layout>
</template>
<script>
    import GlobalLayout from '@/components/page/GlobalLayout'
    export default {
        name : 'TabLayout',
        components : {
            GlobalLayout
        },
        data(){
            return {

            }
        }
    }
</script>
