import request from '@/utils/request';

// 获取title
export function getTitle() {
  return request({
    url: '/api/Title',
    method: 'get',
  });
}
//获取版本
export function getVersion() {
  return request({
    url: '/api/version',
    method: 'get',
  });
}
// 获取信息
export function getConfig() {
  return request({
    url: '/api/Config',
    method: 'get',
  });
}
// 获取验证码
export function sendCode(data) {
  return request({
    url: '/sms/sendSMS',
    method: 'post',
    data,
  });
}
// 自动验证
export function AutoCaptcha(data) {
  return request({
    url: '/sms/AutoCaptcha',
    method: 'post',
    data,
  });
}
export function VerifyCode(data) {
  return request({
    url: '/sms/VerifyCode',
    method: 'post',
    data,
  });
}
// 获取二维码
export function getQr() {
  return request({
    url: '/api/GenQrCode',
    method: 'post',
  });
}
