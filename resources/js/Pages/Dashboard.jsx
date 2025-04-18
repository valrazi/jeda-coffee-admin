import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DownloadOutlined } from '@ant-design/icons';
import { Head } from '@inertiajs/react';
import { Button, Card, Col, Row } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DatePicker, message } from 'antd';
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function Dashboard({ auth, totalThisYear, totalThisMonth, totalToday, transactionPerMonth, transactionPerYear }) {
    const [range, setRange] = useState([dayjs().subtract(7, 'day'),
        dayjs()]);
    const [loading, setLoading] = useState(false);
    const fetchData = async (dates) => {
        setLoading(true);
        try {
            router.get(route('dashboard'), {
                start_at: dates[0]?.format('YYYY-MM-DD'),
                end_at: dates[1]?.format('YYYY-MM-DD'),
            }, {
                preserveState: true,
                replace: true,
                only: ['totalThisYear', 'totalThisMonth', 'totalToday', 'transactionPerMonth', 'transactionPerYear'],
                onFinish: () => setLoading(false),
            });
        } catch (error) {
            message.error('Failed to fetch dashboard data.');
            setLoading(false);
        }
    };
    const resetData = async () => {
        setLoading(true);
        try {
            router.get(route('dashboard'), {
                preserveState: true,
                replace: true,
                only: ['totalThisYear', 'totalThisMonth', 'totalToday', 'transactionPerMonth', 'transactionPerYear'],
                onFinish: () => setLoading(false),
            });
        } catch (error) {
            message.error('Failed to fetch dashboard data.');
            setLoading(false);
        }
    };
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            {
                auth.permissions['users index'] ? (
                    <div className="py-12">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                            <Row gutter={12} className='flex justify-between'>
                                <RangePicker
                                    allowClear
                                    value={range}
                                    onChange={(val) => {
                                        setRange(val);
                                        if (val && val[0] && val[1]) {
                                            fetchData(val);
                                        }else {
                                            resetData()
                                        }
                                    }}
                                    format="YYYY-MM-DD"
                                />
                                <Button
                                    onClick={() => window.open(route('dashboard.export-orders'), '_blank')}
                                    icon={<DownloadOutlined />}>Export Data</Button>
                            </Row>
                            {/* Total Transaction Cards */}
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Card title="Total This Year" bordered={false} className="!shadow !rounded-xl">
                                        Rp {totalThisYear.toLocaleString()}
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Total This Month" bordered={false} className="!shadow !rounded-xl">
                                        Rp {totalThisMonth.toLocaleString()}
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Total Today" bordered={false} className="!shadow !rounded-xl">
                                        Rp {totalToday.toLocaleString()}
                                    </Card>
                                </Col>
                            </Row>



                            {/* Chart */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="p-4 bg-white shadow rounded">
                                    <h2 className="text-lg mb-2">Transaction Per Month ({new Date().getFullYear()})</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={transactionPerMonth}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="month"
                                                // If your backend send month as number (1, 2, 3...)
                                                tickFormatter={(month) =>
                                                    new Date(0, month - 1).toLocaleString('en-US', { month: 'long' })
                                                }
                                            />
                                            <YAxis domain={[0, Math.max(...transactionPerMonth.map(item => item.total)) + 50000]} />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                                        </LineChart>
                                    </ResponsiveContainer>

                                </div>

                                <div className="p-4 bg-white shadow rounded">
                                    <h2 className="text-lg mb-2">Transaction Per Year</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={transactionPerYear}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="year" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="total" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>

                        </div>
                    </div>
                ) : <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                You're logged in!
                            </div>
                        </div>
                    </div>
                </div>
            }
        </AuthenticatedLayout>
    )
}
