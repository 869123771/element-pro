import Swal from 'sweetalert2'

const modelConf = {
    width: '25rem',
    heightAuto: false,
}
export default {
    success: (title) => {
        Swal.fire({
            type: 'success',
            title,
            ...modelConf
        })
    },
    successWithTimer: (title, oper) => {
        Swal.fire({
            position: 'top',
            type: 'success',
            title,
            toast: true,
            showCofirmButton: false,
            timer: 1500
        }).then(() => {
            oper()
        })
    },
    error: (title) => {
        Swal.fire({
            type: 'error',
            title,
            ...modelConf
        })
    },
    warn: (title) => {
        Swal.fire({
            type: 'warning',
            title,
            ...modelConf
        })
    },
    confirm: (title, text, oper, params) => {
        let _this = this
        Swal.fire({
            title,
            text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            ...modelConf,
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
