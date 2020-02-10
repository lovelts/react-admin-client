/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import {
    Card,
    Button,
    Icon,
    Table,
    message,
    Modal,

} from 'antd'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import AddUpdateForm from './add-update-form';


class Category extends Component {
    state = {
        categorys: [],
        loading: false,//是否正在加载中
        showStatus: 0,//0不显示，1显示添加，2显示修改

    }
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => <a onClick={() => {
                    this.setState({ showStatus: 2 });
                    this.category = category;
                }}>修改分类</a>,
            },
        ];
    }
    componentWillMount() {
        this.initColumns();
    }
    getCategorys = async () => {
        this.setState({ loading: true });
        const reslut = await reqCategorys();
        const categorys = reslut.data;
        this.setState({ loading: false });
        if (reslut.status === 0) {
            this.setState({ categorys });
        } else {
            message.error('获取数据失败了');
        }
    }
    handleOk = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const { categoryName } = values;
                let result;
                if (this.state.showStatus === 1) {
                    result = await reqAddCategory(categoryName);

                } else {
                    const categoryId = this.category._id;
                    result = await reqUpdateCategory({ categoryName, categoryId });
                }
                this.setState({ showStatus: 0 });//隐藏
                this.form.resetFields();//重置默认值
                // console.log(this.form.resetFields())
                const action = this.state.showStatus === 1 ? '添加' : '修改';
                if (result.status === 0) {
                    this.getCategorys();
                    message.success(action + '商品成功');
                } else {
                    message.error(action + '分类失败');
                }
            }
        });
    }
    handleCancel = () => {
        this.form.resetFields();
        this.setState({
            showStatus: 0
        })
    }
    componentDidMount() {
        this.getCategorys();
    }
    render() {
        const { categorys } = this.state;
        const category = this.category || {};
        const extra = (
            <Button type='primary' onClick={() => {
                 this.category = {};
                 this.setState({ showStatus: 1 }) 
                 }}>
                <Icon type='plus' />
                添加
            </Button>
        )
        return (
            <Card extra={extra} >
                <Table
                    columns={this.columns}
                    dataSource={categorys}
                    bordered
                    loading={this.state.loading}
                    rowKey='_id'
                    pagination={{ defaultPageSize: 6, showQuickJumper: true }}
                />
                <Modal
                    title={this.state.showStatus === 1 ? "添加分类" : "修改分类"}
                    visible={this.state.showStatus !== 0}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText='确认'
                    cancelText='取消'
                >
                    <AddUpdateForm setForm={form => this.form = form} categoryName={category.name} />
                </Modal>
            </Card>
        );
    }
}

export default Category;