import React, { Component } from "react";
import { Card, Button, Input, Form, Icon, Cascader, message } from "antd";
import { reqCategorys, reqAddOrUpdateProduct } from "../../api";
import Uploadpicture from "./uploadpicture";
import RichText from "./richtext";
const { Item } = Form;
const { TextArea } = Input;
class ProductAddupdate extends Component {
  constructor() {
    super();
    //React.createRef()创建的是容器对象，把这个容器对象保存到this.refUpload中，这时添加了ref属性的div或组件会自动将相关的实例塞到这个容器中，于是就可以访问到相关的实例了。
    this.refUpload = React.createRef();
    this.refDetail = React.createRef();
  }
  state = {
    options: [] //商品分类数据
  };
  //初始化列表
  initOptions = async categorys => {
    const options = categorys.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false
    }));

    //如果是更新操作需要渲染二级分类
    const { isUpdate, editProduct } = this;
    const { pCategoryId, categoryId } = editProduct;
    if (isUpdate) {
      //更新页面过来的
      if (pCategoryId === "0") {
        //只选择了一级分类
      } else {
        //选择了二级分类
        const subCategory = await this.getCategorys(pCategoryId);
        const subOption = subCategory.map(item => ({
          value: item._id,
          label: item.name,
          isLeaf: true
        }));
        //找到一级的target
        
        const targetOption = options.find(item => item.value === pCategoryId);
        //为一级分类添加children
        targetOption.children = subOption;
      }
    }

    this.setState({
      options
    });
  };
  //获取分类列表
  getCategorys = async parentId => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      if (parentId === "0") {
        //首次载入时
        this.initOptions(result.data);
      } else {
        return result.data;
      }
    }
  };

  loadData = async selectedOptions => {
    console.log(selectedOptions);

    const targetOption = selectedOptions[0];
    targetOption.loading = true; //显示载入中图标

    const childCategorys = await this.getCategorys(targetOption.value);
    targetOption.loading = false;
    if (childCategorys && childCategorys.length > 0) {
      const subCategoryList = childCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }));
      targetOption.children = subCategoryList;
    } else {
      targetOption.isLeaf = true;
    }
    this.setState({
      options: [...this.state.options]
    });
  };

  submit = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        console.log(values);

        //1.收集数据
        const { name, desc, price, categoryIds } = values;
        let pCategoryId, categoryId;
        if (categoryIds.length === 1) {
          //只有一级分类
          pCategoryId = "0";
          categoryId = categoryIds[0];
        } else {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        const imgs = this.refUpload.current.getUploadImgs();
        const detail = this.refDetail.current.getDetail();
        //生成传入接口的参数对象
        const productParam = {
          name,
          desc,
          price,
          pCategoryId,
          categoryId,
          imgs,
          detail
        };
        if (this.isUpdate) {
          //如果是更新，给参数添加_id属性
          productParam._id = this.editProduct._id;
        }
        //2.发送请求
        const result = await reqAddOrUpdateProduct(productParam);
        if (result.status === 0) {
          message.success(`${this.isUpdate ? "更新" : "添加"}商品成功！`);
          this.props.history.goBack();
        } else {
          message.error(`${this.isUpdate ? "更新" : "添加"}商品失败！`);
        }
        // reqAddOrUpdateProduct()
      }
    });
  };
  componentWillMount() {
    const updateProduct = this.props.location.state;
    //保存是否是点击修改过来的
    this.isUpdate = !!updateProduct;
    this.editProduct = this.product || {};
  }
  componentDidMount() {
    this.getCategorys("0");
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 11 }
    };
    const { isUpdate, editProduct } = this;
    const { pCategoryId, categoryId, imgs, detail } = editProduct;

    const arrCategoryId = []; //级别菜单的默认值
    if (isUpdate) {
      if (pCategoryId === "0") {
        //只选择了一级分类
        arrCategoryId.push(pCategoryId);
      } else {
        //选择了二级分类
        arrCategoryId.push(pCategoryId);
        arrCategoryId.push(categoryId);
      }
    }

    const { getFieldDecorator } = this.props.form;
    const title = (
      <span>
        <Icon
          type="arrow-left"
          style={{ color: "green" }}
          onClick={() => this.props.history.push("/product/home")}
        ></Icon>
        <span>{isUpdate ? "修改" : "新增"}商品</span>
      </span>
    );
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              initialValue: editProduct.name,
              rules: [
                {
                  required: true,
                  message: "商品名称为必填项"
                }
              ]
            })(<Input placeholder="请输入商品名称"></Input>)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              initialValue: editProduct.desc,
              rules: [
                {
                  required: true,
                  message: "商品描述为必填项"
                }
              ]
            })(
              <TextArea
                placeholder="请输入商品描述"
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              initialValue: editProduct.price,
              rules: [
                {
                  required: true,
                  message: "商品价格为必填项"
                }
              ]
            })(
              <Input
                type="number"
                placeholder="请输入商品价格"
                addonAfter="元"
              ></Input>
            )}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator("categoryIds", {
              initialValue: arrCategoryId,
              rules: [
                {
                  required: true,
                  message: "商品分类为必填项"
                }
              ]
            })(
              <Cascader
                options={this.state.options}
                loadData={this.loadData}
                placeholder="请选择商品分类"
              />
            )}
          </Item>
          <Item label="商品图片">
            <Uploadpicture ref={this.refUpload} imgs={imgs}></Uploadpicture>
          </Item>
          <Item
            label="商品详情"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 18 }}
          >
            <RichText ref={this.refDetail} detail={detail}></RichText>
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}
export default Form.create()(ProductAddupdate);
