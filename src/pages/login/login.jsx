import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./login.less";
import logo from "../../assets/images/logo.jpg";
import { Form, Icon, Input, Button, message } from "antd";
import { reqLogin } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
class Login extends Component {
  handleSubmit = e => {
    //点击提交按钮
    e.preventDefault(); //阻止提交表单

    //写法一：使用Promise的写法，带了then
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     //校验所有表单成功，提交ajax请求。values就是各个表单的对象值
    //     reqLogin(values)
    //       .then(response => {
    //         console.log(response.data);
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   } else {
    //     console.log("登录失败");
    //   }
    // });

    // 写法二：不用Promise，通过await写法
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        //校验所有表单成功，提交ajax请求。values就是各个表单的对象值
        const result = await reqLogin(values);

        if (result.status === 0) {
          message.success("登录成功");
          memoryUtils.user = result.data; //保存用户到内存中
          storageUtils.saveUser(result.data); //保存用户到local中
          //页面跳转，push是指从A进到B后，可以后退回B，但使用replace则不可以，这个地方适合用replace
          this.props.history.replace("/admin");
        } else {
          message.error("登录失败:" + result.msg);
        }
      } else {
        console.log("登录失败");
      }
    });
  };

  render() {
    const user = memoryUtils.user;
    if (user && user._id) {
      return <Redirect to="/admin" />;
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React-后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <div>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                {getFieldDecorator("username", {
                  rules: [
                    { required: true, message: "用户名必须输入" },
                    { min: 4, message: "用户名不能少于4位" },
                    { max: 12, message: "用户名不能超过12位" },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message: "用户名由字母数字下划线组成"
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="用户名"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("password")(
                  <Input
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    type="password"
                    placeholder="密码"
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
    );
  }
}
//使用高阶组件Form提供的create方法包装Login组件，返回一个包装后的新组件，这个组件可传递一个具各种验证功能的form对象
export default Form.create()(Login);
