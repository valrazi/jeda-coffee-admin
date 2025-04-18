import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Table, Input, Select, Button, Space, Modal, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SubcategoryFormModal from "@/Components/Subcategories/ModalForm";



const { Search } = Input;
const SubcategoryIndex = ({ auth }) => {
    const { subcategories, filters } = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");

    const [isEdit, setIsEdit] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCreate = () => {
        setIsEdit(null);
        setModalVisible(true);
    }

    const handleEdit = (data) => {
        setIsEdit(data)
        setModalVisible(true)
    }

    const handleDelete = (id) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => {
                router.delete(`/subcategories/${id}`, {
                    onSuccess: () => message.success("Subcategory deleted successfully"),
                    onError: () => message.error("Failed to delete Subcategory"),
                });
            },
        })
    }

    const hanldeSearch = (value) => {
        setSearch(value)
        router.get('/subcategories', { search: value }, { preserveState: true })
    }

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", width: 100 }, // small fixed width
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Category", dataIndex: "category", key: "category" }, // take remaining space
        {
            title: "#",
            key: "actions",
            width: 120, // small fixed width
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            )
        }
    ]


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Subcategories</h2>}
        >
            <Head title="Subcategories" />

            <div className="p-6  rounded-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <Space>
                        <Search
                            placeholder="Search subcategories..."
                            onSearch={hanldeSearch}
                            defaultValue={search}
                            allowClear
                        />
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        Create Subcategory
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={subcategories.data}
                    rowKey="id"
                    pagination={{
                        current: subcategories.current_page,
                        total: subcategories.total,
                        pageSize: subcategories.per_page,
                        onChange: (page) => Inertia.get("/subcategories", { page, search }, { preserveState: true }),
                    }}
                />
            </div>

            <SubcategoryFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                subcategory={isEdit}
            />
        </AuthenticatedLayout>
    )
}

export default SubcategoryIndex;
