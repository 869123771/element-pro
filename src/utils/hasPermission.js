import {constant} from '@/utils'
let {USER_AUTH, SYS_BUTTON_AUTH} = constant

const hasPermission = {
    install (Vue, options) {
        Vue.directive('has', {
            inserted: (el, binding, vnode)=>{
                console.log("页面权限控制----");
                //节点权限处理，如果命中则不进行全局权限处理
                if(!filterNodePermission(el, binding, vnode)){
                    filterGlobalPermission(el, binding, vnode);
                }
            }
        });
    }
};

/**
 * 全局权限控制
 */
export const filterNodePermission = (el, binding, vnode) => {
    debugger;
    let permissionList = [];
    try {
        let obj = vnode.context.$props.formData;
        if (obj) {
            let bpmList = obj.permissionList;
            for (let bpm of bpmList) {
                if(bpm.type != '2') {
                    permissionList.push(bpm);
                }
            }
        }else{
            return false
        }
    } catch (e) {
        //console.log("页面权限异常----", e);
    }
    if (!permissionList.length) {
        //el.parentNode.removeChild(el)
        return false;
    }
    let permissions = [];
    for (let item of permissionList) {
        if(item.type !== '2') {
            permissions.push(item.action);
        }
    }
    //console.log("页面权限----"+permissions);
    //console.log("页面权限----"+binding.value);
    if (!permissions.includes(binding.value)) {
        //el.parentNode.removeChild(el)
        return false;
    }else{
        for (let item2 of permissionList) {
            if(binding.value === item2.action){
                return true;
            }
        }
    }
    return false;
}

/**
 * 全局权限控制
 */
export const filterGlobalPermission = (el, binding, vnode) => {
    debugger;
    let permissionList = [];
    let allPermissionList = [];

    let authList = JSON.parse(localStorage.getItem(USER_AUTH) || "[]");
    for (let auth of authList) {
        if(auth.type !== '2') {
            permissionList.push(auth);
        }
    }
    //console.log("页面权限--Global--",sessionStorage.getItem(SYS_BUTTON_AUTH));
    let allAuthList = JSON.parse(localStorage.getItem(SYS_BUTTON_AUTH) || "[]");
    for (let gauth of allAuthList) {
        if(gauth.type !== '2') {
            allPermissionList.push(gauth);
        }
    }
    //设置全局配置是否有命中
    let invalidFlag = false;//无效命中
    if(allPermissionList.length){
        for (let itemG of allPermissionList) {
            if(binding.value === itemG.action){
                if(itemG.status === '0'){
                    invalidFlag = true;
                    break;
                }
            }
        }
    }
    if(invalidFlag){
        return;
    }
    if (!permissionList.length) {
        el.parentNode.removeChild(el);
        return;
    }
    let permissions = [];
    for (let item of permissionList) {
        if(item.type !== '2'){
            permissions.push(item.action);
        }
    }
    if (!permissions.includes(binding.value)) {
        el.parentNode.removeChild(el);
    }
}

export default hasPermission;
