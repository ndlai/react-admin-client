import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { formateDate } from "../../utils/dateUtils";
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from "../../api";
import UserForm from "./userForm";
export default class User extends Component {
  state = {
    users: [],
    isShow: false
  };
  initColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username"
      },
      {
        title: "邮箱",
        dataIndex: "email"
      },
      {
        title: "电话",
        dataIndex: "phone"
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: formateDate
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: role_id => this.roleName[role_id]
      },
      {
        title: "操作",
        render: record => (
          <span>
            <Button
              type="link"
              onClick={() => this.showAddOrUpdateUser(record)}
            >
              修改
            </Button>
            <Button type="link" onClick={() => this.deleteUser(record)}>
              删除
            </Button>
          </span>
        )
      }
    ];
  };
  showAddOrUpdateUser = record => {
    this.curUser = record;
    this.setState({
      isShow: true
    });
  };
  addOrUpdateUser = async () => {
    this.userForm.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          isShow: false
        });
        // 准备数据，从子组件中获取字段值
        const user = this.userForm.getFieldsValue();
        //清除最后一次输入的内容
        this.userForm.resetFields();
        //如果是编辑的，需要给user添加_id属性，只有有_id标识时才会执行更新操作
        if (this.curUser) {
          user._id = this.curUser._id;
        }
        const result = await reqAddOrUpdateUser(user);
        if (result.status === 0) {
          //重新请求列表数据，以显示修改后的内容
          message.success(`${this.curUser ? "修改" : "添加"}用户成功！`);
          this.getUsers();
        }
      }
    });
  };
  getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.initRoleName(roles);
      this.setState({
        users,
        roles
      });
    } else {
      message.error("请求分类列表失败");
    }
  };

  //删除用户
  deleteUser = user => {
    Modal.confirm({
      title: `确认删除${user.username}吗？`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success("删除成功！");
          this.getUsers();
        }
      }
    });
  };
  //根据roles生成kv对象，方便列表匹配到角色名称
  initRoleName = roles => {
    const roleName = roles.reduce((pre, item) => {
      pre[roles.id] = roles.name;
      return pre;
    }, {});
    this.roleName = roleName;
  };
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getUsers();
    this.initColumns();
  }
  render() {
    const { users, roles } = this.state;
    const title = (
      <Button type="primary" onClick={() => this.showAddOrUpdateUser({})}>
        创建用户
      </Button>
    );
    return (
      <Card title={title}>
        <Table
          rowKey="_id"
          bordered
          dataSource={users}
          columns={this.columns}
          pagination={{
            defaultPageSize: 5
          }}
        />
        <Modal
          title={this.curUser ? "修改用户" : "添加用户"}
          visible={this.state.isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.userForm.resetFields();
            this.setState({ isShow: false });
          }}
        >
          <UserForm
            setUserForm={from => {
              this.userForm = from;
            }}
            roles={roles}
            curUser={this.curUser}
          />
        </Modal>
      </Card>
    );
  }
}
