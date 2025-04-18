import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Modal, Form, Input, message } from "antd";
export default function ModalForm({ modalForm, setModalForm, detailData, setDetailData, user }) {
    const [form] = Form.useForm()
    useEffect(() => {
        if (detailData) {
            form.setFieldsValue({
                name: detailData.name,
                email: detailData.email,
            })
        }else {
            form.resetFields()
        }
    }, [detailData])

    const [passwordVisible, setPasswordVisible] = useState(false);
    const closeModal = () => {
        setModalForm(false)
        setDetailData(null)
    }
    const onFinish = async (values) => {
        if(!detailData) {
            router.post("/users", values, {
                onSuccess: () => {
                    message.success("User Created Success!")
                    form.resetFields()
                    setModalForm(false)
                },
                onError: (err) => {
                    console.log(err);
                    message.error("User Created Failed!\n" + JSON.stringify(err))
                }
            })
        }else {
            router.put("/users/" + detailData.id, values, {
                onSuccess: () => {
                    message.success("User Updated Success!")
                    form.resetFields()
                    setModalForm(false)
                },
                onError: (err) => {
                    console.log(err);
                    message.error("User Updated Failed!\n" + JSON.stringify(err))
                }
            })
        }
    }
    return (
        <Modal
            title={<p>User Management</p>}
            footer={null}
            open={modalForm}
            onCancel={closeModal}>
                {
                    JSON.stringify(detailData)
                }
            <Form
                form={form}
                name="user_form"
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        { required: true, message: "Please enter your name" },
                        { min: 3, message: "Name must be at least 3 characters" },
                    ]}
                >
                    <Input placeholder="Enter your name" className="h-10" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Invalid email format" },
                    ]}
                >
                    <Input placeholder="Enter your email" className="h-10" />
                </Form.Item>

                {
                    (!detailData || user.role.name == 'owner' || user.id == detailData.id) && (
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={
                                !detailData ?
                                    [
                                        { required: true, message: "Please enter your password" },
                                        { min: 4, message: "Password must be at least 4 characters" },
                                    ]
                                : undefined
                            }
                        >
                            <Input.Password
                                placeholder="Enter your password"
                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                                className="h-10" />
                        </Form.Item>
                    )
                }

                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
