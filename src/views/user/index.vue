<template>
    <div class="container">
        <div class="info">
            <img class="avatar" src="@/assets/logo.png" alt="">
            <div class="name">{{ userInfo.data.nickname || '暂未登录' }}</div>
        </div>
        <div class="other">
            <div class="block"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { showToast } from 'vant';
import {
    getUserInfo,
} from '@/api/user';

const active = ref<any>(0);
const userInfo = reactive({
    data: {
        "qlid": "",
        "qlkey": "",
        "ck": "",
        "timestamp": "",
        "nickname": "",
        "qrurl": ""
    }
}); //要提交的参数
console.log(active);

onMounted(async () => {
    // 获取容器的信息
    const res: any = await getUserInfo()
    userInfo.data = res
});
</script>

<style lang="scss" scoped>
.container {
    padding: 0 24px;
    background: url('@/assets/user_bg.png');
    background-repeat: no-repeat;
    background-size: 100vw;

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
        height: 100px;
        border-radius: 10px;
        background-color: #fff;
    }

}
</style>
