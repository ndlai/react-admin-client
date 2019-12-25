import React, { Component } from "react";
import { Layout } from "antd";
import { Redirect, Route, Switch } from "react-router-dom";
import Header from "../../components/header";
import LeftNav from "../../components/left-nav";
import memoryUtils from "../../utils/memoryUtils";
import Home from "../home/home";
import Category from "../category/category";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";

const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
  render() {
    const user = memoryUtils.user;
    if (!user || !user._id) {
      //自动跳转到登录页
      return <Redirect to="/login"></Redirect>;
    }
    return (
      <Layout style={{minHeight: "100%" }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ margin:15, backgroundColor: "#fff" }}>
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/category" component={Category} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/line" component={Line} />
              <Route path="/charts/pie" component={Pie} />
              <Route path="/product" component={Product} />
              <Route path="/role" component={Role} />
              <Route path="/user" component={User} />
              <Redirect to="/home" />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center", color: "#bbb" }}>
            2019 版权所有 React项目
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
