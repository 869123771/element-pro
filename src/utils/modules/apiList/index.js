import system from './system'
export default {
    ...system,
    login : '/sys/login',
    login_encrypted : '/sys/getEncryptedString',
    login_out : '/sys/logout',
    permission_menu : '/sys/permission/getUserPermissionByToken',
    register : '/web/user/register',
}
