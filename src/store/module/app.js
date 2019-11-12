import {localSave, localRead} from '@/utils/modules/tools'
import {isBoolean} from '30-seconds-of-code'

export default {
    state: {
        menuProps: {
            collapse: false,
            activeName: '',
            openNames: [],
            uniqueOpened : localRead('uniqueOpened') || false,
            theme : {
                default : localRead('menuTheme') || 'dark',
                white : {
                    backgroundColor : '',
                    textColor : '',
                    activeTextColor :''
                },
                dark : {
                    backgroundColor : '#191a23',
                    textColor : '#fff',
                    activeTextColor :'#2d8cf0'
                }
            }
        },
        headProps : {
            theme : {
                default : localRead('headerTheme') || 'white',
                white : {
                    backgroundColor : '',
                    textColor : '',
                    activeTextColor :''
                },
                dark : {
                    backgroundColor : '#191a23',
                    textColor : '#fff',
                    activeTextColor :'#fff'
                },
                blue : {
                    backgroundColor : '#1f54bd',
                    textColor : '#fff',
                    activeTextColor :'#fff'
                }
            }
        },
        navBreadcrumbList: [],
        navTagList: [],
        currentNav: '',
        lang: localRead('lang'),
        themeColor : localRead('themeColor'),
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
        SET_NAV_TAG_SHOW_ICON(state,navTagShowIcon){
            localSave('navTagShowIcon', navTagShowIcon)
            state.controlShow = {
                ...state.controlShow,
                navTagShowIcon
            }
        },
        SET_RELOAD(state,reload){
            localSave('reload', reload)
            state.controlShow = {
                ...state.controlShow,
                reload
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
        SET_HEADER_THEME(state,headerTheme){
            localSave('headerTheme', headerTheme)
            let {headProps:{theme}} = state
            state.headProps = {
                ...state.menuProps,
                theme : {
                    ...theme,
                    default: headerTheme
                }
            }
        },
    },
    actions: {}
}
