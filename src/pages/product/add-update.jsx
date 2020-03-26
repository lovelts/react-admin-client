/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import {
    Card,
    Icon,
    Form,
    Input,
    Select,
    Button,
    message,
} from 'antd';

import { reqCategorys, reqAddUpdateProduct } from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import PicturesWall from './picturesWall ';
import RichTextEditor from './rich-text-editor';

const { Option } = Select;
class ProductAddUpdate extends Component {
    constructor(props){
        super(props);
        this.pwRef = React.createRef();
        this.editorRef = React.createRef();
    }
    state = {
        categorys: [],
    }
    getCategorys = async (categoryId) => {
        const result = await reqCategorys();
        if (result.status === 0) {
            const categorys = result.data;
            this.setState({ categorys });
        }
    }
    validatorPrice = (rule, value, callback) => {
        if (value === '') {
            callback();
        } else if (value < 0) {
            callback('价格不能小于0');
        } else {
            callback();
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            // 检验成功
            if (!err) {
                const { name, desc, price, categoryId } = values;
                // console.log(name, desc, price, categoryId);

                const imgs = this.pwRef.current.getImgs();
                const detail = this.editorRef.current.getDetail();

                const product = {name,desc,price,categoryId,imgs,detail};
                if(this.isUpdate){
                    product._id = this.product._id;
                }
                const result = await  reqAddUpdateProduct(product);
                console.log(result)
                if(result.status === 0){
                    message.success(`${this.isUpdate ? '修改':'添加'}商品成功`);
                    this.props.history.replace('/product');
                }else{
                    message.error('失败');
                }

            }
        });
        memoryUtils.product = {};
    }
    componentWillMount() {
        this.product = memoryUtils.product;
        // console.log( this.product)
        this.isUpdate = this.product._id ? true : false;
    }
    componentDidMount() {
        this.getCategorys();
    }

    render() {
        const {product,isUpdate} = this;
        const { categorys } = this.state;
        const { getFieldDecorator } = this.props.form;
        const title = (
            <span>
                <a href="" onClick={(e) => e.preventDefault()}>
                    <Icon type="arrow-left"
                    
                        onClick={() =>{ 
                            memoryUtils.product = {};
                            this.props.history.goBack()
                        }}
                    />
                </a>
                <span>&nbsp; {isUpdate? '修改商品':'添加商品'}</span>
            </span>
        )

        const formLayout = {
            labelCol: { span: 2, offset: 0 },
            wrapperCol: { span: 6, offset: 0 }
        }
        return (

            <Card title={title} className='detail'>
                <Form {...formLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="商品名称">
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [{ required: true, message: '必须输入商品名称' }],
                        })(<Input placeholder='请输入商品名称' />)}
                    </Form.Item>
                    <Form.Item label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [{ required: true, message: '必须输入商品描述' }],
                        })(<Input placeholder='请输入商品描述' />)}
                    </Form.Item>
                    <Form.Item label="商品价格">
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                { required: true, message: '必须输入商品价格' },
                                { validator: this.validatorPrice }
                            ],
                        })(<Input type="number" placeholder='请输入商品价格' addonAfter="元" />)}
                    </Form.Item>
                    <Form.Item label="商品分类">
                        {getFieldDecorator('categoryId', {
                            initialValue: product.categoryId||'',
                            rules: [{ required: true, message: '必须输入商品分类' }],
                        })(
                            <Select>
                                <Option value=''>未选择</Option>
                                {
                                    categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="商品图片"  wrapperCol={ {span: 8, offset: 0} }>
                          <PicturesWall ref={this.pwRef} imgs = {product.imgs}/>
                    </Form.Item>
                    <Form.Item label="商品详情" wrapperCol= {{span:13}}>
                        <RichTextEditor ref={this.editorRef} detail = {product.detail}/>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 12, offset: 1 }}>
                        <Button type='primary' htmlType='submit'>提交</Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(ProductAddUpdate);