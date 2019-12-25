import React, { Component } from "react";
import { Form, Input, Select } from "antd";
const Item = Form.Item;
const Option = Select.Option;
class AddForm extends Component {
  componentWillMount(){
    //将from对象通过setUpdateForm传递给父组件
    this.props.setAddForm(this.props.form)
  }
  render() {
    const { parentId, categorys } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Item>
          {getFieldDecorator("parentId", {
            initialValue: parentId //默认选中第一项
          })(
            <Select>
              <Option value="0">一级分类</Option>
              {categorys.map(item => (
                <Option key={item._id} value={item._id}>{item.name}</Option>
              ))}
            </Select>
          )}
        </Item>
        <Item>
          {getFieldDecorator("name", {
            initialValue: "",
            rules: [{ required: true, message: "请输入分类名称" }]
          })(<Input placeholder="请输入分类名称"></Input>)}
        </Item>
      </Form>
    );
  }
}
export default Form.create()(AddForm);
