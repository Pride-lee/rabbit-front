<template>
  <div class="page">
    <div class="herder">
      <div class="title">{{ title }} </div>
      <span class="version"> {{ version }}</span>
    </div>
    <div class="content">
      <div class="info">
        <van-tag type="success">ck容量：{{ containerInfo.ckcount }}</van-tag>
        <van-tag type="warning">占用资源：{{ containerInfo.totalcount }}</van-tag>
        <van-tag type="primary">剩余资源：{{ containerInfo.tabcount }}</van-tag>
      </div>
      <van-tabs v-model="active">
        <!-- -------------------------------   ↓密码登录   ------------------------------- -->
        <van-tab>
          <template #title> <van-icon name="closed-eye" />密码登录 </template>

          <van-form @submit="onSubmit">
            <van-field
              v-model="pwForm.id"
              clearable
              type="number"
              name="手机号"
              placeholder="手机号"
              :rules="[
                { required: true, message: '请填写手机号' },
                { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' },
              ]"
            />
            <van-field
              v-model="pwForm.pw"
              clearable
              name="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            >
            </van-field>
            <div style="margin: 16px 0">
              <!-- <van-button type="primary" round block native-type="submit">提交</van-button> -->
              <van-button
                type="primary"
                color="linear-gradient(to bottom, #347AFF, #1772ff)"
                @click="pwLogin"
                block
                >提 交</van-button
              >
            </div>
          </van-form>
        </van-tab>
        <!-- -------------------------------   ↓短信登录   ------------------------------- -->
        <van-tab>
          <template #title> <van-icon name="smile-comment-o" />短信登录 </template>

          <van-form @submit="onSubmit">
            <van-field
              v-model="selectName"
              name="picker"
              readonly
              placeholder="点击选择服务器"
              @click="show = true"
            />
            <van-popup v-model:show="show" position="bottom">
              <van-picker
                title="选择服务器"
                :columns-field-names="customFieldName"
                :columns="containerInfo.list"
                @confirm="selectContainer"
                @cancel="show = false"
              />
            </van-popup>
            <van-field
              v-model="form.Phone"
              clearable
              type="number"
              name="手机号"
              placeholder="手机号"
              :rules="[
                { required: true, message: '请填写手机号' },
                { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' },
              ]"
            />
            <van-field
              v-model="form.Code"
              clearable
              name="验证码"
              placeholder="验证码"
              :rules="[{ required: true, message: '请填写验证码' }]"
            >
              <template #button>
                <van-button
                  v-if="seconds < 1"
                  :disabled="disabled"
                  loading-type="spinner"
                  size="small"
                  type="primary"
                  @click="sendSmsCode"
                  >发送验证码</van-button
                >
                <span v-else>{{ seconds }}s</span>
              </template>
            </van-field>
            <div style="margin: 16px 0">
              <!-- <van-button type="primary" round block native-type="submit">提交</van-button> -->
              <van-button
                type="primary"
                color="linear-gradient(to bottom, #347AFF, #1772ff)"
                native-type="submit"
                block
                >提 交</van-button
              >
            </div>
          </van-form>
        </van-tab>
        <!-- -------------------------------   ↓扫码登录   ------------------------------- -->
        <van-tab>
          <template #title> <van-icon name="scan" />扫码登录 </template>

          <van-field
            v-model="selectName"
            name="picker"
            readonly
            placeholder="点击选择服务器"
            @click="show = true"
          />
          <van-popup v-model:show="show" position="bottom">
            <van-picker
              title="选择服务器"
              :columns-field-names="customFieldName"
              :columns="containerInfo.list"
              @confirm="selectContainer"
              @cancel="show = false"
            />
          </van-popup>
          <div class="img" style="width: 100%; display: flex">
            <img
              v-if="qrData.qr && imgShow"
              style="width: 230px; height: 230px; margin: auto"
              :src="'data:image/png;base64,' + qrData.qr"
              alt=""
            />
          </div>
          <div class="info">
            <van-button type="primary" @click="getQrCode(0)">获取二维码</van-button>
            <van-button @click="getQrCode(1)" type="primary">口令登录</van-button>
            <van-button @click="openJingdongApp" type="primary">打开京东</van-button>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { showToast } from 'vant';
  import { copyToClipboard } from '@/utils';
  import { Storage } from '@/utils/Storage';
  import {
    postPw,
    checkPw,
    sendCode,
    VerifyCode,
    getConfig,
    getTitle,
    getVersion,
    AutoCaptcha,
    getQr,
    qrCheck,
  } from '@/api/index';
  const router = useRouter();
  defineOptions({ name: 'Home' });
  const active = ref<any>(0);
  const disabled = ref<any>(false);
  const seconds = ref<any>(0); //读秒的秒数
  const title = ref<any>('欢迎登陆'); //读秒的秒数
  const version = ref<any>(''); //读秒的秒数
  const show = ref<any>(false); //读秒的秒数
  const selectName = ref('');
  const imgShow = ref(false);
  const form = reactive({ Phone: '', Code: '', container_id: '' }); //要提交的参数
  const pwForm = reactive({ id: '', pw: '' }); //要提交的参数
  const qrData = reactive({ QRCodeKey: '', code: '', jcommond: '', qr: '' }); //二维码登录的参数
  const customFieldName = {
    text: 'container_name',
    value: 'container_id',
  };
  const containerInfo = ref<any>({
    autocount: 0,
    ckcount: 0,
    list: [],
    tabcount: 0,
    totalcount: 0,
  }); //容器相关

  onMounted(async () => {
    // 获取容器的信息
    const { data } = await getConfig();
    containerInfo.value = data;
    if (containerInfo.value.list.length > 0) {
      form.container_id = containerInfo.value.list[0].container_id;
      selectName.value = containerInfo.value.list[0].container_name;
    }
    // 页面title
    const titleData = await getTitle();
    title.value = titleData.data.title;
    const versionData: any = await getVersion();
    version.value = versionData.version;
  });

  // 选择容器
  const selectContainer = ({ selectedOptions }) => {
    // 默认情况下点击选项时不会自动收起
    // 可以通过 close-on-click-action 属性开启自动收起
    selectName.value = selectedOptions[0].container_name;
    form.container_id = selectedOptions[0].container_id;
    show.value = false;
  };

  // 发送验证码
  const sendSmsCode = async () => {
    if (!/^1[3456789]\d{9}$/.test(form.Phone)) return showToast('请输入正确的手机号');
    disabled.value = true;
    const data: any = await sendCode({ Phone: form.Phone, container_id: form.container_id });
    disabled.value = false;
    const res: any = await AutoCaptcha({ Phone: form.Phone });
    if (res.message == "'img'") showToast('发送成功！');
    console.log('data', data);
    seconds.value = 60;
    const timer = setInterval(() => {
      if (seconds.value > 0) {
        seconds.value--;
      } else {
        clearInterval(timer);
      }
    }, 1000);
  };
  const pwLogin = async () => {
    const res: any = await postPw(pwForm);
    console.log(res);
    if (res.status !== 'pass') {
      // Storage.set('loginInfo', res);
      return showToast(res.msg);
      // router.push({ path: '/user' });
    }
    showToast('正在登录，请稍后根据提示操作');
    const timerId = setInterval(() => {
      checkPw({ uid: res.uid }).then((res: any) => {
        console.log('res', res);
        if (res.status == 'error') {
          clearInterval(timerId);
          return showToast(res.msg);
        }
        if (res.code == 57) {
          clearInterval(timerId);
          Storage.set('loginInfo', res);
          showToast('登录成功');
          router.push({ path: '/user' });
        }
      });
    }, 5000);
  };
  // 提交验证码
  const onSubmit = async () => {
    const res: any = await VerifyCode(form);
    console.log(res);
    if (res.success && res.message) {
      Storage.set('loginInfo', res);
      showToast('登录成功');
      router.push({ path: '/user' });
    }
  };

  // 获取二维码
  const getQrCode = async (type) => {
    try {
      const data: any = await getQr();
      qrData.qr = data.qr;
      qrData.jcommond = data.jcommond;

      if (type === 0) {
        imgShow.value = true;
        showToast('请长按保存图片后打开京东扫码登录');
      } else {
        imgShow.value = false;
        copyToClipboard(qrData.jcommond, '口令已成功复制到剪贴板！请打开京东进行授权');
      }
      // 每两秒查询一下扫码状态
      const timerId = setInterval(() => {
        qrCheck({ QRCodeKey: data.QRCodeKey, container_id: form.container_id }).then((res) => {
          if (res.code == 502) {
            clearInterval(timerId);
            showToast(res.msg);
          } else if (res.code == 57) {
            clearInterval(timerId);
            Storage.set('loginInfo', res);
            showToast('登录成功');
            router.push({ path: '/user' });
          }
        });
      }, 3000);
    } catch (error) {
      showToast('发生错误：' + error);
    }
  };

  // 打开京东
  function openJingdongApp() {
    const appPackage = 'openapp.jdmobile://virtual';
    if (window.navigator.userAgent.indexOf('Android') > -1) {
      // For Android
      window.location.href = appPackage;
    } else if (
      window.navigator.userAgent.indexOf('iPhone') > -1 ||
      window.navigator.userAgent.indexOf('iPad') > -1
    ) {
      // For iOS
      window.location.href = `appPackage`;
    } else {
      window.location.href = 'https://itunes.apple.com/cn/app/jing-dong/id414245413'; // Replace with the actual App Store link
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .van-field {
    margin: 10px 0;
    background-color: #f7f7f7;
    border-radius: 8px;
  }

  .page {
    width: auto;
    background-color: #1772ff;
  }

  .herder {
    position: relative;
    height: 230px;
    display: flex;
    align-items: center;
    color: #fff;
    font-weight: 700;

    .title {
      justify-content: center;
      margin: auto;
    }

    .version {
      position: absolute;
      // top: 150px;
      bottom: 12px;
      right: 12px;
      font-size: 16px;
    }
  }

  .content {
    height: calc(92vh - 278px);
    padding: 30px;
    border-radius: 20px 20px 0 0;
    background-color: #fff;

    .info {
      display: flex;
      font-size: 14px;
      justify-content: space-around;
      margin: 20px 0;
    }
  }
</style>
