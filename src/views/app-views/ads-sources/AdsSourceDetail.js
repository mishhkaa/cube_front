import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Descriptions, Button, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MedianApi from 'services/MedianApi';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { confirmDelete } from 'components/shared-components/ModalConfirmDelete';
import AdsSourceFormModal from './AdsSourceFormModal';

export const AdsSourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    MedianApi.adsSourceShow(id)
      .then(setItem)
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [id]);

  const handleDelete = () => {
    confirmDelete(async () => {
      await MedianApi.adsSourceDelete(id);
      navigate(`${APP_PREFIX_PATH}/ads-sources`);
    }, { content: `Джерело "${item?.name}" буде видалено.` });
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '48px auto' }} />;
  if (!item) return <Card title="Не знайдено"><Button onClick={() => navigate(`${APP_PREFIX_PATH}/ads-sources`)}>← Назад</Button></Card>;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(`${APP_PREFIX_PATH}/ads-sources`)}>Назад</Button>
        <Button type="primary" icon={<EditOutlined />} onClick={() => setEditModalVisible(true)}>Редагувати</Button>
        <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>Видалити</Button>
      </Space>
      <Card title={item.name || `Ads Source #${item.id}`} className="card-elevated">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="ID">{item.id}</Descriptions.Item>
          <Descriptions.Item label="Назва">{item.name || '—'}</Descriptions.Item>
          <Descriptions.Item label="Платформа">{item.platform || '—'}</Descriptions.Item>
        </Descriptions>
      </Card>
      <AdsSourceFormModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} editItem={item} onSuccess={load} />
    </div>
  );
};
export default AdsSourceDetail;

