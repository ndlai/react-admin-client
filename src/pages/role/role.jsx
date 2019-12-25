import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { PAGE_SIZE } from "../../utils/constUtils";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import AddForm from "./addForm";
import AuthForm from "./authForm";
import memoryUtils from "../../utils/memoryUtils";
import { formateDate } from "../../utils/dateUtils";
export default class Role extends Component {
  state = {
    roles: [], //所有角色列表
    curRole: {}, //当前选中角色的对像
    isShowAdd: false, //是否显示添加窗口
    isShowAuth: false //是否显示设置角色权限窗口
  };
  constructor(props) {
    super(props);
    this.refAuth = React.createRef();
  }
  //初始化列
  initColumns = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name"
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: create_time => formateDate(create_time) //写法一
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate //写法二，因为render接收的是一个函数，所以可以直接放一个函数
      },
      {
        title: "授权人",
        dataIndex: "auth_name"
      }
    ];
  };

  //点击列，选中
  rowClick = curRole => {
    return {
      onClick: event => {
        this.setState({
          curRole
        });
      }
    };
  };

  //获取角色列表
  getRoles = async () => {
    const result = await reqRoles();
    console.log(result);

    if (result.status === 0) {
      const roles = result.data;
      this.setState({
        roles
      });
    }
  };

  //添加存储角色
  addRole = () => {
    this.addForm.validateFields(async (err, values) => {
      if (!err) {
        const { name } = values;
        //清除最后一次输入的内容
        this.addForm.resetFields();
        const result = await reqAddRole(name);
        console.log(result);

        if (result.status === 0) {
          const role = result.data;
          //重新请求列表数据，以显示修改后的内容
          message.success("添加成功！");

          //方法一，重新请求
          // this.getRoles();

          //方法二，更新状态，相当于用push在列表后面添加一个数组值，但推荐使用下面的方法，因为是保留原状态，只是追加一项数据。
          this.setState(state => ({
            roles: [...state.roles, role]
          }));
        } else {
          message.error("添加失败！");
        }
      }
    });
  };
  updateRole = async () => {
    const role = this.state.curRole;

    //得到最新的menus
    const menus = this.refAuth.current.getMenus();
    role.menus = menus;
    role.auth_name = memoryUtils.user.username;
    role.auth_time = Date.now();
    //请求更新
    const result = await reqUpdateRole(role);
    this.setState({
      isShowAuth: false
    });
    if (result.status === 0) {
      message.success("设置角色权限成功！");
      this.setState({
        roles: [...this.state.roles]
      });
    }
  };
  componentWillMount() {
    //列是固定的，不要放到render中，否则每次都会重新渲染
    this.initColumns();
  }
  componentDidMount() {
    this.getRoles();
  }
  render() {
    const { roles, curRole } = this.state;
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => {
            this.setState({
              isShowAdd: true
            });
          }}
        >
          添加角色
        </Button>
        <Button
          type="primary"
          disabled={!curRole._id}
          onClick={() => {
            this.setState({
              isShowAuth: true
            });
          }}
        >
          设置角色权限
        </Button>
      </span>
    );
    return (
      <Card title={title}>
        <Table
          rowKey="_id"
          bordered
          dataSource={roles}
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE
          }}
          onRow={this.rowClick}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [curRole._id],
            onSelect: curRole => {
              this.setState({
                curRole
              });
            }
          }}
        />

        <Modal
          title="添加角色"
          visible={this.state.isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({
              isShowAdd: false
            });
          }}
        >
          <AddForm
            setAddForm={from => {
              this.addForm = from;
            }}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={this.state.isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({
              isShowAuth: false
            });
          }}
        >
          <AuthForm ref={this.refAuth} role={curRole} />
        </Modal>
      </Card>
    );
  }
}
