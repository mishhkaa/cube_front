import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Select, Spin } from 'antd';
import MedianApi from 'services/MedianApi';

const UTM_OPTIONS = [
  { value: 'default', label: 'Звичайний' },
  { value: 'first-last', label: 'First last utms' },
];

const firstUpperCase = (str) => (str ? String(str).charAt(0).toUpperCase() + String(str).slice(1) : '');

export const ScriptBundleFormModal = ({ visible, onClose, editItem, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const isEdit = !!editItem?.id;

  useEffect(() => {
    if (visible) {
      MedianApi.integrationScriptBundlesIntegrationsAccounts()
        .then((res) => setAccounts(res || {}))
        .catch(() => setAccounts({}));
    }
  }, [visible]);

  useEffect(() => {
    if (visible && editItem) {
      form.setFieldsValue({
        name: editItem.name ?? '',
        active: editItem.active !== false && editItem.active !== 0,
        utm: editItem.utm || undefined,
        integrations: editItem.integrations || {},
      });
    } else if (visible && !editItem) {
      form.setFieldsValue({ name: '', active: true, utm: undefined, integrations: {} });
    }
  }, [visible, editItem, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const integrations = values.integrations || {};
      Object.keys(integrations).forEach((k) => {
        if (integrations[k] == null || integrations[k] === '') delete integrations[k];
      });
      setLoading(true);
      await MedianApi.integrationScriptBundlesStore(
        { name: values.name, active: values.active, utm: values.utm, integrations },
        editItem?.id
      );
      onSuccess?.();
      onClose();
    } catch (e) {
      if (e.errorFields) return;
    } finally {
      setLoading(false);
    }
  };

  const integrationKeys = accounts ? Object.keys(accounts) : [];

  return (
    <Modal
      open={visible}
      title={isEdit ? 'Редагувати бандл' : 'Додати бандл'}
      okText={isEdit ? 'Зберегти' : 'Додати'}
      cancelText="Скасувати"
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
      width={480}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Назва" rules={[{ required: true, message: 'Укажіть назву' }]}>
          <Input placeholder="Назва бандла" />
        </Form.Item>
        {integrationKeys.length > 0 && (
          <Form.Item label="Інтеграції" style={{ marginBottom: 8 }}>
            {integrationKeys.map((key) => (
              <Form.Item key={key} name={['integrations', key]} label={firstUpperCase(key)} style={{ marginBottom: 8 }}>
                <Select
                  allowClear
                  placeholder={`Оберіть ${firstUpperCase(key)}`}
                  options={(accounts[key] || []).map((a) => ({ label: `#${a.id} ${a.name}`, value: a.id }))}
                />
              </Form.Item>
            ))}
          </Form.Item>
        )}
        <Form.Item name="utm" label="UTM">
          <Select allowClear options={UTM_OPTIONS} placeholder="Звичайний" />
        </Form.Item>
        <Form.Item name="active" label="Увімкнено" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ScriptBundleFormModal;
