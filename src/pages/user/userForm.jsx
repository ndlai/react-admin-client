import React, { Component } from "react";
import { Form, Input, Select } from "antd";
const Option = Select.Option;
const Item = Form.Item;
class UserForm extends Component {
  componentWillMount() {
    //将from对象通过setUpdateForm传递给父组件
    this.props.setUserForm(this.props.form);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { roles } = this.props;
    const { curUser } = this.props;
    return (
      <Form>
        <Item>
          {getFieldDecorator("username", {
            initialValue: curUser.username,
            rules: [{ required: true, message: "请输入用户名" }]
          })(<Input placeholder="请输入用户名"></Input>)}
        </Item>
        {curUser._id ? null : (
          <Item>
            {getFieldDecorator("password", {
              initialValue: "",
              rules: [{ required: true, message: "请输入密码" }]
            })(<Input type="password" placeholder="请输入密码"></Input>)}
          </Item>
        )}

        <Item>
          {getFieldDecorator("phone", {
            initialValue: curUser.phone,
            rules: [{ required: true, message: "请输入手机号" }]
          })(<Input placeholder="请输入手机号"></Input>)}
        </Item>
        <Item>
          {getFieldDecorator("email", {
            initialValue: curUser.email,
            rules: [{ required: true, message: "请输入邮箱" }]
          })(<Input placeholder="请输入邮箱"></Input>)}
        </Item>
        <Item>
          {getFieldDecorator("role_id", {
            initialValue: curUser.role_id,
            rules: [{ required: true, message: "请选择角色" }]
          })(
            <Select>
              {roles.map(item => (
                <Option value={item._id} key={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </Item>
      </Form>
    );
  }
}
export default Form.create()(UserForm);
