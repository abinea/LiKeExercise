<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form';
import { FormProps, message } from 'ant-design-vue';
import { RegisterForm } from '@/types/request';
import { userStore } from '@/store';
import userApi from '@/api/user';
import { isEmail } from '@/utils/validate'

const store = userStore()
const router = useRouter();

// 注册表单
const registerForm = reactive<RegisterForm>({
  email: "",
  sid: "",
  password: "",
  checkPass: "",
  username: "",
  role: -1,
})
const handleFinish: FormProps['onFinish'] = async () => {
  const registerData: any = toRaw(registerForm)
  registerData.schoolId = Number(registerData.sid)
  const res: any = await userApi.register(registerData)
  console.log(res)
  if (!("code" in res)) {
    res.password = registerData.password
    store.setUserInfo(res)
    await message.loading("完成注册，跳转中...", 0.5)
    router.push("/login");
  }
};
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
  console.log(errors);
};

// 验证规则
const registerRef = ref(null)
const validateEmail = async (_rule: Rule, value: string) => {
  const res = isEmail(value)
  if (res) {
    return Promise.resolve();
  } else {
    return Promise.reject('邮箱格式不正确');
  }
};
const validatePwd = async (_rule: Rule, value: string) => {
  if (value === '' || value.length < 8) {
    return Promise.reject('请输入8位密码，包括大小写字母和数字');
  } else {
    if (registerForm.checkPass !== '') {
      registerRef.value.validateFields('checkPass');
    }
    return Promise.resolve();
  }
};
const validateCheckPass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请重新输入相同的密码');
  } else if (value !== registerForm.password) {
    return Promise.reject("重复输入的密码不匹配");
  } else {
    return Promise.resolve();
  }
}
const validateSid = async (_rule: Rule, value: string) => {
  const num10Reg = /\d{10}/
  if (num10Reg.test(value)) {
    return Promise.resolve();
  } else {
    return Promise.reject('教工号或学号为10位数字');
  }
};
const rules: Record<string, Rule[]> = {
  email: [{ validator: validateEmail, trigger: 'change' }],
  password: [{ validator: validatePwd, trigger: 'change' }],
  checkPass: [{ validator: validateCheckPass, trigger: 'change' }],
  sid: [{ validator: validateSid, trigger: 'change' }],
}
</script>
          
<template>
  <div class="register-page page">
    <div class="register-container">
      <a class="register-back" href="#/login">
        <LeftOutlined /> 返回登录
      </a>
      <div class="register-header">用户注册</div>
      <AForm ref="registerRef" class="register-form" :rules="rules" :model="registerForm" @finish="handleFinish"
        @finishFailed="handleFinishFailed">
        <AFormItem name="email" has-feedback>
          <AInput size="large" v-model:value="registerForm.email" placeholder="邮箱">
            <template #prefix>
              <MailOutlined />
            </template>
          </AInput>
        </AFormItem>
        <AFormItem name="password" has-feedback>
          <AInputPassword size="large" v-model:value="registerForm.password" type="password" placeholder="密码"
            :maxlength="8">
            <template #prefix>
              <LockOutlined />
            </template>
          </AInputPassword>
        </AFormItem>
        <AFormItem name="checkPass" has-feedback>
          <AInputPassword size="large" v-model:value="registerForm.checkPass" type="password" placeholder="确认密码"
            :maxlength="8">
            <template #prefix>
              <LockOutlined />
            </template>
          </AInputPassword>
        </AFormItem>
        <AFormItem name="name">
          <AInput size="large" v-model:value="registerForm.username" placeholder="姓名">
            <template #prefix>
              <UserOutlined />
            </template>
          </AInput>
        </AFormItem>
        <AFormItem name="sid" has-feedback>
          <AInput size="large" v-model:value="registerForm.sid" placeholder="学号/教工号" :maxlength="10">
            <template #prefix>
              <IdcardOutlined />
            </template>
          </AInput>
        </AFormItem>
        <AFormItem name="role">
          <span class="big left">选择身份：</span>
          <a-radio-group class="radio-group" v-model:value="registerForm.role">
            <a-radio :value="1" class="big">学生</a-radio>
            <a-radio :value="2" class="big">老师</a-radio>
          </a-radio-group>
        </AFormItem>
        <AFormItem name="submit">
          <AButton class="register-form-button" size="large" type="primary" html-type="submit" :disabled="
  Object.values(registerForm).some((filed: string | number) => filed === '' || filed === -1)
          ">
            注册
          </AButton>
        </AFormItem>
      </AForm>
      <p class="agreement">
        登录即表示同意平台
        <a href="https://homewh.chaoxing.com/agree/privacyPolicy?appId=900001" target="_blank">《隐私政策》</a>
        和
        <a href="https://homewh.chaoxing.com/agree/userAgreement?appId=900001" target="_blank">《用户协议》</a>
      </p>
    </div>
  </div>
  <Footer />
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
    height: 680px;
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
    height: 400px;
    margin-top: 140px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    &-button {
      margin-top: 20px;
      width: 100%;
    }

    .radio-group {
      display: flex;
      justify-content: space-evenly;
    }
  }

}
</style>