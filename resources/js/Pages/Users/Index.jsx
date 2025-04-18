import React, { useState } from 'react'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, Head, router } from "@inertiajs/react";
import hasAnyPermission from '@/Utils/Permissions';
import { Button, Table, Input, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ModalForm from '@/Components/Users/ModalForm';
const { Search } = Input

import "antd/dist/reset.css";
import Swal from 'sweetalert2';
export default function Index({ auth }) {
    const [modalForm, setModalForm] = useState(false)
    const [detailData, setDetailData] = useState({})
    const { users } = usePage().props;
    const updateData = async(params) => {
        setDetailData((prev) => {
            console.log("Previous detailData:", prev); // Logs previous value
            console.log("New detailData:", params); // Logs correct new value
            return params;
        });
        setModalForm(true);
    }
    const deleteData = (params) => {
        Swal.fire({
            icon: 'question',
            title: 'Delete User?',
            showCancelButton: true
        })
        .then((res) => {
            if(res.isConfirmed) {
                router.delete(`/users/${params.id}`, {
                    onSuccess: () => {
                        message.success("User Deleted Success!")
                        form.resetFields()
                        setDetailData(false)
                    },
                    onError: (err) => {
                        console.log(err);
                        message.error("User Deleted Failed!\n" + JSON.stringify(err))
                    }
                })
            }
        })
    }
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            render: (id, { roles, ...params }) => (
                <>
                    <div className='flex gap-2'>
                        {
                            auth.user.role != 'owner' && auth.user.id && (
                                <Button color='orange' variant='solid' onClick={() => updateData(params)}>Update</Button>
                            )
                        }
                        {auth.user.role == 'owner' && (
                            <Button color='orange' variant='solid' onClick={() => updateData(params)}>Update</Button>
                        )}
                        {
                            roles[0].name != 'owner' && (
                                <Button color='red' variant='solid' onClick={() => deleteData(params)}>Delete</Button>
                            )
                        }
                    </div>
                </>
            )
        }
    ];

    const dataSource = users.data.map((u) => {
        u.key = u.id
        u.role = ''
        u.roles.forEach((r) => {
            u.role += `${r.name}\n`
        })
        return u
    })


    const onSearch = (value) => {
        router.get(`/users?search=${value}`)
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>}
        >
            <ModalForm user={auth.user} detailData={detailData} setDetailData={setDetailData} modalForm={modalForm} setModalForm={setModalForm} />
            <Head title={'Users'} />
            <div className='mb-4 flex flex-col p-4'>
                <div className='w-full flex flex-col lg:flex-row justify-between'>
                    <div className='w-full lg:w-1/3 my-2'>

                        <Input.Search
                            onSearch={onSearch}
                            size='large'
                            className='h-10'
                            placeholder='Search by name' />
                    </div>
                    <div className=' my-2'>
                        {hasAnyPermission(['users create']) &&
                            <Button
                                onClick={() => {
                                    setDetailData(undefined)
                                    setModalForm(true)
                                }}
                                icon={<PlusOutlined />}>
                                Add Users</Button>
                        }
                    </div>
                </div>
                {
                    (users && users.data && users.data.length) && (
                        <Table dataSource={dataSource} columns={columns} />
                    )
                }
            </div>

        </AuthenticatedLayout>
    )
}
