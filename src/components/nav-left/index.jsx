/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'

import './index.less'
import logo from '../../assets/images/logo.png'
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils';

const { SubMenu } = Menu;
class LeftNav extends Component {
    hasAuth = (item) => {
        const user = memoryUtils.user;
        const { menus } = user.role;
        if (user.username === 'admin' || item.public || menus.indexOf(item.key) !== -1) {
            return true
        } else if (item.children) {
            const cItem = item.children.find(cItem => menus.indexOf(cItem.key) !== -1);
            return !!cItem

        }
        return false
    }
    getMenuNodes = (menuList) => {
        return menuList.map(item => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    return (
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }

                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }

        })
    }
    openKeys = (menuList) => {
        const path = this.props.location.pathname;
        for (let item = 0; item < menuList.length; item++) {
            if (menuList[item].children) {
                const cItem = menuList[item].children.find(cItem => path.indexOf(cItem.key) === 0);
                if (cItem) {
                    return menuList[item].key
                }
            }
        }
        return path;
    }
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList);
    }
    render() {
        let path = this.props.location.pathname;
        if (path.indexOf('/product') === 0) {
            path = '/product';
        }
        const pathKey = this.openKeys(menuList);
        return (
            <div className='left-nav'>
                <Link className="left-nav-link" to='/home'>
                    <img src={logo} alt="" />
                    <h1>天天后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[pathKey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.menuNodes
                    }

                </Menu>
            </div>
        );
    }
}


export default withRouter(LeftNav);