import system from './system'
import monitor from './monitor'
export default {
    ...system,
    ...monitor,
    login : '/sys/login',
    login_encrypted : '/sys/getEncryptedString',
    login_out : '/sys/logout',
    permission_menu : '/sys/permission/getUserPermissionByToken',
    home_login_info: '/sys/loginfo',
}
