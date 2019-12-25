import React, { Component } from "react";
import { Form, Input } from "antd";
const Item = Form.Item;
class UpdateForm extends Component {
  componentWillMount(){
    //将from对象通过setUpdateForm传递给父组件
    this.props.setUpdateForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Item>
          {getFieldDecorator("name", {
            initialValue: this.props.curCategory.name,
            rules: [{ required: true, message: "请输入分类名称" }]
          })(<Input placeholder="请输入分类名称"></Input>)}
        </Item>
      </Form>
    );
  }
}
export default Form.create()(UpdateForm);
