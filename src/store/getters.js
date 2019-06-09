export default {
    token: state => state.user.token,
    userInfo: state => state.user.userInfo,
    permissionList: state => state.user.permissionList,
    addRouters: state => state.permission.addRouters,
    /*device: state => state.app.device,
    theme: state => state.app.theme,
    color: state => state.app.color,
    avatar: state => state.user.avatar,
    username: state => state.user.username,
    nickname: state => state.user.realname,
    welcome: state => state.user.welcome,*/
}
