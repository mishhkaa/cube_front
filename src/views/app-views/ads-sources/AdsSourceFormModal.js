import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Select } from 'antd';
import MedianApi from 'services/MedianApi';

const PLATFORMS = [
  { label: 'Facebook', value: 'fb' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Google Ads', value: 'gads' },
];

export const AdsSourceFormModal = ({ visible, onClose, editItem, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const isEdit = !!editItem?.id;

  useEffect(() => {
    if (visible) {
      MedianApi.usersAll().then(res => setUsers(Array.isArray(res) ? res : []));
      form.setFieldsValue({
        name: editItem?.name ?? '',
        platform: editItem?.platform ?? 'fb',
        user_id: editItem?.user_id ?? undefined,
        active: editItem?.active !== 0 && editItem?.active !== false,
      });
    }
  }, [visible, editItem, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (isEdit) {
        await MedianApi.adsSourceUpdate(editItem.id, { ...values, accounts: editItem.accounts ?? [], settings: editItem.settings ?? {} });
      } else {
        await MedianApi.adsSourceStore({ ...values, accounts: [], settings: {} });
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
      title={isEdit ? 'Редагувати джерело' : 'Додати джерело даних'}
      okText={isEdit ? 'Зберегти' : 'Створити'}
      cancelText="Скасувати"
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
      width={400}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Назва" rules={[{ required: true }]}>
          <Input placeholder="Латиниця, _ -" />
        </Form.Item>
        <Form.Item name="platform" label="Платформа" rules={[{ required: true }]}>
          <Select options={PLATFORMS} />
        </Form.Item>
        <Form.Item name="user_id" label="Користувач">
          <Select allowClear options={userOptions} placeholder="Оберіть" />
        </Form.Item>
        <Form.Item name="active" label="Активний" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AdsSourceFormModal;
