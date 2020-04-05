// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('goods_list').doc(event.id).update({
    data:{
      hits:_.inc(1)
    }
  })
  return await db.collection('goods_list').aggregate().match({
    _id: _.eq(event.id)
  }).lookup({
      from: 'user_info',
      localField: '_openid',
      foreignField: '_openid',
      as: 'userinfo',
    }).lookup({
      from: 'favorites_list',
      let: {
        openid: '$_openid',
        id: '$_id'
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$_openid', '$$openid']),
          $.eq(['$goodsid', '$$id']),
        ]))).done(),
      as: 'favorites',
    })
    .end()
}