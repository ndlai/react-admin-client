import React, { Component } from "react";
import { Card, Select, Input, Button, Icon, Table } from "antd";
import { reqProduct } from "../../api";
import { PAGE_SIZE } from "../../utils/constUtils";
const Option = Select.Option;
export default class ProductHome extends Component {
  constructor() {
    super();
    this.state = {
      total: 0,
      isLoading: false,
      products: [
        //   {
        //     status: 1,
        //     _id: "21324324324fdsfsd",
        //     name: "联想华为电脑好啊",
        //     desc: "详情来的，年度买的最好",
        //     price: 9009,
        //     pCategoryId: "111",
        //     categoryId: "2222",
        //     detail: "<span>这是详情</span>"
        //   }
      ]
    };
  }

  initColumn = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name"
      },
      {
        title: "商品描述",
        dataIndex: "desc"
      },
      {
        title: "价格",

        dataIndex: "price",
        render: price => "$ " + price
      },
      {
        title: "状态",
        width: 100,
        render: status => {
          return (
            <span>
              <Button type="primary">下架</Button>
              <span>在售</span>
            </span>
          );
        }
      },
      {
        title: "操作",
        width: 100,
        render: product => {
          return (
            <span>
              <Button type="link">详情</Button>
              <Button
                type="link"
                onClick={() => {
                  this.props.history.push("/product/addupdate", product);
                }}
              >
                修改
              </Button>
            </span>
          );
        }
      }
    ];
  };

  getProducts = async pageNum => {
    this.setState({
      isLoading: true //显示载入中
    });
    const result = await reqProduct(pageNum, PAGE_SIZE);
    this.setState({
      isLoading: false //隐藏载入中
    });
    if (result.status === 0) {
      const { total, list } = result.data;
      this.setState({
        total,
        products: list
      });
    }
  };
  componentWillMount() {
    this.initColumn();
  }
  componentDidMount() {
    this.getProducts(1);
  }
  render() {
    const { total, products, isLoading } = this.state;

    const title = (
      <span>
        <Select value="1" style={{ width: 150 }}>
          <Option value="1">按名称搜索</Option>
          <Option value="2">按描述搜索</Option>
        </Select>
        <Input
          placeholder="请输入关键字"
          style={{ width: 150, margin: "0 15px" }}
        ></Input>
        <Button type="primary">搜索</Button>
      </span>
    );
    const extra = (
      <span>
        <Button
          type="primary"
          onClick={() => this.props.history.push("/product/addupdate")}
        >
          <Icon type="plus"></Icon>
          添加商品
        </Button>
      </span>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey="_id"
          bordered
          loading={isLoading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.getProducts
            // 等于同onChange:(pageNum)=>this.getProducts(pageNum)，可以写成上面那样是因为onChange传过来的实参刚好是getProducts需要接收的参数
          }}
        />
        ;
      </Card>
    );
  }
}
