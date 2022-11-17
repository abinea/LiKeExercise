<script setup lang="ts">
import type { FormProps } from 'ant-design-vue';
import { userStore } from "@/store/user";
import { message } from "ant-design-vue"

const store = userStore()
const router = useRouter();

// 记住密码
// 登录表单
const resetForm = reactive({
  email: "",
  captcha: "",
  password: ""
})

const count = ref(0)

const handleFinish: FormProps['onFinish'] = () => {
  // 提交数据
  store.resetValid(resetForm)
  // .then(res=>{
  //   message.success("验证成功",2)
  // })
  console.log(resetForm);
};
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
  console.log(errors);
};

let timer: any = null;
const handleGetCaptcha = () => {
  store.resetCaptcha({ email: resetForm.email }).then(res => {
    count.value = 60
    clearInterval(timer)
    timer = setInterval(() => {
      if (count.value <= 0) {
        clearInterval(timer)
      } else {
        count.value--
      }
    }, 1000)
  })
}

// 进度条
const steps = [
  {
    title: '验证邮箱',
  },
  {
    title: '重置密码',
  },
  {
    title: '完成',
  },
]
const current = ref(0)
const isNext = ref(false)
const nextStep = () => {
  isNext.value = true
  message.success("验证成功", 1.5)
};
function reset() {
  store.resetPassword({ email: resetForm.email, newPasswd: resetForm.password }).then(res => {
    message.loading("重置成功，跳转中...", 1.5).then(() => {
      router.push("/login");
    });
  })
}
</script>

<template>
  <div class="register-page page">
    <div class="register-container">
      <a class="register-back" href="#/login">
        <LeftOutlined /> 返回登录
      </a>
      <div class="register-header">重置密码</div>
      <AForm class="register-form" :model="resetForm" @finish="handleFinish" @finishFailed="handleFinishFailed">
        <AFormItem style="padding-bottom: 20px;">
          <a-steps :current="current" size="small">
            <a-step v-for="item in steps" :key="item.title" :title="item.title" />
          </a-steps>
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
              <a-button style="border-radius: 8px;" type="default" @click="handleGetCaptcha">
                {{
                    count === 0 ?
                      "获取验证码" :
                      `${count}秒后重试`
                }}
              </a-button>
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
          <AButton v-if="!isNext" class="register-form-button" size="large" type="primary" html-type="submit"
            @click="nextStep" :disabled="resetForm.email === '' || resetForm.captcha === ''">
            下一步
          </AButton>
          <AButton v-else class="register-form-button" size="large" type="primary" html-type="submit" @click="reset"
            :disabled="resetForm.email === '' || resetForm.password === ''">
            重置
          </AButton>
        </AFormItem>
      </AForm>
    </div>
  </div>
</template>


<style scoped lang="less">
.register {
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