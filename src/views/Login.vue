<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import type { FormProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import Cookies from 'js-cookie'
import { userStore } from '@/store'
import type { LoginForm } from '@/types/request'

const store = userStore()
const router = useRouter()

// 记住密码
const remember = ref(getStorage('remember') || false)
// 登录表单
const loginForm: UnwrapRef<LoginForm> = reactive({
  account: store.userInfo.email || store.userInfo.schoolId || getStorage('account'),
  password: store.userInfo.password || (remember.value ? getStorage('password') : ''),
})

const handleFinish: FormProps['onFinish'] = async () => {
  // 记住密码处理
  setStorage('account', loginForm.account)
  setStorage('remember', remember.value)
  if (remember.value)
    setStorage('password', loginForm.password)
  else
    removeStorage('password')

  // 提交数据
  const res = await login(loginForm)
  if ('token' in res) {
    Cookies.set('token', res.token)
    await message.loading('登陆成功，跳转中...', 0.5)
    const info = await userInfo()
    store.setUserInfo(info)
    router.push('/home')
  }
}
const handleFinishFailed: FormProps['onFinishFailed'] = (errors) => {
  console.error(errors)
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        用户登录
      </div>
      <AForm class="login-form" :model="loginForm" @finish="handleFinish" @finish-failed="handleFinishFailed">
        <AFormItem name="account">
          <AInput v-model:value="loginForm.account" size="large" placeholder="邮箱/学号/教工号">
            <template #prefix>
              <UserOutlined />
            </template>
          </AInput>
        </AFormItem>
        <AFormItem name="password">
          <AInputPassword
            v-model:value="loginForm.password" size="large" type="password" placeholder="密码"
            :maxlength="8"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </AInputPassword>
          <AFormItem style="margin-top: 16px;margin-bottom: 0px;">
            <ACheckbox v-model:checked="remember">
              记住密码
            </ACheckbox>
            <div class="right">
              <RouterLink to="/register">
                尚未注册?
              </RouterLink>
              <ADivider type="vertical" />
              <RouterLink to="/forget">
                忘记密码?
              </RouterLink>
            </div>
          </AFormItem>
        </AFormItem>
        <AFormItem>
          <AButton
            class="login-form-button" size="large" type="primary" html-type="submit"
            :disabled="loginForm.account === '' || loginForm.password === ''"
          >
            登录
          </AButton>
        </AFormItem>
      </AForm>
      <p class="agreement">
        登录即表示同意平台
        <RouterLink to="/404">
          《隐私政策》
        </RouterLink>
        和
        <RouterLink to="/404">
          《用户协议》
        </RouterLink>
      </p>
    </div>
  </div>
  <div class="footer">
    <p>荔课网练 2022</p>
  </div>
</template>

<style scoped lang="less">
.login {
  &-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 96vh;
  }

  &-container {
    width: 540px;
    height: 520px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 20px 0px rgba(175, 187, 204, 0.2);
    position: relative;
    display: flex;
    justify-content: center;
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
