import Swal from 'sweetalert2'
import i18n from '@/locale'

let alertConf = {
    width: '25rem',
    heightAuto: false,
    focusConfirm: true,
    showClass: {
        popup: 'animated fadeInDown faster'
    },
    hideClass: {
        popup: 'animated fadeOutUp faster'
    }
};

export default {
    success: (title) => {
        Swal.fire({
            type: 'success',
            icon: 'success',
            title,
            showConfirmButton: false,
            timer: 1500,
            ...alertConf
        })
    },
    successWithTimer: (title) => {
        Swal.fire({
            position: 'top',
            icon: 'success',
            type: 'success',
            title,
            toast: true,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {

        })
    },
    error: (title,oper) => {
        Swal.fire({
            type: 'error',
            icon: 'error',
            title,
            ...alertConf
        }).then(()=>{
            if(oper) oper()
        })
    },
    errorWithTimer: (title) => {
        Swal.fire({
            position: 'top',
            type: 'error',
            icon: 'error',
            title,
            toast: true,
            showConfirmButton: false,
            timer: 1500
        })
    },
    warn: (title) => {
        Swal.fire({
            type: 'warning',
            icon: 'warning',
            title,
            ...alertConf
        })
    },
    warnWithTimer: (title) => {
        Swal.fire({
            position: 'top',
            type: 'warning',
            icon: 'warning',
            title,
            toast: true,
            showConfirmButton: false,
            timer: 1500
        })
    },
    confirm: (title, text, oper, params) => {
        let _this = this
        Swal.fire({
            icon: 'warning',
            title,
            text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: i18n.t('common_confirm'),
            cancelButtonText: i18n.t('common_cancel'),
            ...alertConf,
            preConfirm: () => {
                oper(params)
            }
        }).then(({value, dismiss}) => {
            if (!value) {
                _this.error('已取消')
            }
        })
    }
}
