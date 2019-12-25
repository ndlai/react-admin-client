import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";
//登录
export const reqLogin = user => ajax("/login", user, "POST");

//显示一级、二级分类
//基于前台的分页，一次性请求所有数据（针对数据量较小的时候适用）
export const reqCategorys = parentId =>
  ajax("/manage/category/list", { parentId });
//增加分类
export const reqAddCategory = (categoryName, parentId) =>
  ajax("/manage/category/add", { categoryName, parentId }, "POST");
//更新分类 这种写法是直接解构{categoryName,parentId}
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax("/manage/category/update", { categoryId, categoryName }, "POST");

//获取产品列表
//基于后台的真正分页
export const reqProduct = (pageNum, pageSize) =>
  ajax("/manage/product/list", { pageNum, pageSize });

//删除图片
export const reqDeleteImg = name =>
  ajax("/manage/img/delete", { name }, "POST");

//新增和更新产品
export const reqAddOrUpdateProduct = product =>
  ajax("/manage/product/" + (product._id ? "update" : "add"), product, "POST");

//获取角色列表
export const reqRoles = () => ajax("/manage/role/list");

//新增角色
export const reqAddRole = roleName =>
  ajax("/manage/role/add", { roleName }, "POST");

//更新角色
export const reqUpdateRole = role => ajax("/manage/role/update", role, "POST");

//获取用户列表
export const reqUsers = () => ajax("/manage/user/list");
//删除用户
export const reqDeleteUser = userId =>
  ajax("/manage/user/delete", { userId }, "POST");
//新增用户
export const reqAddOrUpdateUser = user =>
  ajax("/manage/user/" + (user._id ? "update" : "add"), user, "POST");
//获取天气信息
export const reqWeather = city => {
  return new Promise((resolve, reject) => {
    //包装成Promise对象 - 这是第一行
    const url = `http://v.juhe.cn/weather/index?cityname=${city}&dtype=json&format=1&key=c9177bf03121b5ee3ce268821cbc1bc4`;
    jsonp(url, {}, (err, data) => {
      if (!err && data.reason === "successed!") {
        console.log(data.result.today);
        const { temperature, weather } = data.result.today;
        resolve({ temperature, weather }); //成功后要返回的值放到resolve中 - 这是第二行
      } else {
        message.error("请求天气预报失败");
      }
    });
  });
};
