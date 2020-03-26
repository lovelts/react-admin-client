/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import {
    Card,
    Icon,
    List
} from 'antd';
import memoryUtils from '../../utils/memoryUtils';
import { Redirect } from 'react-router-dom';
import { BASE_IMG } from '../../utils/constant';
import { reqCategory } from '../../api';

import './detail.less'

const Item = List.Item;
class ProductDetail extends Component {
    state = {
        categoryName: ''
    }
    getCategory = async (categoryId) => {
        const result = await reqCategory(categoryId);
        if (result.status === 0) {
            const categoryName = result.data.name;
            this.setState({ categoryName });
        }
    }
    componentDidMount() {
        const { categoryId } = memoryUtils.product;
        if (categoryId) {
            this.getCategory(categoryId);
        }
    }
    render() {
        const product = memoryUtils.product;
        if (!product._id) {
            return (
                <Redirect to='/product' />
            )
        }
        const title = (
            <span>
                <a href="" onClick={(e) => e.preventDefault()}>
                    <Icon type="arrow-left"

                        onClick={() => {
                            memoryUtils.product = {};
                            this.props.history.goBack();
                        }}
                    />
                </a>
                <span>  商品详情</span>
            </span>
        )
        if (!product.imgs) {
            product.imgs = [];
        }
        return (
            <Card title={title} className='detail'>
                <List>
                    <Item>
                        <span className='detail-left'>商品名称：</span>
                        <span> &nbsp;{product.name}</span>
                    </Item>
                    <Item>
                        <span className='detail-left'>商品描述：</span>
                        <span> &nbsp;{product.desc}</span>
                    </Item>
                    <Item>
                        <span className='detail-left'>商品价格：</span>
                        <span> &nbsp;{product.price}</span>
                    </Item>
                    <Item>
                        <span className='detail-left'>所属分类：</span>
                        <span> &nbsp;{this.state.categoryName}</span>
                    </Item>
                    <Item style={{ height: 150 }}>
                        <span className='detail-left' >商品图片</span>
                        <span>
                            {
                                product.imgs.map(img => <img key={img} src={BASE_IMG + img} alt="" className='detail-img' />)
                            }
                        </span>

                    </Item>
                    <Item>
                        <span className='detail-left'>所属分类：</span>
                        <div dangerouslySetInnerHTML={{ __html: product.detail }}></div>
                    </Item>
                </List>
            </Card>
        );
    }
}

export default ProductDetail;