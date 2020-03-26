/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd';
import { reqProducts, reqSearchProducts, reqUpdateProductsStatus } from '../../api';
import { PAGE_SIZE } from '../../utils/constant'
import memoryUtils from '../../utils/memoryUtils';

const Option = Select.Option;
class ProductHome extends Component {
    state = {
        loading: true,
        products: [
            // {
            //     name: 1,
            //     desc: 2,
            //     price: 3,
            //     status: 1,
            //     _id: 2

            // }
        ],
        total: 0,
        searchType: 'productName',
        searchName: ''
    }
    updateProductsStatus = async (productId, status) => {
        status = status === 1 ? 2 : 1;
        const result = await reqUpdateProductsStatus(productId, status);
        if (result.status === 0) {
            message.success('更新商品状态成功');
            this.getProducts(this.pageNum);
        }
    }
    //这个column列头 数据是list中的数据
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                width: 100,
                render: ({ _id, status }) => {
                    // console.log(_id);
                    let btnText = '下架';
                    let text = '在售';
                    if (status === 2) {
                        btnText = '上架';
                        text = '已下架';
                    }
                    return (
                        <span>
                            <Button type='primary'
                                onClick={() => { this.updateProductsStatus(_id, status) }}
                            >
                                {btnText}
                            </Button>
                            <br />
                            <span>{text}</span>
                        </span>
                    )

                }

            },
            {
                title: '操作',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            <a hrf="" onClick={(e) => {
                                e.preventDefault();
                                memoryUtils.product = product;
                                this.props.history.push('/product/detail/'+product._id);
                            }}>详情</a>
                            <br />
                            <a href="" onClick={(e) => {
                                e.preventDefault();
                                memoryUtils.product = product;
                                this.props.history.push('/product/addupdate');
                            }}>修改</a>
                        </span>
                    )
                }
            },
        ];
    }
    //一部获取商品列表（页码）
    getProducts = async (pageNum) => {
        this.pageNum = pageNum;
        const { searchName, searchType } = this.state;
        let result;
        if (!searchName) {
            result = await reqProducts({ pageNum, pageSize: PAGE_SIZE });

        } else {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
            console.log(result)
        }
        this.state.loading = false;
        if (result.status === 0) {
            const { total, list } = result.data;
            this.setState({
                products: list,
                total
            })
        }
    }
    componentWillMount() {
        memoryUtils.product = {};
        this.initColumns();
    }
    componentDidMount() {
        //获取第一页显示
        this.getProducts(1);
    }
    render() {
        const { loading, products, total, searchName, searchType } = this.state;
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={(value) => { this.setState({ searchType: value }) }}
                >
                    <Option value='productName'>按名字搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    style={{ width: 200, margin: '0 10px' }}
                    placeholder='关键字' value={searchName}
                    onChange={(event) => { this.setState({ searchName: event.target.value }) }}

                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type='plus' />
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered={true}
                    rowKey='_id'
                    loading={loading}
                    columns={this.columns}
                    dataSource={products}
                    pagination={{
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts,
                        current: this.pageNum
                    }}
                />
            </Card>
        );
    }
}

export default ProductHome;