# 二手交易平台小程序

一款应用于校园场景的二手交易平台小程序，可以方便的进行二手商品信息发布、搜索、收藏、编辑、删除、分享等操作。

## 项目预览

![小程序码](https://images.gitee.com/uploads/images/2020/0407/215406_f5cda628_1939134.jpeg)

![项目截图](https://images.gitee.com/uploads/images/2020/0406/105808_4c8a323a_1939134.jpeg)


## 一键部署

[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgitee.com%2Fwangzhuolin%2Ftcb-hackthon-ershou.git&branch=master)

## 项目依赖
- [小程序云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [vant-weapp](https://vant-contrib.gitee.io/vant-weapp)

## 部署说明

- 下载本项目或者`git clone https://gitee.com/wangzhuolin/tcb-hackthon-ershou`;
- 导入小程序项目选择包含`project.config.json`的目录，并选择自己的小程序AppID;
- 修改`/miniprogram/app.js`中的 `env: '你的云开发环境id'`等相关参数;
- 部署`/cloudfunctions`中的云函数相关依赖;
- 创建云数据库集合`favorites_list、goods_list、user_info`并设置权限所有用户可读，仅创建者可写，其中`goods_list`集合中`location`字段添加地理位置索引;
- 部署完成;

## 开发说明

- Fork 本仓库
- 新建 Feat_xxx 分支
- 提交代码
- 新建 Pull Request

## 开源协议LICENSE

[Apache-2.0](https://gitee.com/wangzhuolin/tcb-hackthon-ershou/blob/master/LICENSE)