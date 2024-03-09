<template>
  <div class="container">
    <div class="info">
      <img class="avatar" src="@/assets/logo.png" alt="" />
      <div class="name">{{ userInfo.data.nickname || '暂未登录' }}</div>
    </div>
    <div class="other" v-if="userInfo.data.ck">
      <div class="block">
        <div class="block-item">
          <div class="label strong">备注：</div>
          <div class="value">{{ userInfo.data.remarks }}</div>
        </div>

        <div class="block-item">
          <div class="label">更新时间：</div>
          <div class="value">{{ userInfo.data.timestamp }}</div>
        </div>
        <div class="block-item">
          <div class="label">ck：</div>
          <div class="value">{{
            userInfo.data.ck.slice(0, 15) +
            '...' +
            userInfo.data.ck.slice(userInfo.data.ck.length - 10, 10)
          }}</div>
        </div>
      </div>
      <div class="block" style="display: flex">
        <img class="qrImg" v-if="userInfo.data.qrurl" :src="userInfo.data.qrurl" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted } from 'vue';
  import { Storage } from '@/utils/Storage';

  // import { showToast } from 'vant';
  import { getUserInfo } from '@/api/user';

  const userInfo = reactive({
    data: {
      qlid: '',
      qlkey: '',
      ck: '',
      timestamp: '',
      nickname: '',
      remarks: '',
      qrurl: '',
    },
  }); //要提交的参数
  onMounted(async () => {
    console.log(Storage.get('loginInfo'));
    if (Storage.get('loginInfo')) {
      const res: any = await getUserInfo(Storage.get('loginInfo'));
      console.log(res, 'ewwwwwww');

      userInfo.data = res.data;
    }
    // 获取容器的信息
  });
</script>

<style lang="scss" scoped>
  .container {
    font-size: 14px;
    padding: 0 24px;
    background: url('@/assets/user_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .info {
      height: 150px;
      align-items: center;
      text-align: center;
      padding-top: 50px;

      .avatar {
        width: 80px;
        height: 80px;
      }
    }

    .block {
      width: auto;
      height: auto;
      padding: 12px;
      border-radius: 10px;
      background-color: #fff;
      margin-bottom: 12px;
      box-sizing: border-box;

      .block-item {
        line-height: 30px;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
      }
    }

    .strong {
      font-weight: 700;
      font-size: 16px;
    }

    .qrImg {
      width: 150px;
      height: 150px;
      margin: auto;
    }
  }
</style>
