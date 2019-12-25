import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";
import "./index.less";
import logo from "../../assets/images/logo.jpg";
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
const { SubMenu } = Menu;
class LeftNav extends Component {
  //判断是否有菜单权限
  isAuthMenu = item => {
    const { key, isPublic } = item;
    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;
    //如果是admin或菜单项是公开的或有权限时，返回true
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      //强制转换成布尔值
      return !!item.children.find(
        itemChild => menus.indexOf(itemChild.key) !== -1
      );
    }
    return false;
  };

  getMenuList = menuList => {
    return menuList.reduce((pre, item) => {
      if (this.isAuthMenu(item)) {
        if (!item.children) {
          pre.push(
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          if (
            item.children.find(
              cItem => cItem.key === this.props.location.pathname
            )
          ) {
            this.openKey = item.key;
          }
          pre.push(
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuList(item.children)}
            </SubMenu>
          );
        }
      }
      return pre;
    }, []);
  };

  componentWillMount() {
    this.menuNode = this.getMenuList(menuList);
  }
  render() {
    //获取当前的路由路径，需借助withRouter的包装，见最下部
    const path = this.props.location.pathname;
    return (
      <div className="left-nav">
        <Link to="/admin" className="left-nav-header">
          <img src={logo} alt="logo" />
          <span>React项目</span>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[this.openKey]}
          mode="inline"
          theme="dark"
        >
          {this.menuNode}
        </Menu>
      </div>
    );
  }
}
//withRouter是高阶组件，用来包装非路由组件，然后传递3个属性：history/location/match
export default withRouter(LeftNav);
