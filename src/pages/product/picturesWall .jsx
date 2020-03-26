import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../api';
import { BASE_IMG } from '../../utils/constant';

// function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// }

class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  state = {
    previewVisible: false,
    previewImage: '', //大图的地址或者是base64的值
    fileList: [
      // {
      //   uid: '-1',
      //   name: 'image.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },

    ],
  };

  handleCancel = () => { this.setState({ previewVisible: false }) };

  //大图预览的回调函数file是当前选择的图片对应的file
  handlePreview = async file => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }
    console.log(file.preview)
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  //当文件状态发生改变时发生的回调
  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      file = fileList[fileList.length - 1];
      const { name, url } = file.response.data;
      // console.log(name,url);
      file.name = name;
      file.url = url;
    } else if (file.status === 'removed') {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success('删除图片成功');
      } else {
        message.error('删除图片失败');
      }
    }
    // console.log(file);
    this.setState({ fileList });

  };
  getImgs = () => this.state.fileList.map(file => file.name);
  componentWillMount() {
    const { imgs } = this.props;
    console.log(imgs)
    if (imgs && imgs.length > 0) {
      const fileList = imgs.map((img,index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG + img
      }));
      this.setState({fileList});
    }
  }
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    // console.log(fileList);
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="http://106.54.249.182:5000/manage/img/upload"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall