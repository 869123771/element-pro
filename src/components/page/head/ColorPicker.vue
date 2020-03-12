<template>
    <el-color-picker size="small"
                     class="theme-picker"
                     popper-class="theme-picker-dropdown"
                     :predefine="predefineColors"
                     v-model="theme"></el-color-picker>
</template>

<script>
    import {mapState} from "vuex";

    const version = require("element-ui/package.json").version;     // element-ui version from node_modules
    const ORIGINAL_THEME = "#409EFF"; // default color
    export default {
        name: "ColorPicker",
        data() {
            return {
                theme: ORIGINAL_THEME,
                predefineColors: ['#409EFF', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d'],
                chalk: '',  // 当前是否已经获取过css样式文件内容，如果获取过，这里会有值，避免多次获取
            };
        },
        computed: {
            ...mapState({
                themeColor: ({app}) => app.themeColor
            })
        },
        watch: {
            async theme(val) {
                this.$store.commit("SET_THEME", val);
                // 如果存在chalk，oldVal就是当前颜色(颜色选择器中选取的就是新颜色)
                // 否则，oldVal就是element-ui默认的蓝色
                const oldVal = this.chalk ? this.theme : ORIGINAL_THEME
                if (typeof val !== 'string') return

                const themeCluster = this.getThemeCluster(val.replace('#', ''))
                const originalCluster = this.getThemeCluster(oldVal.replace('#', ''))

                const getHandler = (variable, id) => {
                    return () => {
                        const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''))
                        const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster)

                        let styleTag = document.getElementById(id)
                        if (!styleTag) {
                            styleTag = document.createElement('style')
                            styleTag.setAttribute('id', id)
                            document.head.appendChild(styleTag)
                        }
                        styleTag.innerText = newStyle
                    }
                }

                // 如果没有chalk就是第一次换颜色，需要远程获取css文件
                // 后面的换色，就不用再次远程获取了
                if (!this.chalk) {
                    const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
                    await this.getCSSString(url, 'chalk')
                }

                const chalkHandler = getHandler('chalk', 'chalk-style')
                chalkHandler()

                // 过滤当前整个页面的样式文件，找到含有oldVal颜色的样式文件
                const styles = [].slice.call(document.querySelectorAll('style'))
                    .filter(style => {
                        const text = style.innerText
                        return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
                    })
                // 然后，将其中oldVal的颜色，全部换成我们颜色选择器中选择的新的颜色
                styles.forEach(style => {
                    const {innerText} = style
                    if (typeof innerText !== 'string') return
                    style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
                })
            }
        },
        methods: {
            /* 更新样式 - 使用新的颜色变量替换之前的 */
            updateStyle(style, oldCluster, newCluster) {
                let newStyle = style
                oldCluster.forEach((color, index) => {
                    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
                })
                return newStyle
            },
            // 创建xhr，远程获取css文件，并给chalk赋值
            getCSSString(url, variable) {
                return new Promise(resolve => {
                    const xhr = new XMLHttpRequest()
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
                            resolve()
                        }
                    }
                    xhr.open('GET', url)
                    xhr.send()
                })
            },
            /**
             * 传入一个颜色的HEX，得到这个颜色的深浅颜色数组
             * 我们知道，我们默认的主色调蓝色，在实际使用中，还需要对应的浅蓝和深蓝
             * @param  {[string]]} theme [color]
             * @return {[array]}       [对应的深浅颜色数组]
             */
            getThemeCluster(theme) {
                const tintColor = (color, tint) => {
                    let red = parseInt(color.slice(0, 2), 16)
                    let green = parseInt(color.slice(2, 4), 16)
                    let blue = parseInt(color.slice(4, 6), 16)

                    if (tint === 0) { // when primary color is in its rgb space
                        return [red, green, blue].join(',')
                    } else {
                        red += Math.round(tint * (255 - red))
                        green += Math.round(tint * (255 - green))
                        blue += Math.round(tint * (255 - blue))

                        red = red.toString(16)
                        green = green.toString(16)
                        blue = blue.toString(16)

                        return `#${red}${green}${blue}`
                    }
                }

                const shadeColor = (color, shade) => {
                    let red = parseInt(color.slice(0, 2), 16)
                    let green = parseInt(color.slice(2, 4), 16)
                    let blue = parseInt(color.slice(4, 6), 16)

                    red = Math.round((1 - shade) * red)
                    green = Math.round((1 - shade) * green)
                    blue = Math.round((1 - shade) * blue)

                    red = red.toString(16)
                    green = green.toString(16)
                    blue = blue.toString(16)

                    return `#${red}${green}${blue}`
                }

                const clusters = [theme]
                for (let i = 0; i <= 9; i++) {
                    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
                }
                clusters.push(shadeColor(theme, 0.1))
                return clusters
            }
        },
        created() {
            this.theme = this.themeColor || ORIGINAL_THEME;
        },
    };
</script>

<style>
    .theme-picker .el-color-picker__trigger {
        vertical-align: middle;
    }

    .theme-picker-dropdown .el-color-dropdown__link-btn {
        display: none;
    }
</style>
