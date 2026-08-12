import Swal from 'sweetalert2';

const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
})

export const notify = {
    success: (title: string) => toast.fire({ icon: "success", title }),
    error: (title: string) => toast.fire({ icon: "error", title }),
    info: (title: string) => toast.fire({ icon: "info", title }),
    warning: (title: string) => toast.fire({ icon: "warning", title }),
}

export const confirmDestructive = (opts: { title: string, text?: string, confirmLabel?: string }) => {
    return Swal.fire({
        title: opts.title,
        text: opts.text,
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        focusCancel: true,
        confirmButtonText: opts.confirmLabel ?? 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        buttonsStyling: false,
    })
}