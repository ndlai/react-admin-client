import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import memoryUtils from "./utils/memoryUtils";
import storageUtils from "./utils/storageUtils";
memoryUtils.user = storageUtils.getUser(); //从local中读取用户信息存至内存中，如果有值则直接进到后台
ReactDOM.render(<App />, document.getElementById("root"));
