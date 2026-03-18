import { Form, Divider, Input, InputNumber, Button, Upload, message, Select, Checkbox } from "antd";
import "./index.css";
import { useState } from "react";
import { API_URL } from "../config/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function UploadPage() {
    const [imageUrl, setImageUrl] = useState(null);
    const [isBest, setIsBest] = useState(false);
    const navigate = useNavigate();

    const categories = [
      { label: "추억의 불량식품", value: "snack" },
      { label: "일본간식", value: "japan" },
      { label: "중국간식", value: "china" },
      { label: "동남아간식", value: "asia" },
      { label: "유럽간식", value: "europe" },
      { label: "미국간식", value: "usa" },
      { label: "라면/컵라면", value: "ramen" },
      { label: "음료/커피", value: "drink" }
    ];

    const onSubmit = (values) => {
        if (!imageUrl) {
            message.error("상품 이미지를 업로드해주세요");
            return;
        }

        axios
            .post(`${API_URL}/products`, {
                name: values.name,
                description: values.description,
                seller: values.seller,
                price: parseInt(values.price),
                quantity: parseInt(values.quantity),
                imageUrl: imageUrl,
                category: values.category,
                isBest: isBest
            })
            .then(() => {
                message.success("상품이 성공적으로 업로드되었습니다.");
                navigate(`/`);
            })
            .catch((error) => {
                console.error(error);
                message.error(`에러가 발생했습니다. ${error.message}`);
            });
    };

    const onChangeImage = (info) => {
        if (info.file.status === "uploading") {
            return;
        }
        if (info.file.status === "done") {
            const response = info.file.response;
            setImageUrl(response.imageUrl);
        }
    };

    return (
        <div id="upload-container">
            <Form name="상품 업로드" onFinish={onSubmit}>
                <Form.Item
                    name="upload"
                    label={<div className="upload-label">상품 사진</div>}
                >
                    <Upload
                        name="image"
                        action={`${API_URL}/image`}
                        listType="picture"
                        showUploadList={false}
                        onChange={onChangeImage}
                    >
                        {imageUrl ? (
                            <img id="upload-img" src={`${API_URL}/${imageUrl}`} alt="uploaded" />
                        ) : (
                            <div id="upload-img-placeholder">
                                <img src="/images/icons/camera.png" alt="placeholder" />
                                <span>이미지를 업로드해주세요.</span>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
                <Divider />
                <Form.Item
                    name="category"
                    label={<div className="upload-label">카테고리</div>}
                    rules={[{ required: true, message: "카테고리를 선택해주세요" }]}
                >
                    <Select placeholder="카테고리를 선택해주세요" size="large">
                        {categories.map(category => (
                            <Option key={category.value} value={category.value}>
                                {category.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Divider />
                <Form.Item
                    label={<div className="upload-label">판매자 명</div>}
                    name="seller"
                    rules={[{ required: true, message: "판매자 이름을 입력해주세요" }]}
                >
                    <Input
                        className="upload-name"
                        size="large"
                        placeholder="이름을 입력해주세요"
                    />
                </Form.Item>
                <Divider />
                <Form.Item
                    name="name"
                    label={<div className="upload-label">상품 이름</div>}
                    rules={[{ required: true, message: "상품 이름을 입력해주세요" }]}
                >
                    <Input
                        className="upload-name"
                        size="large"
                        placeholder="상품 이름을 입력해주세요"
                    />
                </Form.Item>
                <Divider />
                <Form.Item
                    name="price"
                    label={<div className="upload-label">상품 가격</div>}
                    rules={[{ required: true, message: "상품 가격을 입력해주세요" }]}
                >
                    <InputNumber 
                        defaultValue={0} 
                        className="upload-price" 
                        size="large"
                        min={0}
                    />
                </Form.Item>
                <Divider />
                <Form.Item
                    name="quantity"
                    label={<div className="upload-label">재고 수량</div>}
                    rules={[{ required: true, message: "재고 수량을 입력해주세요" }]}
                >
                    <InputNumber 
                        defaultValue={1} 
                        className="upload-quantity" 
                        size="large"
                        min={1}
                        placeholder="재고 수량을 입력해주세요"
                    />
                </Form.Item>
                <Divider />
                <Form.Item
                    name="description"
                    label={<div className="upload-label">상품 소개</div>}
                    rules={[{ required: true, message: "상품 소개를 적어주세요" }]}
                >
                    <Input.TextArea
                        size="large"
                        id="product-description"
                        showCount
                        maxLength={300}
                        placeholder="상품 소개를 적어주세요."
                    />
                </Form.Item>
                <Divider />
                <Form.Item name="isBest" valuePropName="checked">
                    <Checkbox onChange={(e) => setIsBest(e.target.checked)}>
                        베스트 메뉴
                    </Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button id="submit-button" size="large" htmlType="submit">
                        상품 등록하기
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UploadPage;