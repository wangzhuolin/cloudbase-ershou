// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  console.log(event)
  let where = {}
  if (event.category != undefined) {
    where.category = _.eq(event.category)
  }
  if (event.title != undefined) {
    where.title = db.RegExp({
      regexp: event.title,
      options: 'i'
    })
  }
  if (event.openid != undefined) {
    where._openid = _.eq(event.openid)
  }
  //'hits' 'updatetime'
  let orderby = event.orderby ? event.orderby : 'updatetime'
  let by = 'desc'
  if (orderby == 'price'){
    by = 'asc'
  }
  let skip = event.skip ? event.skip : 0

  console.log(where)
  if (event.longitude != undefined && event.latitude != undefined) {
    where.location = _.geoNear({
      geometry: db.Geo.Point(event.longitude, event.latitude),
    })
    return await db.collection('goods_list').where(
      where
    ).field({
      address: true,
      title: true,
      price: true,
      desc: true,
      thumb: true,
      updatetime: true
    }).skip(skip).limit(20).get()
  } else {
    return await db.collection('goods_list').where(
      where
    ).field({
      address: true,
      title: true,
      price: true,
      desc: true,
      thumb: true,
      updatetime: true
    }).skip(skip).limit(20).orderBy(orderby, by).get()
  }
}