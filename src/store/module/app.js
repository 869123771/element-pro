import {localSave, localRead} from '@/utils/modules/tools'

export default {
    state: {
        menuProps: {
            collapse: false,
            activeName: '',
            openNames: [],
        },
        navBreadcrumbList: [],
        navTagList: [],
        currentNav: '',
        lang: localRead('lang'),
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
            debugger;
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
            debugger;
            localSave('lang', lang)
            state.lang = lang
        },
    },
    actions: {}
}
