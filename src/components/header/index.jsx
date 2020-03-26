/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Modal } from 'antd'
import { withRouter } from 'react-router-dom'
import './index.less'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils';
import menuList from '../../config/menuConfig';
import { formateDate } from '../../utils/dateUtils';
import { reqWeather } from '../../api';


class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: ''
    }
    logout = (e) => {
        e.preventDefault();
        Modal.confirm({
            title: '确认退出吗?',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                console.log('确定');
                storageUtils.removeUser();
                memoryUtils.user = {};
                this.props.history.replace('/login');

            },
            onCancel() {
                console.log('取消');
            },
        })
    }
    getTitle = () => {
        let title = '';
        const path = this.props.location.pathname;
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title;
            } else if (item.children) {
                const cItem = item.children.find(cItem =>path.indexOf(cItem.key)  === 0)
                if (cItem) {
                    title = cItem.title;
                }
            }
        })
        return title
    }
    getWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather('安阳');
        this.setState({
            dayPictureUrl,
            weather
        });
    }
    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState({
                currentTime: formateDate(Date.now())
            })
        }, 1000);
        this.getWeather();
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
    render() {
        const user = memoryUtils.user;
        const title = this.getTitle();
        const { currentTime } = this.state;
        return (
            <div className="header">
                <div className="header-top">
                    欢迎，{user.username} &nbsp;&nbsp;
                    <a onClick={this.logout}>退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={this.state.dayPictureUrl} alt="" />
                        <span>{this.state.weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);