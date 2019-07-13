import Cookies from 'js-cookie'
import {isURL} from './validate'

// cookie保存的天数
import constant from './constant'

const {config: {cookieExpires}} = constant

export const TOKEN_KEY = 'Access-Token'

export const setToken = (token) => {
    Cookies.set(TOKEN_KEY, token, {expires: cookieExpires || 1})
}

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return false
}

export const localSave = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export const localRead = (key) => {
    return JSON.parse(localStorage.getItem(key)) || ''
}

export const downloadFile = (data, filename) => {
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
}

export const formFileDownload = (url,params) => {
    let form = document.createElement("form");
    form.style.display = 'none';
    form.action = url;
    form.method = "post";
    form.target = '_self';
    document.body.appendChild(form);
    params = {
        ...params,
        token : getToken()
    }
    for(let key in params){
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
    }

    form.submit();
    form.remove();
}


export const handleScreen = (fullScreen) => {
    let main = document.body
    if (fullScreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        }
    } else {
        if (main.requestFullscreen) {
            main.requestFullscreen()
        } else if (main.mozRequestFullScreen) {
            main.mozRequestFullScreen()
        } else if (main.webkitRequestFullScreen) {
            main.webkitRequestFullScreen()
        } else if (main.msRequestFullscreen) {
            main.msRequestFullscreen()
        }
    }
}


/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (() =>{
    if (document.addEventListener) {
        return (element, event, handler) => {
            if (element && event && handler) {
                element.addEventListener(event, handler, false)
            }
        }
    } else {
        return (element, event, handler) => {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler)
            }
        }
    }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (()=>{
    if (document.removeEventListener) {
        return  (element, event, handler) => {
            if (element && event) {
                element.removeEventListener(event, handler, false)
            }
        }
    } else {
        return (element, event, handler) => {
            if (element && event) {
                element.detachEvent('on' + event, handler)
            }
        }
    }
})()

// 生成首页路由
export const generateIndexRouter = (data) =>{
    let indexRouter = [{
        path: '/',
        name: 'dashboard',
        //component: () => import('@/components/layouts/BasicLayout'),
        component: resolve => require(['@/components/layouts/TabLayout'], resolve),
        meta: { title: '首页' },
        redirect: '/dashboard/analysis',
        children: [
            ...generateChildRouters(data)
        ]
    },{
        "path": "*", "redirect": "/404", "hidden": true
    }]
    return indexRouter;
}

// 生成嵌套路由（子路由）
 const generateChildRouters = (data) =>{
    const routers = [];
    for (let item of data) {
        let component = "";
        if(item.component.includes('layouts')){
            component = "components/"+item.component;
        }else{
            component = "views/"+item.component;
        }

        // eslint-disable-next-line
        let URL = (item.meta.url|| '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
        if (isURL(URL)) {
            item.meta.url = URL;
        }

        let menu =  {
            path: item.path,
            name: item.name,
            redirect:item.redirect,
            component: resolve => require(['@/' + component+'.vue'], resolve),
            hidden:item.hidden,
            //component:()=> import(`@/views/${item.component}.vue`),
            meta: {
                title:item.meta.title ,
                icon: item.meta.icon,
                url:item.meta.url ,
                permissionList:item.meta.permissionList
            }
        }
        if(item.alwaysShow){
            menu.alwaysShow = true;
        }
        if (item.children && item.children.length > 0) {
            menu.children = [...generateChildRouters( item.children)];
        }
        //--update-begin----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
        //判断是否生成路由
        if(item.route && item.route === '0'){
            //console.log(' 不生成路由 item.route：  '+item.route);
            //console.log(' 不生成路由 item.path：  '+item.path);
        }else{
            routers.push(menu);
        }
        //--update-end----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
    }
    return routers
}

