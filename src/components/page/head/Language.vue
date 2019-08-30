<template>

    <div class="lang">
        <el-menu mode="horizontal">
            <el-submenu index="" popper-class="menu-lang" :popper-append-to-body="false">
                <template slot="title">{{ title }}</template>
                <el-menu-item :index="key" :key = "value" v-for="(value, key) in localList" @click.native="selectLang(key)">
                    {{value}}
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "Language",
        props: {
            lang: String
        },
        data() {
            return {
                langList: {
                    'zh-CN': '语言',
                    'zh-TW': '語言',
                    'en-US': 'Lang'
                },
                localList: {
                    'zh-CN': '中文简体',
                    'zh-TW': '中文繁体',
                    'en-US': 'English'
                }
            }
        },
        watch: {
            lang(lang) {
                this.$i18n.locale = lang
            }
        },
        computed: {
            title() {
                return this.langList[this.lang]
            }
        },
        methods: {
            selectLang(name) {
                this.$emit('on-lang-change', name)
            }
        }
    }
</script>

<style scoped lang="less">
    .lang {
        /deep/ .el-menu--horizontal > .el-submenu .el-submenu__title {
            height: 50px;
            line-height: 50px;
            border-bottom: none;
        }
        /deep/ .el-menu--popup, .el-menu-item {
            min-width: inherit !important;
        }
    }
</style>