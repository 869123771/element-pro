import {setToken, getToken, localSave, localRead} from '@/utils/modules/tools'
import {constant, apiList, http} from '@/utils'
//let {USER_NAME, USER_INFO} = constant
export default {
    state: {
        token: getToken(),
        userInfo: localRead(constant.USER_INFO),
        permissionList: [],
        auth : [],
        allAuth : [],
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
        },
        SET_USER_INFO(state, userInfo) {
            state.userInfo = userInfo
        },
        SET_PERMISSION_LIST: (state, permissionList) => {
            state.permissionList = permissionList
        },
        SET_AUTH : (state, auth) => {
            state.auth = auth
        },
        SET_ALL_AUTH : (state, allAuth) => {
            state.allAuth = allAuth
        },
    },
    actions: {
        HANDLE_LOGIN({commit}, result) {
            let {USER_INFO} = constant
            let {token, userInfo, userInfo: {userName}} = result
            setToken(token)
            localSave(USER_INFO, userInfo)
            commit('SET_TOKEN', token)
            commit('SET_USER_INFO', userInfo)
        },

        // 获取用户信息
        async GET_PERMISSION_LIST({commit}) {
            let token = getToken()
            let {USER_AUTH, SYS_BUTTON_AUTH} = constant
            let {success, result} = await http.get(apiList.permission_menu, {token})
            if (success) {
                let {menu: menuData, auth: authData, allAuth: allAuthData} = result
                localSave(USER_AUTH, authData)
                localSave(SYS_BUTTON_AUTH, allAuthData)
                if (menuData && menuData.length) {
                    commit('SET_PERMISSION_LIST', menuData)
                    commit('SET_AUTH', authData)
                    commit('SET_ALL_AUTH', allAuthData)
                }
            }
            return result
        },

        // 退出登录
        async LOGIN_OUT({commit, state}) {
            let logoutToken = state.token;
            commit('SET_TOKEN', '')
            commit('SET_PERMISSION_LIST', [])
            setToken('')
            //await http.post(apiList.login_out,logoutToken)
            location.href = "/"
        },
    }
}
