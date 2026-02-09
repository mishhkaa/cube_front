import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Spin, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MedianApi from 'services/MedianApi';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { confirmDelete } from 'components/shared-components/ModalConfirmDelete';
import UserFormModal from './UserFormModal';

export const UsersList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const load = (p = page) => {
    setLoading(true);
    MedianApi.users({ per_page: 20, page: p })
      .then(res => setData({
        data: Array.isArray(res?.data) ? res.data : [],
        total: res?.total ?? 0,
      }))
      .catch(() => setData({ data: [], total: 0 }))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [page]);

  const handleDelete = (record, e) => {
    e?.stopPropagation?.();
    confirmDelete(async () => {
      await MedianApi.userDelete(record.id);
      load(1);
      if (page !== 1) setPage(1);
    }, { title: 'Видалити користувача?', content: `Користувач ${record.name || record.email} буде видалений.` });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: "Ім'я", dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space onClick={e => e.stopPropagation()}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditUser(record); setModalVisible(true); }} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={e => handleDelete(record, e)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Користувачі"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditUser(null); setModalVisible(true); }}>
            Додати
          </Button>
        }
      >
        <Spin spinning={loading}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data.data}
            onRow={record => ({ style: { cursor: 'pointer' }, onClick: () => navigate(`${APP_PREFIX_PATH}/users/${record.id}`) })}
            pagination={{
              total: data.total,
              pageSize: 20,
              current: page,
              onChange: setPage,
            }}
          />
        </Spin>
      </Card>
      <UserFormModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditUser(null); }}
        editUser={editUser}
        onSuccess={() => { load(1); if (page !== 1) setPage(1); }}
      />
    </>
  );
};
export default UsersList;
