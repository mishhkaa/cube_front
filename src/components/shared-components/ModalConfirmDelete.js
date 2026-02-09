import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

/**
 * Модальне підтвердження видалення (аналог ModalDelete зі старого шаблону).
 * onConfirm: () => Promise|void, після успіху викликається onSuccess.
 */
export const ModalConfirmDelete = ({
  visible,
  onCancel,
  onConfirm,
  onSuccess,
  title = 'Видалити?',
  content = 'Ви впевнені, що хочете видалити цей запис? Цю дію не можна скасувати.',
  okText = 'Видалити',
  okButtonProps = { danger: true },
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleOk = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onSuccess?.();
      onCancel?.();
    } catch (e) {
      // notification вже в interceptor або можна показати тут
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={title}
      okText={okText}
      okButtonProps={okButtonProps}
      cancelText="Скасувати"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
    >
      <p>{content}</p>
    </Modal>
  );
};

/**
 * Підтвердження видалення (Modal.confirm).
 */
export const confirmDelete = (onConfirm, options = {}) => {
  Modal.confirm({
    title: options.title || 'Видалити?',
    icon: <ExclamationCircleOutlined />,
    content: options.content || 'Цю дію не можна скасувати.',
    okText: 'Видалити',
    okType: 'danger',
    cancelText: 'Скасувати',
    onOk: onConfirm,
  });
};

export default ModalConfirmDelete;
