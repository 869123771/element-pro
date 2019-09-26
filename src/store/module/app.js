import {localSave, localRead} from '@/utils/modules/tools'

export default {
    state: {
        menuProps: {
            collapse: false,
            activeName: '',
            openNames: [],
            theme : {
                default : localRead('menuTheme') || 'gray',
                white : {
                    backgroundColor : '',
                    textColor : '',
                    activeTextColor :''
                },
                gray : {
                    backgroundColor : '#545c64',
                    textColor : '#fff',
                    activeTextColor :'#ffd04b'
                }
            }
        },
        navBreadcrumbList: [],
        navTagList: [],
        currentNav: '',
        lang: localRead('lang'),
        themeColor : localRead('themeColor'),
        controlShow : {
            themeColor : localRead('themeColorShow') || false,
            shrinkBar : localRead('shrinkBar') || false,
            breadcrumb : localRead('breadcrumb') || false,
            navTag : localRead('navTag') || false,
        }
    },
    mutations: {
        SHRINK_MENU(state) {
            let {menuProps, menuProps: {collapse}} = state
            state.menuProps = {
                ...menuProps,
                collapse: !collapse,
            }
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
        ACTIVE_BREAD_CREAM(state, activeBreadcream) {
            state.navBreadcrumbList = activeBreadcream
        },
        ACTIVE_NAV_TAG(state, {path, title, name}) {
            let {navTagList} = state
            if (navTagList.length) {
                if (!navTagList.map(item => item.path).includes(path)) {
                    navTagList = [
                        ...navTagList,
                        {path, name, title}
                    ]
                }
            } else {
                navTagList = [
                    ...navTagList,
                    {path, name, title}
                ]
            }
            state.navTagList = [...navTagList]
            state.currentNav = path
        },
        REMOVE_NAV_TAG(state, removeNav) {
            let _30s = require('30-seconds-of-code');
            let {navTagList, currentNav} = state
            navTagList = _30s.remove(navTagList, item => item.path !== removeNav);
            if (navTagList.length) {
                let [{path: lastNav}] = navTagList.slice(-1)
                if (removeNav === currentNav) {
                    state.currentNav = lastNav
                }
            }
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
            debugger
            localSave('themeColorShow', themeColor)
            state.controlShow = {
                ...state.controlShow,
                themeColor
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
        SET_MENU_THEME(state,menuTheme){
            localSave('menuTheme', menuTheme)
            let {menuProps:{theme}} = state
            state.menuProps = {
                ...state.menuProps,
                theme : {
                    ...theme,
                    default: menuTheme
                }
            }
        },
    },
    actions: {}
}
