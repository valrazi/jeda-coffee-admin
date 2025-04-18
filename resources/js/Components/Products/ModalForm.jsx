import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { router } from "@inertiajs/react";
const { Option } = Select;

const ProductFormModal = ({ visible, onClose, product = null, subcategories }) => {
    const [form] = Form.useForm();
    const category = Form.useWatch('category', form)
    const [file, setFile] = useState(null);

    // Set form data when product is provided (for editing)
    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                name: product.name,
                price: +product.price,
                category: product.category,
                description: product.description,
                stock: product.stock,
                subcategory: product.subcategory_id
            });
        } else {
            form.resetFields();
            setFile(null);
        }
    }, [product, form]);

    const handleUpload = ({ file }) => {
        setFile(file);
    };

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("category", values.category);
        formData.append("description", values.description || "");
        formData.append("stock", values.stock);
        formData.append("subcategory", values.subcategory)

        if (file) {
            formData.append("image", file); // Append file only if selected
        }


        if (product) {
            formData.append("_method", "PUT");
            // Update Product
            router.post(`/products/${product.id}`, formData, {
                onSuccess: () => {
                    message.success("Product updated successfully");
                    form.resetFields()
                    onClose();
                },
                onError: (errors) => message.error(errors.image || "Something went wrong"),
                preserveScroll: true, // Ensures page doesn't refresh unnecessarily
            });
        } else {
            // Create Product
            router.post("/products", formData, {
                onSuccess: () => {
                    message.success("Product created successfully");
                    form.resetFields()
                    onClose();
                },
                onError: (errors) => message.error(errors.image || "Something went wrong"),
                preserveScroll: true,
            });
        }
    };

    console.log({ category });

    return (
        <Modal
            title={product ? "Edit Product" : "Create Product"}
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter product name" }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Price" name="price" rules={[{ required: true, type: "number", min: 1, message: "Enter valid price" }]}>
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Category" name="category" rules={[{ required: true, message: "Select a category" }]}>
                    <Select>
                        <Option value="Makanan">Makanan</Option>
                        <Option value="Minuman">Minuman</Option>
                    </Select>
                </Form.Item>

                {
                    category &&
                    (
                        <Form.Item label="Subcategory" name="subcategory">
                            <Select allowClear={true}>
                                {subcategories.filter((s) => s.category == category).map((s) => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                            </Select>
                        </Form.Item>
                    )
                }



                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item label="Stock" name="stock" rules={[{ required: true, type: "number", min: 0, message: "Enter valid stock" }]}>
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Upload Image">
                    <Upload beforeUpload={() => false} maxCount={1} onChange={handleUpload}>
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                    {product?.image && (
                        <img src={product.image} alt="Product" width={100} style={{ marginTop: 10 }} />
                    )}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {product ? "Update" : "Create"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductFormModal;
