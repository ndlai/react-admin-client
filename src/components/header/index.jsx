import React, { Component } from "react";
import { formateDate } from "../../utils/dateUtils";
import { reqWeather } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { Modal, Button } from "antd";
import { withRouter } from "react-router-dom";
import menuConfig from "../../config/menuConfig";
import "./index.less";
class Header extends Component {
  constructor() {
    super();
    this.state = {
      currentTime: formateDate(Date.now()),
      temperature: "",
      weather: ""
    };
  }
  getTime = () => {
    this.setIntervalTime = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({
        currentTime
      });
    }, 1000);
  };

  getWeather = async () => {
    //把async写在函数的左边
    const { temperature, weather } = await reqWeather("北京"); //把await写在调用前，并解构出两个参数 temperature, weather
    //更新状态值
    this.setState({ temperature, weather });
  };

  getTitle = () => {
    const path = this.props.location.pathname;
    let title = "";
    menuConfig.forEach(item => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(
          cItem => path.indexOf(cItem.key) === 0
        );
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };
  //退出登录
  logout = () => {
    Modal.confirm({
      title: "确定退出登录吗？",
      content: "退出后将返回登录页",
      onOk: () => {
        memoryUtils.user = {};
        storageUtils.removeUser();
        this.props.history.replace("/login");
      }
    });
  };
  //组件第一次渲染完之后调用，一般可执行ajax、定时器等
  componentDidMount() {
    //获取时间
    this.getTime();

    //获取天气
    this.getWeather();
  }

  //组件销毁时关闭定时器，否则会报错
  componentWillUnmount() {
    clearInterval(this.setIntervalTime);
  }
  render() {
    const { currentTime, temperature, weather } = this.state;
    const userName = memoryUtils.user.username;
    const title = this.getTitle();
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{userName} </span>
          <Button type="link" onClick={this.logout}>
            退出
          </Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img
              src="http://s16.sinaimg.cn/orignal/001owXWugy6IkAdGFUr4f"
              alt="tq"
            />
            <span>
              {temperature} - {weather}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
