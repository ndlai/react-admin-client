import React, { Component } from "react";
import { Form, Input } from "antd";
const Item = Form.Item;
class AddForm extends Component {
  componentWillMount() {
    //将from对象通过setUpdateForm传递给父组件
    this.props.setAddForm(this.props.form);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Item>
          {getFieldDecorator("name", {
            initialValue: "",
            rules: [{ required: true, message: "请输入角色名称" }]
          })(<Input placeholder="请输入角色名称"></Input>)}
        </Item>
      </Form>
    );
  }
}
export default Form.create()(AddForm);
