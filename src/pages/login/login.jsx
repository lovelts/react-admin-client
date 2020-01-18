import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import {message} from 'antd'
import {Redirect} from 'react-router-dom'

import logo from '../../assets/images/logo.png'
import './login.less'
import {reqLogin} from '../../api'
import storageUtils from '../../utils/storageUtils' 
import memoryUtils from '../../utils/memoryUtils'


export class Login extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, {username,password}) => {
            // 检验成功
            if (!err) {
               const result = await reqLogin(username,password);
               if(result.status === 0){
                    const user = result.data; 
                    storageUtils.saveUser(user);
                    memoryUtils.user = user;//第二种获取值的方式
                    this.props.history.replace('/');
                    message.success("登录成功");
               }else{
                    message.error("用户名或密码错误"+result.msg);
               }
            } else {
              console.log('检验失败!')
            }
          });
      
    };
    validatorPwd = (rule, value, callback) => {
        value = value.trim();
        if(this.props.form.getFieldValue('username')){
        if (!value) {
            callback('密码必须输入');
        } else if (value.length < 6) {
            callback('密码必须大于6位');
        } else if (value.length > 16) {
            callback('密码必须小于16位');
        } else if (!/^[A-z0-9_]+$/.test(value)) {
            callback('用户名必须不能含有特殊字符（下划线除外）')
        } else {
            callback();
        }
    }
    else{
        callback('请输入用户名');
    }

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const user = memoryUtils.user;
        if(user._id){
           return <Redirect to='/'/>
        }
        return (

            <div className="login">
                <div className="login-header">
                    <img src={logo} alt="" />
                    <h1>React: 后台管理项目</h1>
                </div>
                <div className="login-content">
                    <h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                getFieldDecorator('username', {
                                    initialValue: '',
                                    rules: [
                                        { required: true, whitespace: true, message: '用户名是必须的' },
                                        { min: 4, message: '用户名必须大于4位' },
                                        { max: 14, message: '用户名必须小于14位' },
                                        { pattern: /^[A-z0-9_]+$/, message: '用户名必须不能含有特殊字符（下划线除外）' }
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名"
                                    />

                                )
                            }

                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        { required: true, whitespace: true, message: '密码是必须的' },

                                        {
                                            validator: this.validatePwd
                                        }
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录 </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
const WrapperForm = Form.create()(Login)

export default WrapperForm
