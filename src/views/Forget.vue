<script setup lang="ts">
import type { FormProps } from 'ant-design-vue';
import { message } from "ant-design-vue"
import userApi from '@/api/user';

const router = useRouter();

// 登录表单
const resetForm = reactive({
  email: "",
  captcha: "",
  password: ""
})

// 进度条
const steps = [{
  title: '验证邮箱',
}, {
  title: '重置密码',
}, {
  title: '完成',
}]
const current = ref(0)
const isNext = ref(false)

const count = ref(0)
let timer: any = null;
async function handleGetCaptcha() {
  const res = await userApi.resetCaptcha({ email: resetForm.email })
  if (res.code === 0) {
    message.success("验证码已发送")
    count.value = 60
    clearInterval(timer)
    timer = setInterval(() => {
      if (count.value <= 0) {
        clearInterval(timer)
      } else {
        count.value--
      }
    }, 1000)
  }
}
const resetValid: FormProps['onFinish'] = async () => {
  // 提交数据
  const res = await userApi.resetValid(resetForm)
  if (res.code === 0) {
    isNext.value = true
    current.value++
    message.success("验证成功", 1.5)
  }
  else {
    return
  }
};
async function reset() {
  const res = await userApi.resetPassword({ email: resetForm.email, newPasswd: resetForm.password })
  console.log(res);
  current.value++
  await message.loading("重置成功，跳转中...", 0.5)
  router.push("/login");
}

const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
  console.log(errors);
};
</script>

<template>
  <div class="forget-page page">
    <div class="forget-container">
      <a class="forget-back" href="#/login">
        <LeftOutlined /> 返回登录
      </a>
      <div class="forget-header">重置密码</div>
      <AForm class="forget-form" :model="resetForm" @finishFailed="handleFinishFailed">
        <AFormItem style="padding-bottom: 20px;">
          <ASteps :current="current" size="small">
            <AStep v-for="item, index in steps" :key="index" :title="item.title" />
          </ASteps>
        </AFormItem>
        <AFormItem name="email">
          <AInput size="large" v-model:value="resetForm.email" placeholder="邮箱">
            <template #prefix>
              <MailOutlined />
            </template>
          </AInput>
        </AFormItem>
        <AFormItem>
          <AInput v-if="!isNext" size="large" v-model:value="resetForm.captcha" placeholder="验证码" :maxlength="6">
            <template #prefix>
              <LockOutlined />
            </template>
            <template #suffix>
              <AButton style="border-radius: 8px;" type="default" @click="handleGetCaptcha">
                {{
                    count.value === 0 ?
                      "获取验证码" :
                      `${count}秒后重试`
                }}
              </AButton>
            </template>
          </AInput>
          <AInputPassword v-else size="large" v-model:value="resetForm.password" type="password" placeholder="密码"
            :maxlength="8">
            <template #prefix>
              <LockOutlined />
            </template>
          </AInputPassword>
        </AFormItem>
        <AFormItem name="submit">
          <AButton v-if="!isNext" class="forget-form-button" size="large" type="primary" html-type="submit"
            @click="resetValid" :disabled="resetForm.email === '' || resetForm.captcha === ''">
            下一步
          </AButton>
          <AButton v-else class="forget-form-button" size="large" type="primary" html-type="submit" @click="reset"
            :disabled="resetForm.email === '' || resetForm.password === ''">
            重置
          </AButton>
        </AFormItem>
      </AForm>
    </div>
  </div>
</template>


<style scoped lang="less">
#app {
  width: 100vw;
  height: 100vh;
  background-color: #f2f4f7;
}

.forget {
  &-back {
    position: absolute;
    top: 46px;
    left: 60px;
    color: @gray;
  }

  &-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 96vh;
  }


  &-container {
    width: 540px;
    height: 500px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 20px 0px rgba(175, 187, 204, 0.2);
    position: relative;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  &-header {
    position: absolute;
    margin-top: 36px;
    text-align: center;
    font-size: 24px;
  }

  &-form {
    width: 360px;
    height: 320px;
    margin-top: 110px;

    &-button {
      margin-top: 20px;
      width: 100%;
    }
  }

}
</style>