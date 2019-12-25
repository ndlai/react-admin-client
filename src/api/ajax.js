import axios from "axios";
import { message } from "antd";
export default function ajax(url, data = {}, type = "GET") {
  //写法一
  // if(type==='GET'){
  //     return axios.get(url,{
  //         params:data
  //     })
  // }else{
  //     return axios.post(url,data)
  // }

  //写法二：这种写法对应于login.jsx里的写法二，且可以不需要在所有接口中都添加try catch，统一在这里进行出错的提示
  return new Promise((resolve, reject) => {
    let promise;
    if (type === "GET") {
      promise = axios.get(url, {
        params: data
      });
    } else {
      promise = axios.post(url, data);
    }
    promise
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error("请求异常：" + error);
      });
  });
}
