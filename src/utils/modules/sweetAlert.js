import Swal from 'sweetalert2'

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
    successWithTimer: (title, oper) => {
        Swal.fire({
            position: 'top',
            type: 'success',
            title,
            toast: true,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            oper()
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
    confirm: (title, text, oper, params) => {
        let _this = this
        Swal.fire({
            title,
            text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
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
