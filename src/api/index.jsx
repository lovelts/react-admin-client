import ajax from './ajax';
import jsonp from 'jsonp'; //asios不能发jsonp
import { message } from 'antd';

const BASE = 'http://106.54.249.182:5000';
export const reqLogin = (username, password) => ajax.post(BASE + '/login', { username, password });
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`

        jsonp(url, {}, (error, data) => {
            if (!error && data.error === 0) {
                const { dayPictureUrl, weather } = data.results[0].weather_data[0];
                resolve({ dayPictureUrl, weather });
            } else {
                message.error('获取天气信息失败');
            }

        })
    })

}
export const reqCategorys = () => ajax(BASE + '/manage/category/list');

//添加分类
export const reqAddCategory = (categoryName) => ajax.post(BASE + '/manage/category/add',  categoryName );

//修改分类
export const reqUpdateCategory = ({ categoryName, categoryId }) => ajax.post(BASE + '/manage/category/update', { categoryName, categoryId });
//获取商品分页列表  包含所有query参数的对象
export const reqProducts = ({ pageNum, pageSize }) => ajax(BASE + '/manage/product/list', {
    params: {
        pageNum,
        pageSize
    }
})

//获取搜索的产品的分页列表
export const reqSearchProducts = ({
    pageSize,
    pageNum,
    searchName,
    searchType
   }) => ajax(BASE + '/manage/product/search', {
    params: {
        pageNum,
        pageSize,
        [searchType]: searchName
    }
}) 
//商品上架下架的改变
export const reqUpdateProductsStatus = (productId,status) => ajax(BASE + '/manage/product/updateStatus',{
    method:'post',
    data:{
        productId,
        status
    }
})
//获取分类
export const reqCategory = (categoryId) => ajax(BASE+'/manage/category/info',{
    params:{
        categoryId
    }
})
//删除图片
export const reqDeleteImg = (name) => ajax.post(BASE+'/manage/img/delete',{name});

//添加商品 或者更新商品

export const reqAddUpdateProduct = (product) => ajax.post(BASE + '/manage/product/' + ( product._id?'update':'add'), product)

// export const reqAddProduct = (product) =>ajax.post(BASE+'/manage/product/add',product);

// export const reqUpdateProduct = (product) =>ajax.post(BASE+'/manage/product/update',product);
// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax.post(BASE + '/manage/role/add', {roleName})
// 更新角色
export const reqUpdateRole = (role) => ajax.post(BASE + '/manage/role/update', role)
// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax.post(BASE + '/manage/user/delete', {
  userId
})
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax.post(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user)
