import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import { Form, Input, Button } from 'antd';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();

  const onSubmit = async data => {
    try {
      await login(data);
      Swal.fire({
        title: 'Success!',
        text: 'Logged in successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.href = '/dashboard';
      });
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'Invalid login',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      style={{ maxWidth: 400, margin: '0 auto' }}
    >
      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input {...register('email')} placeholder="Email" />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password {...register('password')} placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;