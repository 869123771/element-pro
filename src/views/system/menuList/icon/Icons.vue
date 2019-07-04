<template>
    <el-tabs v-model="pane.name" @tab-click = "tabClick">
        <el-tab-pane label="方向性图标" name="direct">
            <ul>
                <li v-for="icon in icons.directionIcons" :key="icon">
                    <el-tooltip :content = "icon" placement="top">
                        <i @click="chooseIcon(icon)" :class="iconClass(icon)"/>
                    </el-tooltip>
                </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="指示性图标" name="note">
            <ul>
                <li v-for="icon in icons.suggestionIcons" :key="icon">
                    <el-tooltip :content = "icon" placement="top">
                        <i @click="chooseIcon(icon)" :class="iconClass(icon)"/>
                    </el-tooltip>
                </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="编辑类图标" name="edit">
            <ul>
                <li v-for="icon in icons.editIcons" :key="icon">
                    <el-tooltip :content = "icon" placement="top">
                        <i @click="chooseIcon(icon)" :class="iconClass(icon)"/>
                    </el-tooltip>
                </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="数据类图标" name="data">
            <ul>
                <li v-for="icon in icons.dataIcons" :key="icon">
                    <el-tooltip :content = "icon" placement="top">
                        <i @click="chooseIcon(icon)" :class="iconClass(icon)"/>
                    </el-tooltip>
                </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="网站通用图标" name="universal">
            <ul>
                <li v-for="icon in icons.webIcons" :key="icon">
                    <el-tooltip :content = "icon" placement="top">
                        <i @click="chooseIcon(icon)" :class="iconClass(icon)"/>
                    </el-tooltip>
                </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="品牌和标识" name="brand">
            <ul>
                <li v-for="icon in icons.logoIcons" :key="icon">
                    <i :title="icon" @click="chooseIcon(icon)" :class="iconClass(icon)"/>
                </li>
            </ul>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import {sweetAlert} from '@/utils'

    const directionIcons = ['stepbackward', 'stepforward', 'fastbackward', 'fastforward', 'shrink', 'arrowsalt', 'down', 'up', 'left', 'right', 'caretup', 'caretdown', 'caretleft', 'caretright', 'upcircle', 'downcircle', 'leftcircle', 'rightcircle', 'upcircleo', 'downcircleo', 'rightcircleo', 'leftcircleo', 'doubleright', 'doubleleft', 'verticleleft', 'verticleright', 'forward', 'back', 'enter', 'retweet', 'swap', 'swapleft', 'swapright', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'playcircleo', 'upsquare', 'downsquare', 'leftsquare', 'rightsquare', 'leftsquareo', 'rightsquareo', 'login', 'logout', 'menufold']
    const suggestionIcons = ['question', 'questioncircle', 'plus', 'pluscircle', 'pause', 'pausecircle', 'minus', 'minuscircle', 'plussquare', 'minussquare', 'info', 'exclamation', 'exclamationcircle', 'close', 'closecircle', 'closesquare', 'check', 'checkcircle', 'checksquare', 'clockcircle', 'warning']
    const editIcons = ['edit', 'form', 'copy1', 'delete']
    const dataIcons = ['areachart', 'piechart', 'barchart', 'dotchart', 'linechart']
    const webIcons = ['lock', 'unlock', 'bars', 'book', 'calendar', 'cloud', 'clouddownload','copy1', 'creditcard', 'delete', 'iconfontdesktop', 'download', 'ellipsis1', 'file1', 'filetext1', 'unknowfile1', 'pdffile1', 'wordfile1', 'exclefile1', 'jpgfile1', 'pptfile1', 'file-markdown', 'addfile', 'folder1', 'folderopen', 'addfolder', 'hdd', 'frown', 'meh', 'smileo', 'inbox', 'laptop', 'appstore1', 'link', 'mail', 'mobile1', 'notification', 'paperclip', 'picture', 'poweroff', 'reload1', 'search1', 'setting', 'sharealt', 'tablet1', 'tag', 'tags', 'totop', 'upload', 'user', 'videocamera', 'home', 'loading1', 'loading2', 'cloudupload', 'star', 'heart', 'enviroment', 'eye', 'camera', 'save', 'team', 'solution1', 'phone', 'filter', 'exception1', 'export', 'customerservice', 'qrcode', 'scan1', 'like1', 'dislike1', 'message1', 'pay-circle1', 'calculator', 'pushpin', 'bulb1', 'select1', 'switcher', 'rocket1', 'bells', 'disconnect', 'database', 'barcode', 'hourglass', 'key', 'flag', 'layout', 'printer', 'sound', 'USB', 'skin', 'tool', 'sync', 'wifi', 'car', 'adduser', 'deleteuser', 'addusergroup', 'deleteusergroup', 'man', 'woman', 'shoppingcart', 'gift', 'idcard', 'medicinebox', 'redenvelopes', 'copyright', 'trademark', 'Safety', 'wallet', 'bank', 'Trophy', 'contacts', 'shake', 'API', 'fork', 'dashboard', 'table', 'profile', 'rest']
    const logoIcons = ['android', 'apple1', 'windows', 'ie', 'chrome', 'github', 'dingding', 'weibo-square', 'weibo-circle', 'taobao-circle', 'HTML', 'weibo', 'twitter', 'wechat', 'youtube', 'alipay-circle', 'taobao-square', 'skype', 'QQ', 'medium-wordmark', 'gitlab', 'medium-monogram', 'linkedin-square', 'googleplus', 'dropbox', 'facebook-square', 'codepen', 'amazon', 'google', 'codepen-circle', 'alipay-square', 'antdesign', 'aliyun', 'zhihu', 'slack', 'slack-square', 'behance', 'behance-square', 'dribbble', 'dribbble-square', 'instagram', 'yuque', 'aliwangwang']
    export default {
        name: 'Icons',
        props: {
            iconsChecked: {
                type : Object
            }
        },
        data() {
            return {
                icons: {
                    directionIcons,
                    suggestionIcons,
                    editIcons,
                    dataIcons,
                    webIcons,
                    logoIcons
                },
                checked: {
                    icon: '',
                },
                pane: {
                    name: 'direct'
                }
            }
        },
        watch : {
            iconsChecked : {
                handler(props){
                    if(!this.validatenull(props)) {
                        debugger;
                        let {name, paneName} = props
                        this.checked = {
                            ...this.checked,
                            icon: name
                        }
                        this.pane = {
                            ...this.pane,
                            name: paneName
                        }
                        this.iconClass(name)
                    }
                },
                immediate : true
            }
        },
        methods: {
            tabClick({name}){
                this.pane = {
                    ...this.pane,
                    name
                }
            },
            chooseIcon(icon) {
                this.checked = {
                    ...this.checked,
                    icon,
                }
                sweetAlert.successWithTimer(`选中 ${icon}`)
            },
            iconClass(checkIcon) {
                debugger;
                let iconClass = ''
                let {icon} = this.checked
                if (checkIcon === icon) {
                    iconClass += 'active'
                }
                return iconClass += ` anticon icon-${checkIcon}`
            },
        }
    }
</script>
<style lang="less" scoped>
    @import "Icon";
</style>
