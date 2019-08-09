<template>
    <el-dropdown>
        <div class = "avatar flex items-center">
            <a href="javascript:void(0)">
                {{ title }}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </a>
        </div>
        <el-dropdown-menu>
            <el-dropdown-item v-for="(value, key) in localList" :name="key" :key="`lang-${key}`" @click.native = "selectLang(key)">
                {{value}}
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
    export default {
        name: "Language",
        props: {
            lang: String
        },
        data () {
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
            lang (lang) {
                this.$i18n.locale = lang
            }
        },
        computed: {
            title () {
                return this.langList[this.lang]
            }
        },
        methods: {
            selectLang (name) {
                this.$emit('on-lang-change', name)
            }
        }
    }
</script>

<style scoped>

</style>