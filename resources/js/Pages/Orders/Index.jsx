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

const OrderIndex = ({ auth }) => {
    const { orders, filters } = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    console.log(orders);
    // Search orders
    const onSearch = (value) => {
        setSearch(value);
        router.get("/orders", { search: value, status }, { preserveState: true });
    };

    // Filter by status
    const onStatusChange = (value) => {
        setStatus(value);
        router.get("/orders", { search, status: value }, { preserveState: true });
    };

    // View order details
    const viewOrder = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.order_status)
    };

    // Close modal
    const closeModal = () => {
        setSelectedOrder(null);
    };


    const updateStatus = (status) => {
        if (!selectedOrder) return;
        let statusUpdate = status
        if (status == 'accept') statusUpdate = 'preparing'
        else if (status == 'reject') statusUpdate = 'cancelled'
        router.put(`/orders/${selectedOrder.id}`, { status: statusUpdate }, {
            onSuccess: () => {
                message.success("Order status updated!");
                closeModal();
            },
            onError: (error) => {
                console.log(error);
                message.error("Failed to update order status")
            },
        });
    };

    const columns = [
        {
            title: "No.",
            dataIndex: "index",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        { title: "ID", dataIndex: "id", key: "id" },

        {
            title: "Table Number",
            key: "table_number",
            render: (text, _) => `Table ${text.table_number}`
        },
        {
            title: "Customer",
            key: "customer_name",
            render: (_, record) => (
                <div>
                    {
                        (record.customer.full_name && record.customer.phone_number) ? (
                            <span style={{ textAlign: 'center' }}>
                                {
                                    record.customer.full_name
                                }
                                <br></br>
                                {
                                    `+62${record.customer.phone_number}`
                                }
                            </span>
                        ) : 'N/A'
                    }
                </div>
            ),
        },
        { title: "Total Price", dataIndex: "total_price", key: "total_price", render: (text) => `Rp ${text}` },
        {
            title: "Payment Method",
            dataIndex: "paid_at_cashier",
            key: "paid_at_cashier",
            render: (text) =>
                <span>{text ? 'PEMBAYARAN CASH' : 'PEMBAYARAN TRANSFER'}</span>
        },
        {
            title: "Status",
            dataIndex: "order_status",
            key: "order_status",
            render: (text) =>
                <Tag color=
                    {
                        text === "pending" ? "orange" :
                            text === "preparing" ? "cyan" :
                                text === "ready" ? "green" :
                                    text === "completed" ? "default" : "error"
                    }>{text.toUpperCase()}</Tag>,
        },
        {
            title: "Order Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (text) => <span>{dayjs(text).format('DD MMM YYYY, HH:mm')}</span>,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => viewOrder(record)}>View</Button>
                    {record.status === "pending" && (
                        <Button icon={<CheckOutlined />} type="primary" onClick={() => updateStatus(record.id, "completed")}>
                            Complete
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Orders</h2>}>
            <Head title="Orders" />

            <div className="p-6 rounded-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <Space>
                        <Search placeholder="Search orders..." onSearch={onSearch} defaultValue={search} allowClear />
                    </Space>
                    <Space>
                        <Select defaultValue="" style={{ width: 150 }} onChange={onStatusChange}>
                            <Option value="">All</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="preparing">Preparing</Option>
                            <Option value="ready">Ready</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                    </Space>
                </div>

                <div className="flex justify-end items-center">
                    <h1>Total Orders: {orders.total}</h1>
                </div>

                <Table columns={columns} dataSource={orders.data} rowKey="id" pagination={{ current: orders.current_page, total: orders.total, pageSize: orders.per_page, onChange: (page) => router.get("/orders", { page, search, status }, { preserveState: true }) }} />

            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <Modal open title="Order Details" footer={null} onCancel={closeModal}>
                    <p ><strong>Date:</strong> {dayjs(selectedOrder.created_at).format('DD MMM YYYY, HH:mm')}</p>
                    <p><strong>Customer:</strong> {`${selectedOrder.customer.full_name} (+62${selectedOrder.customer.phone_number})`}</p>
                    <p><strong>Total Price:</strong> Rp {selectedOrder.total_price}</p>
                    <p ><strong>Status:</strong> {selectedOrder.order_status}</p>

                    <p ><strong>Payment Method:</strong> {selectedOrder.paid_at_cashier ? 'PEMBAYARAN CASH' : 'PEMBAYARAN TRANSFER'}</p>

                    <p ><strong>Table Number:</strong> {selectedOrder.table_number}</p>
                    {
                        selectedOrder.paid_at_cashier ? (
                            <p className="text-green-400"><strong>PAID AT CASHIER</strong></p>
                        ) : (
                            <>
                                <p ><strong>Transfer Proof:</strong></p>
                                <img src={selectedOrder.transfer_proof} className="w-40" alt="" /></>
                        )
                    }

                    {
                        selectedOrder.order_status == 'pending' && (
                            <div className="flex w-full gap-4 my-2">
                                <Button type="primary" variant="outlined" color="green" style={{ flex: 1 }} onClick={() => updateStatus('accept')}>Accept</Button>
                                <Button type="primary" variant="outlined" color="red" style={{ flex: 1 }} onClick={() => updateStatus('reject')}>Reject</Button>

                            </div>
                        )
                    }

                    {
                        selectedOrder.order_status == 'preparing' && (
                            <div className="flex w-full gap-4 my-2">
                                <Button type="primary" variant="outlined" color="green" style={{ flex: 1 }} onClick={() => updateStatus('ready')}>Ready</Button>
                                <Button type="primary" variant="outlined" color="red" style={{ flex: 1 }} onClick={() => updateStatus('reject')}>Reject</Button>
                            </div>
                        )
                    }

                    <Divider />
                    <Table
                        dataSource={selectedOrder.order_items}
                        rowKey="id"
                        pagination={false}
                        columns={[
                            { title: "Item Name", dataIndex: "name", key: "name" },
                            { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                            { title: "Note", dataIndex: "note", key: "note" },
                            { title: "Price", dataIndex: "price", key: "price", render: (text) => `Rp ${text}` },
                        ]}
                    />

                </Modal>
            )}
        </AuthenticatedLayout>
    );
};

export default OrderIndex;
