import { usePage } from "@inertiajs/react";

export default function hasAnyPermission(permission) {
    const {auth} = usePage().props

    let allPermission = auth.permissions

    let hasPermission = false

    permission.forEach((item) => {
        if(allPermission[item]) hasPermission = true
    })


    return hasPermission
}
