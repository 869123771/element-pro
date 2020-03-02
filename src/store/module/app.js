import {localSave, localRead} from '@/utils/modules/tools'
import {isBoolean} from '30-seconds-of-code'
import router from '@/router'
export default {
    state: {
        dialogLoading : false,
        menuProps: {
            collapse:  localRead('collapse') || false,
            activeName: '',
            openNames: [],
            uniqueOpened : localRead('uniqueOpened') || true,
            theme : localRead('menuTheme') || 'dark',
            fixMenu : localRead('fixMenu') === false ? false : true,
        },
        headProps : {
            fixHeader : localRead('fixHeader') || false,
            theme : localRead('headerTheme') || 'white',
        },
        pageData: {
            list: [],
            title: "云忆网络",
            statsCode: "",
            theme: "theme1",
            style: {
                backgroundColor: "#fff",
                backgroundImage: "",
            }
        },
        selectWg: {},
        configTab: 'page',
        wgCollapse: "base",
        navBreadcrumbList: [],
        navTagList: localRead('navTagList') || [],
        currentNav: '',
        lang: localRead('lang'),
        themeColor : localRead('themeColor'),
        collect : false,
        controlShow : {
            themeColor : localRead('themeColorShow') || false ,
            shrinkBar : isBoolean(localRead('shrinkBar')) ? localRead('shrinkBar') : true,
            breadcrumb : isBoolean(localRead('breadcrumb')) ? localRead('breadcrumb') : true,
            navTag : isBoolean(localRead('navTag')) ? localRead('navTag') : true,
            reload : isBoolean(localRead('reload')) ? localRead('reload') : true,
            navTagShowIcon : isBoolean(localRead('navTagShowIcon')) ? localRead('navTagShowIcon') : true,
        }
    },
    mutations: {
        DIALOG_LOADING(state,dialogLoading){
             state.dialogLoading = dialogLoading
        },
        SHRINK_MENU(state,collapse) {
            state.menuProps = {
                ...state.menuProps,
                collapse,
            }
            localSave('collapse', collapse)
        },
        ACTIVE_NAME(state, activeName) {
            let {menuProps} = state
            state.menuProps = {
                ...menuProps,
                activeName
            }
        },
        OPEN_NAMES(state, openNames) {
            let {menuProps} = state
            state.menuProps = {
                ...menuProps,
                openNames
            }
        },
        OPEN_UNIQUE(state, uniqueOpened) {
            let {menuProps} = state
            state.menuProps = {
                ...menuProps,
                uniqueOpened
            }
        },
        ACTIVE_BREAD_CREAM(state, activeBreadcream) {
            state.navBreadcrumbList = activeBreadcream
        },
        ACTIVE_NAV_TAG(state, {path, title, name,icon}) {
            let {navTagList} = state
            if (navTagList.length) {
                if (!navTagList.map(item => item.path).includes(path)) {
                    navTagList = [
                        ...navTagList,
                        {path, name, title,icon}
                    ]
                }
            } else {
                navTagList = [
                    ...navTagList,
                    {path, name, title,icon}
                ]
            }
            localSave('navTagList', navTagList)
            state.navTagList = [...navTagList]
            state.currentNav = path
        },
        REMOVE_NAV_TAG(state, removeNav) {
            debugger;
            let _30s = require('30-seconds-of-code');
            let {navTagList, currentNav} = state
            navTagList = _30s.remove(navTagList, item => item.path !== removeNav);
            if (navTagList.length) {
                let [{path: lastNav}] = navTagList.slice(-1)
                if (removeNav === currentNav) {
                    state.currentNav = lastNav
                }
            }
            localSave('navTagList', navTagList)
            state.navTagList = [...navTagList]
        },
        SET_LANG(state, lang) {
            localSave('lang', lang)
            state.lang = lang
        },
        SET_THEME(state,themeColor){
            localSave('themeColor', themeColor)
            state.themeColor = themeColor
        },
        SET_THEME_COLOR_SHOW(state,themeColor){
            localSave('themeColorShow', themeColor)
            state.controlShow = {
                ...state.controlShow,
                themeColor
            }
        },
        SET_FIX_MENU(state,fixMenu){
            localSave('fixMenu', fixMenu)
            state.menuProps = {
                ...state.menuProps,
                fixMenu
            }
        },
        SET_FIX_HEADER(state,fixHeader){
            localSave('fixHeader', fixHeader)
            state.headProps = {
                ...state.headProps,
                fixHeader
            }
        },
        SET_SHRINK_BAR(state,shrinkBar){
            localSave('shrinkBar', shrinkBar)
            state.controlShow = {
                ...state.controlShow,
                shrinkBar
            }
        },
        SET_BREADCRUMB(state,breadcrumb){
            localSave('breadcrumb', breadcrumb)
            state.controlShow = {
                ...state.controlShow,
                breadcrumb
            }
        },
        SET_NAV_TAG(state,navTag){
            localSave('navTag', navTag)
            state.controlShow = {
                ...state.controlShow,
                navTag
            }
        },
        SET_NAV_TAG_SHOW_ICON(state,navTagShowIcon){
            localSave('navTagShowIcon', navTagShowIcon)
            state.controlShow = {
                ...state.controlShow,
                navTagShowIcon
            }
        },
        SET_COLLECT(state,collect){
            state.collect = collect
        },
        SET_RELOAD(state,reload){
            localSave('reload', reload)
            state.controlShow = {
                ...state.controlShow,
                reload
            }
        },
        SET_MENU_THEME(state,theme){
            localSave('menuTheme', theme)
            state.menuProps = {
                ...state.menuProps,
                theme
            }
        },
        SET_HEADER_THEME(state,theme){
            localSave('headerTheme', theme)
            state.headProps = {
                ...state.menuProps,
                theme
            }
        },
        SET_PAGE_DATA(state,pageData){
            state.pageData = pageData
        },
        SET_SELECT_WG(state,selectWg){
            state.selectWg = selectWg
        },
        SET_CONFIG_TAB(state,configTab){
            state.configTab = configTab
        }
    },
    actions: {}
}
