import { router } from '@inertiajs/react';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { useEffect } from 'react';
const { Option } = Select;

const SubcategoryFormModal = ({ visible, onClose, subcategory = null }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (subcategory) {
            form.setFieldsValue({
                name: subcategory.name,
                category: subcategory.category
            })
        } else {
            form.resetFields();
        }
    }, [subcategory, form]);

    const handleFinish = async (values) => {
        const payload = {
            name: values.name,
            category: values.category
        }

        if (subcategory) {
            router.put(`/subcategories/${subcategory.id}`, payload, {
                onSuccess: () => {
                    message.success("Subcategory updated successfully");
                    onClose();
                    form.resetFields()
                },
                onError: (errors) => message.error(errors),
                preserveScroll: true
            })
        } else {
            router.post("/subcategories", payload, {
                onSuccess: () => {
                    message.success("Subcategory created succesfulyy")
                    onClose();
                    form.resetFields()
                },
                onError: (errors) => message.error(errors),
                preserveScroll: true
            })
        }
    }

    return (
        <Modal
            title={subcategory ? "Edit Subcategory" : "Create Category"}
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} onFinish={handleFinish} layout='vertical'>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Subcategory Name"
                        }
                    ]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Category" name="category" rules={[{ required: true, message: "Select a category" }]}>
                    <Select>
                        <Option value="Makanan">Makanan</Option>
                        <Option value="Minuman">Minuman</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {subcategory ? "Update" : "Create"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default SubcategoryFormModal
