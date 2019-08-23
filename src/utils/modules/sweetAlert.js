import Swal from 'sweetalert2'
import i18n from '@/locale'

let alertConf = {
    width: '25rem',
    heightAuto: false,
    focusConfirm: true,
};

export default {
    success: (title) => {
        Swal.fire({
            type: 'success',
            title,
            ...alertConf
        })
    },
    successWithTimer: (title) => {
        Swal.fire({
            position: 'top',
            type: 'success',
            title,
            toast: true,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {

        })
    },
    error: (title) => {
        Swal.fire({
            type: 'error',
            title,
            ...alertConf
        })
    },
    errorWithTimer: (title) => {
        Swal.fire({
            position: 'top',
            type: 'error',
            title,
            toast: true,
            showConfirmButton: false,
            timer: 1500
        })
    },
    warn: (title) => {
        Swal.fire({
            type: 'warning',
            title,
            ...alertConf
        })
    },
    warnWithTimer: (title) => {
        Swal.fire({
            position: 'top',
            type: 'warning',
            title,
            toast: true,
            showConfirmButton: false,
            timer: 1500
        })
    },
    confirm: (title, text, oper, params) => {
        let _this = this
        Swal.fire({
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
