import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Select } from 'antd';
import MedianApi from 'services/MedianApi';

const CURRENCIES = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'UAH', value: 'UAH' },
];

export const FbCApiFormModal = ({ visible, onClose, editItem, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const isEdit = !!editItem?.id;

  useEffect(() => {
    if (visible) {
      MedianApi.usersAll().then(res => setUsers(Array.isArray(res) ? res : []));
      form.setFieldsValue({
        name: editItem?.name ?? '',
        pixel_id: editItem?.pixel_id ?? '',
        access_token: editItem?.access_token ?? '',
        currency: editItem?.currency ?? 'USD',
        user_id: editItem?.user_id ?? undefined,
        active: editItem?.active !== 0 && editItem?.active !== false,
        testing: !!editItem?.testing,
      });
    }
  }, [visible, editItem, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (isEdit) {
        await MedianApi.integrationFbCapiUpdate(editItem.id, values);
      } else {
        await MedianApi.integrationFbCapiStore(values);
      }
      onSuccess?.();
      onClose();
    } catch (e) {
      if (e.errorFields) return;
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map(u => ({ label: u.name || u.email, value: u.id }));

  return (
    <Modal
      open={visible}
      title={isEdit ? 'Редагувати Facebook CAPI' : 'Додати Facebook Conversions API'}
      okText={isEdit ? 'Зберегти' : 'Створити'}
      cancelText="Скасувати"
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
      width={480}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Назва" rules={[{ required: true }]}>
          <Input placeholder="Назва пікселя" />
        </Form.Item>
        <Form.Item name="pixel_id" label="Pixel ID" rules={[{ required: true }]}>
          <Input placeholder="Facebook Pixel ID" />
        </Form.Item>
        <Form.Item name="access_token" label="Access Token" rules={[{ required: true }]}>
          <Input.TextArea rows={3} placeholder="Токен доступу" />
        </Form.Item>
        <Form.Item name="currency" label="Валюта">
          <Select options={CURRENCIES} />
        </Form.Item>
        <Form.Item name="user_id" label="Користувач">
          <Select allowClear options={userOptions} placeholder="Оберіть" />
        </Form.Item>
        <Form.Item name="active" label="Активний" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="testing" label="Тестовий режим" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default FbCApiFormModal;
