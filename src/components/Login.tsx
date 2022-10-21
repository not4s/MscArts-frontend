import { useState } from "react";
import AuthService from "../services/auth.service";
import { Button, Checkbox, Form, Input } from "antd";
import React from "react";

export default function Login(props: any) {
  const [form] = Form.useForm();
  const [showError, setShowError] = useState(false);
  const username = Form.useWatch("Username", form);
  const password = Form.useWatch("Password", form);

  const onFinish = (values: any) => {
    console.log("Success:", values);
    console.log(username);
    console.log(password);
    handleLogin().then((r) => console.log("finish"));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleLogin = async () => {
    try {
      AuthService.login(username, password).then(
        () => {
          props.setCurrentUser(username);
          props.setCurrentUserRole();
        },
        (error) => {
          setShowError(true);
          console.log(error);
        }
      );
    } catch (err) {
      setShowError(true);
    }
  };

  return (
    <Form
      name="basic"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="Username"
        rules={[{ required: true, message: "Please input your Email!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="Password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
