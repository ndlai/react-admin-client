import React, { Component } from "react";
import { Card, Button, Table, message, Icon, Modal } from "antd";
import { reqCategorys, reqUpdateCategory, reqAddCategory } from "../../api";
import AddForm from "./addForm";
import UpdateForm from "./updateForm";
export default class Category extends Component {
  // 获取列表数据
  state = {
    categorys: [],
    isLoading: true,
    parentId: "0",
    parentName: "", //二级分类名称
    subCategorys: [], //二级分类数据
    showState: 0
  };
  getCategorys = async () => {
    const parentId = this.state.parentId;
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      console.log(categorys);

      if (parentId === "0") {
        this.setState({
          categorys
        });
      } else {
        this.setState({
          subCategorys: categorys
        });
      }
    } else {
      message.error("请求分类列表失败");
    }
    this.setState({
      isLoading: false
    });
  };

  //显示一级分类的二级分类数据
  showSubCategorys = record => {
    this.setState(
      {
        parentId: record._id,
        parentName: record.name
      },
      () => {
        this.getCategorys();
      }
    );
  };
  showMainCategorys = () => {
    this.setState(
      {
        parentId: "0",
        parentName: "",
        subCategorys: []
      },
      () => {
        this.getCategorys();
      }
    );
  };
  //初始化列
  initColumns = () => {
    this.columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "操作",
        width: 300,
        render: record => (
          <span>
            <Button type="link" onClick={this.showUpdate.bind(this, record)}>
              修改分类
            </Button>
            {this.state.parentId === "0" ? (
              <Button type="link" onClick={() => this.showSubCategorys(record)}>
                查看下级分类
              </Button>
            ) : null}
          </span>
        )
      }
    ];
  };

  //显示添加窗口
  showAdd = () => {
    //清除最后一次输入的内容
    this.setState({
      showState: 1
    });
  };
  //显示更新窗口
  showUpdate = record => {
    this.curUpdateCategory = record; //保存当前待更新的对象
    this.setState({
      showState: 2
    });
  };
  //添加分类
  addCategory = async () => {
    this.addForm.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          showState: 0
        });
        // 准备数据，从子组件中获取字段值
        const parentId = this.addForm.getFieldValue("parentId");
        const categoryName = this.addForm.getFieldValue("name");
        //清除最后一次输入的内容
        this.addForm.resetFields();
        const result = await reqAddCategory(categoryName, parentId);
        if (result.status === 0) {
          //重新请求列表数据，以显示修改后的内容
          this.getCategorys();
        }
      }
    });
  };
  //更新分类
  updateCategory = () => {
    this.updateForm.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          showState: 0
        });
        // 准备数据，包括id和name
        const categoryId = this.curUpdateCategory._id;

        //写法一
        // const categoryName = this.updateForm.getFieldValue("name");
        //写法二，用了validateFields后，可能直接在values中获取值
        const categoryName = values.name;

        //清除最后一次输入的内容

        this.updateForm.resetFields();
        const result = await reqUpdateCategory({ categoryId, categoryName });
        if (result.status === 0) {
          //重新请求列表数据，以显示修改后的内容
          this.getCategorys();
        }
      }
    });
  };
  //取消
  handleCancel = () => {
    this.setState({
      showState: 0
    });
  };

  componentWillMount() {
    //列是固定的，不要放到render中，否则每次都会重新渲染
    this.initColumns();
  }
  componentDidMount() {
    this.getCategorys();
  }
  render() {
    const {
      parentId,
      parentName,
      categorys,
      subCategorys,
      isLoading
    } = this.state;
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <Button type="link" onClick={this.showMainCategorys}>
            一级分类列表
          </Button>
          <Icon type="arrow-right" style={{ marginRight: 5 }}></Icon>
          <span>{parentName}</span>
        </span>
      );
    return (
      <div>
        <Card
          title={title}
          extra={
            <Button
              type="primary"
              icon="plus"
              size="small"
              onClick={this.showAdd}
            >
              添加
            </Button>
          }
        >
          <Table
            rowKey="_id"
            bordered
            dataSource={parentId === "0" ? categorys : subCategorys}
            columns={this.columns}
            loading={isLoading}
            pagination={{
              defaultPageSize: 5,
              hideOnSinglePage: true,
              showQuickJumper: true
            }}
          />
        </Card>

        <Modal
          title="添加分类"
          visible={this.state.showState === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            parentId={parentId}
            categorys={categorys}
            setAddForm={from => {
              this.addForm = from;
            }}
          />
        </Modal>
        <Modal
          title="更新分类"
          visible={this.state.showState === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            curCategory={this.curUpdateCategory}
            setUpdateForm={from => {
              this.updateForm = from;
            }}
          />
        </Modal>
      </div>
    );
  }
}
