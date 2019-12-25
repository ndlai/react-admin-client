import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import ProductHome from "./home";
import ProductDetail from "./detail";
import ProductAddupdate from "./addupdate";
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path="/product" exact component={ProductHome} />
        <Route path="/productc/detail" component={ProductDetail} />
        <Route path="/product/addupdate" component={ProductAddupdate} />
        <Redirect to="/product" />
        {/* 当匹配不到任何路由时，打开产品列表 */}
      </Switch>
    );
  }
}
