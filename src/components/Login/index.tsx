import React from "react"
import { Form, Input, Button, message } from "antd"
import { LockOutlined } from "@ant-design/icons"
import { EmailOutlined } from "@/components/Icons";
import { useUserStore } from "@/globalStore/user";
import type { FormProps } from 'antd';
// import styles from './index.module.less'


const useForm = Form.useForm

const Login: React.FC<{
    callback?: () => void
}> = ({callback}) => {
    const [form] = useForm()
    const {login, loginLoading} = useUserStore()

    const onFinish = (val: any) => {
        login(val).then(() => {
            callback?.()
            message.success('登录成功')
        }).catch((err) => {
            message.error('登录失败' + err)
            console.log(err)
        })
    }

    const onFinishFailed: FormProps['onFinishFailed'] = (errInfo) => {
        const fields = errInfo.errorFields
        fields.forEach(({ name }) => {
            name.forEach(item => {
                form.setFieldsValue({
                    [item]: ''
                })
            })
            
        })
        const input = form.getFieldInstance(fields[0].name)
        input.focus()
    }

    return (
        <Form
            form={form}
            initialValues={{
                email: '',
                password: ''
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                name='email'
                rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '邮箱不合法' }
                ]}
                validateTrigger='onBlur'
            >
                <Input prefix={<EmailOutlined className='icon' />} placeholder='邮箱' className='input' type='email' />
            </Form.Item>
            <Form.Item
                name='password'
                rules={[
                    { required: true, message: '请输入密码' },
                    {
                        type: 'string',
                        pattern: /^[0-9a-zA-Z@.]{8,20}$/,
                        transform: v => v.trim(),
                        message: '密码格式错误，8-20位，只能包含：数字、字母、@、.'
                    }
                ]}
                validateTrigger='onBlur'
            >
                <Input.Password prefix={<LockOutlined className='icon' />} placeholder='密码，8-20位' className='input' />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                <Button htmlType="submit" className='submit' loading={loginLoading}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default Login