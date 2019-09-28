<template>
    <div class="lang">
        <el-menu
                mode="horizontal"
                :background-color="headProps.theme[headProps.theme.default].backgroundColor"
                :text-color="headProps.theme[headProps.theme.default].textColor"
                :active-text-color="headProps.theme[headProps.theme.default].activeTextColor"
        >
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
    import {mapState} from 'vuex'
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
            ...mapState({
                headProps : ({app}) => app.headProps
            }),
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
            color : inherit;
        }
        /deep/ .el-menu--popup, .el-menu-item {
            min-width: inherit !important;
        }
        /deep/ .el-menu.el-menu--horizontal{
            border : none;
        }
    }
</style>