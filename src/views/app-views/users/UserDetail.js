import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Descriptions, Avatar, Button, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MedianApi from 'services/MedianApi';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { confirmDelete } from 'components/shared-components/ModalConfirmDelete';
import UserFormModal from './UserFormModal';

export const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    MedianApi.userShow(id)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [id]);

  const handleDelete = () => {
    confirmDelete(
      async () => {
        await MedianApi.userDelete(id);
        navigate(`${APP_PREFIX_PATH}/users`);
      },
      { title: 'Видалити користувача?', content: `Користувач ${user?.name || user?.email} буде видалений.` }
    );
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '48px auto' }} />;
  if (!user) return <Card title="Користувач не знайдено"><Button onClick={() => navigate(`${APP_PREFIX_PATH}/users`)}>← Назад до списку</Button></Card>;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(`${APP_PREFIX_PATH}/users`)}>
          Назад до списку
        </Button>
        <Button type="primary" icon={<EditOutlined />} onClick={() => setEditModalVisible(true)}>Редагувати</Button>
        <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>Видалити</Button>
      </Space>
      <Card title="Профіль користувача" className="card-elevated">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Аватар">
            {user.avatar_url ? <Avatar src={user.avatar_url} size={64} /> : <Avatar size={64}>{user.name?.[0] || user.email?.[0]}</Avatar>}
          </Descriptions.Item>
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Ім'я">{user.name || '—'}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Активний">{user.active ? 'Так' : 'Ні'}</Descriptions.Item>
          <Descriptions.Item label="Права">{user.permissions?.join(', ') || '—'}</Descriptions.Item>
        </Descriptions>
      </Card>
      <UserFormModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        editUser={user}
        onSuccess={load}
      />
    </div>
  );
};
export default UserDetail;

