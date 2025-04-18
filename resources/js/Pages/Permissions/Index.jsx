import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import hasAnyPermission from '@/Utils/Permissions';
import {Button} from 'antd'
export default function Index({ auth }) {
    const props = usePage().props;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Permissions</h2>}
        >
            <Head title={'Permissions'} />
            <div className='mb-4 p-4 flex items-center justify-between gap-4'>
                {hasAnyPermission(['permissions create']) &&
                    <Button href={route('permissions.create')}/>
                }
            </div>
        </AuthenticatedLayout>
    )
}
