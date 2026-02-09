import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Select } from 'antd';
import MedianApi from 'services/MedianApi';

const PERMISSIONS = [
  { label: 'Всі права (admin)', value: 'admin' },
  { label: 'WEB Інтеграції', value: 'web' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'CSD', value: 'csd' },
  { label: 'Користувачі', value: 'users' },
  { label: 'Ads Sources', value: 'ads-sources' },
];

export const UserFormModal = ({ visible, onClose, editUser, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!editUser?.id;

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: editUser?.name ?? '',
        email: editUser?.email ?? '',
        active: editUser?.active !== 0 && editUser?.active !== false,
        permissions: editUser?.permissions ?? [],
      });
    }
  }, [visible, editUser, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (isEdit) {
        await MedianApi.userUpdate(editUser.id, values);
      } else {
        await MedianApi.userStore(values);
      }
      onSuccess?.();
      onClose();
    } catch (e) {
      if (e.errorFields) return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={isEdit ? 'Редагувати користувача' : 'Додати користувача'}
      okText={isEdit ? 'Зберегти' : 'Створити'}
      cancelText="Скасувати"
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
      width={400}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Ім'я" rules={[{ required: false }]}>
          <Input placeholder="Ім'я" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="email@example.com" disabled={isEdit} />
        </Form.Item>
        <Form.Item name="active" label="Активний" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="permissions" label="Права">
          <Select mode="multiple" options={PERMISSIONS} placeholder="Оберіть права" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default UserFormModal;
