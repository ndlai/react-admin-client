import React, { Component } from "react";
import { Upload, Icon, Modal, message } from "antd";
import { reqDeleteImg } from "../../api";
import { BASE_IMG_URL } from "../../utils/constUtils";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class UploadPicture extends Component {
  constructor(props) {
    super(props);
    const { imgs } = this.props;
    let fileList = [];
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((item, index) => ({
        uid: -index,
        name: item,
        status: "done",
        url: BASE_IMG_URL + item
      }));
    }
    this.state = {
      previewVisible: false,
      previewImage: "",
      fileList
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };

  handleChange = async ({ file, fileList }) => {
    console.log(file);
    if (file.status === "done") {
      if (file.response.status === 0) {
        message.success("上传成功");
      } else {
        message.success("上传失败");
      }
    } else if (file.status === "removed") {
      console.log(file.name);
      const result = await reqDeleteImg(file.response.data.name);
      if (result.status === 0) {
        message.success("删除成功");
      } else {
        message.success("删除失败");
      }
    }

    this.setState({ fileList }, () => {
      console.log(this.state.fileList);
    });
  };
  //获取已上传图片的文件名，用于存到分类的表中，这个方法是给父组件调用的
  getUploadImgs = () => {
    return this.state.fileList.map(item => item.response.data.name);
  };
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          accept="image/*" //只接收图片格式
          name="image" //后台接口的参数名称
          fileList={fileList} //已上传图片的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
