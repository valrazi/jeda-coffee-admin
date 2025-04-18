import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Table, Input, Select, Button, Space, Modal, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ProductFormModal from "../../Components/Products/ModalForm";

const { Search } = Input;
const { Option } = Select;

const ProductIndex = ({auth}) => {
    const { products, filters, subcategories } = usePage().props;
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [search, setSearch] = useState(filters?.search || "");
    const [category, setCategory] = useState("");

    // Open modal for creating product
    const handleCreate = () => {
        setEditingProduct(undefined);
        setModalVisible(true);
    };

    // Open modal for editing product
    const handleEdit = (product) => {
        setEditingProduct(product);
        setModalVisible(true);
    };

    // Delete product
    const handleDelete = (id) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => {
                router.delete(`/products/${id}`, {
                    onSuccess: () => message.success("Product deleted successfully"),
                    onError: () => message.error("Failed to delete product"),
                });
            },
        });
    };

    // Handle search
    const onSearch = (value) => {
        setSearch(value);
        router.get("/products", { search: value, category }, { preserveState: true });
    };

    // Handle category filter
    const onCategoryChange = (value) => {
        setCategory(value);
        router.get("/products", { search, category: value }, { preserveState: true });
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Price", dataIndex: "price", key: "price", render: (text) => `Rp ${text}` },
        { title: "Stock", dataIndex: "stock", key: "stock" },
        { title: "Category", dataIndex: "category", key: "category" },
        {
            title: "Subcategory",
            dataIndex: "subcategory",
            key: "subcategory",
            render: (_, text) => text.subcategory ? text.subcategory.name : '',
        },
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (text) => text ? <img src={text} alt="Product" width={50} /> : "No Image",
        },
        {
            title: "#",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    console.log(usePage().props);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Products" />

            <div className="p-6  rounded-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <Space>
                        <Search
                            placeholder="Search products..."
                            onSearch={onSearch}
                            defaultValue={search}
                            allowClear
                        />
                        <Select defaultValue="" style={{ width: 150 }} onChange={onCategoryChange}>
                            <Option value="">All</Option>
                            <Option value="Makanan">Makanan</Option>
                            <Option value="Minuman">Minuman</Option>
                        </Select>
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        Create Product
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={products.data}
                    rowKey="id"
                    pagination={{
                        current: products.current_page,
                        total: products.total,
                        pageSize: products.per_page,
                        onChange: (page) => Inertia.get("/products", { page, search, category }, { preserveState: true }),
                    }}
                />
            </div>

            <ProductFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                product={editingProduct}
                subcategories={subcategories}
            />
        </AuthenticatedLayout>
    );
};

export default ProductIndex;
