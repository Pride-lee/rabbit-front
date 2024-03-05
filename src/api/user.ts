import { LoginParams, LoginResult } from './models/userModel';
import request from '@/utils/request';

enum Api {
  getUserId = '/base/appLogin', // 获取用户userid
}

// 根据code获取userid / token
export function getUserId(data: LoginParams) {
  return request<LoginResult>({
    url: Api.getUserId,
    method: 'post',
    data,
  });
}
// 获取信息
export function getUserInfo(params) {
  return request({
    url: `/api/User?user_index=${params.user_index}&container_id=${params.container_id}`,
    method: 'get',
  });
}
