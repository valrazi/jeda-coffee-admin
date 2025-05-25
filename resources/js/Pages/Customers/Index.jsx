// Orders/index.js
import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Table, Input, Select, Button, Space, Modal, message, Tag, Divider } from "antd";
import { EyeOutlined, CheckOutlined } from "@ant-design/icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc);

const { Search } = Input;
const { Option } = Select;

const CustomerIndex = ({ auth }) => {
    const { customers, filters } = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    // const [selectedOrder, setSelectedOrder] = useState(null);

    // Search orders
    const onSearch = (value) => {
        setSearch(value);
        router.get("/customers", { search: value, status }, { preserveState: true });
    };

    // Filter by status
    const onStatusChange = (value) => {
        setStatus(value);
        router.get("/customers", { search, status: value }, { preserveState: true });
    };

    // // View order details
    // const viewOrder = (order) => {
    //     setSelectedOrder(order);
    //     setNewStatus(order.order_status)
    // };

    // // Close modal
    // const closeModal = () => {
    //     setSelectedOrder(null);
    // };



    const columns = [
        {
            title: "No.",
            dataIndex: "index",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: "Name",
            key: "full_name",
            dataIndex: 'full_name'
        },
        {
            title: "Phone Number",
            key: "phone_number",
            dataIndex: 'phone_number',
            render: (text) => `+62${text}`
        },
        // {
        //     title: "Customer",
        //     key: "customer_name",
        //     render: (_, record) => (
        //         <div>
        //             {
        //                 (record.customer.full_name && record.customer.phone_number) ? (
        //                     <span style={{ textAlign: 'center' }}>
        //                         {
        //                             record.customer.full_name
        //                         }
        //                         <br></br>
        //                         {
        //                             `+62${record.customer.phone_number}`
        //                         }
        //                     </span>
        //                 ) : 'N/A'
        //             }
        //         </div>
        //     ),
        // },
        // { title: "Total Price", dataIndex: "total_price", key: "total_price", render: (text) => `Rp ${text}` },
        // {
        //     title: "Payment Method",
        //     dataIndex: "paid_at_cashier",
        //     key: "paid_at_cashier",
        //     render: (text) =>
        //         <span>{text ? 'PEMBAYARAN CASH' : 'PEMBAYARAN TRANSFER'}</span>
        // },
        // {
        //     title: "Status",
        //     dataIndex: "order_status",
        //     key: "order_status",
        //     render: (text) =>
        //         <Tag color=
        //             {
        //                 text === "pending" ? "orange" :
        //                     text === "preparing" ? "cyan" :
        //                         text === "ready" ? "green" :
        //                             text === "completed" ? "default" : "error"
        //             }>{text.toUpperCase()}</Tag>,
        // },
        // {
        //     title: "Order Date",
        //     dataIndex: "created_at",
        //     key: "created_at",
        //     render: (text) => <span>{dayjs(text).format('DD MMM YYYY, HH:mm')}</span>,
        // },
        // {
        //     title: "Actions",
        //     key: "actions",
        //     render: (_, record) => (
        //         <Space>
        //             <Button icon={<EyeOutlined />} onClick={() => viewOrder(record)}>View</Button>
        //             {record.status === "pending" && (
        //                 <Button icon={<CheckOutlined />} type="primary" onClick={() => updateStatus(record.id, "completed")}>
        //                     Complete
        //                 </Button>
        //             )}
        //         </Space>
        //     ),
        // },
    ];

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Customers</h2>}>
            <Head title="Customers" />

            <div className="p-6 rounded-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <Space>
                        <Search placeholder="Search customers..." onSearch={onSearch} defaultValue={search} allowClear />
                    </Space>
                </div>

                <div className="flex justify-end items-center">
                    <h1>Total Customers: {customers.total}</h1>
                </div>

                <Table columns={columns} dataSource={customers.data} rowKey="id" pagination={{ current: customers.current_page, total: customers.total, pageSize: customers.per_page, onChange: (page) => router.get("/customers", { page, search, status }, { preserveState: true }) }} />

            </div>

            {/* Order Details Modal */}

        </AuthenticatedLayout>
    );
};

export default CustomerIndex;
