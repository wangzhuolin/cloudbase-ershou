## 部署说明

- 下载本项目或者`git clone https://gitee.com/wangzhuolin/tcb-hackthon-ershou`;
- 导入小程序项目选择包含`project.config.json`的目录，并选择自己的小程序AppID;
- 修改`/miniprogram/app.js`中的 `env: '你的云开发环境id'`等相关参数;
- 部署`/cloudfunctions`中的云函数相关依赖;
- 创建云数据库集合`favorites_list、goods_list、user_info`并设置权限所有用户可读，仅创建者可写，其中`goods_list`集合中`location`字段添加地理位置索引;
- 部署完成;