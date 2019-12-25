import React, { Component } from "react";
import { Form, Input, Tree } from "antd";
import menuList from "../../config/menuConfig.js";
const Item = Form.Item;
const { TreeNode } = Tree;
export default class AuthForm extends Component {
  constructor(props) {
    super(props);
    const { menus } = this.props.role;
    console.log(222);
    console.log(this.props.role);

    this.state = {
      checkedKeys: menus
    };
  }
  getTreeNodes = menuList => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {/* 如果有子项，则再次调用getTreeNodes */}
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      );
      return pre;
    }, []);
  };

  getMenus = () => {
    return this.state.checkedKeys;
  };
  //勾选权限时更新已勾选项
  onCheck = checkedKeys => {
    this.setState({
      checkedKeys
    });
  };
  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList);

    console.log(this.treeNodes);
  }
  //当组件接收到新的参数变化时，调用此方法。对于这里选择了别的角色时则role对象会变化.首次打开组件时不会调用。
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus;
    this.setState({
      checkedKeys: menus //更新菜单项，否则权限项不会有变化
    });
  }
  render() {
    const { role } = this.props;
    const { checkedKeys } = this.state;
    console.log(111);
    console.log(checkedKeys);
    const formItemLaout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 }
    };
    return (
      <Form {...formItemLaout}>
        <Item label="角色名称">
          <Input value={role.name} disabled></Input>
        </Item>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="权限选择" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </Form>
    );
  }
}
