import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Descriptions, Button, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MedianApi from 'services/MedianApi';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { confirmDelete } from 'components/shared-components/ModalConfirmDelete';
import FbCApiFormModal from './FbCApiFormModal';
import ScriptBundleFormModal from './ScriptBundleFormModal';
import IntegrationTracking from './IntegrationTracking';

const TYPE_TO_EVENTS_PLATFORM = {
  'fb-capi': 'fb',
  'gads-conversions': 'gads',
  'tiktok': 'tiktok',
  'x': 'x',
};

const ROUTES = {
  'fb-capi': {
    list: 'integrations/fb-capi',
    show: (id) => MedianApi.integrationFbCapiShow(id),
    delete: (id) => MedianApi.integrationFbCapiDelete(id),
    FormModal: FbCApiFormModal,
  },
  'tiktok': { list: 'integrations/tiktok', show: (id) => MedianApi.integrationTiktokShow(id), delete: (id) => MedianApi.integrationTiktokDelete(id) },
  'x': { list: 'integrations/x', show: (id) => MedianApi.integrationXShow(id), delete: (id) => MedianApi.integrationXDelete(id) },
  'gads-conversions': { list: 'integrations/gads-conversions', show: (id) => MedianApi.integrationGadsConversionsShow(id), delete: (id) => MedianApi.integrationGadsConversionsDelete(id) },
  'google-sheets': { list: 'integrations/google-sheets', show: (id) => MedianApi.integrationGoogleSheetsShow(id), delete: (id) => MedianApi.integrationGoogleSheetsDelete(id) },
  'script-bundles': { list: 'integrations/script-bundles', show: (id) => MedianApi.integrationScriptBundlesShow(id), delete: (id) => MedianApi.integrationScriptBundlesDelete(id), FormModal: ScriptBundleFormModal },
  'fb-ads-balances': { list: 'integrations/fb-ads-balances', show: (id) => MedianApi.integrationFbAdsBalancesShow(id), delete: (id) => MedianApi.integrationFbAdsBalancesDelete(id) },
  'fb-ads-balances-notices': { list: 'integrations/fb-ads-balances', show: (id) => MedianApi.integrationFbAdsBalancesShow(id), delete: (id) => MedianApi.integrationFbAdsBalancesDelete(id) },
  'csd-projects': { list: 'integrations/csd-projects', show: (id) => MedianApi.integrationCsdProjectsShow(id), delete: (id) => MedianApi.integrationCsdProjectsDelete(id) },
};

export const IntegrationDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const config = ROUTES[type];

  const load = () => {
    if (!id || !config?.show) return;
    setLoading(true);
    config.show(id)
      .then(setItem)
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [id, type]);

  const handleDelete = () => {
    if (!config?.delete) return;
    confirmDelete(async () => {
      await config.delete(id);
      navigate(`${APP_PREFIX_PATH}/${config.list}`);
    }, { content: `Запис "${item?.name || item?.id}" буде видалено.` });
  };

  const backPath = config ? `${APP_PREFIX_PATH}/${config.list}` : `${APP_PREFIX_PATH}/integrations`;
  const FormModal = config?.FormModal;

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '48px auto' }} />;
  if (!item) return <Card title="Не знайдено"><Button onClick={() => navigate(backPath)}>← Назад</Button></Card>;

  const entries = Object.entries(item).filter(([k]) => !['created_at', 'updated_at', 'access_token'].includes(k)).slice(0, 14);

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(backPath)}>Назад</Button>
        {FormModal && <Button type="primary" icon={<EditOutlined />} onClick={() => setEditModalVisible(true)}>Редагувати</Button>}
        {config?.delete && <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>Видалити</Button>}
      </Space>
      <Card title={item.name || `#${item.id}`} className="card-elevated">
        <Descriptions bordered column={1} size="small">
          {entries.map(([key, val]) => (
            <Descriptions.Item key={key} label={key}>
              {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '—')}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>
      {FormModal && (
        <FormModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          editItem={item}
          onSuccess={load}
        />
      )}
      {TYPE_TO_EVENTS_PLATFORM[type] && (
        <IntegrationTracking platform={TYPE_TO_EVENTS_PLATFORM[type]} integrationId={id} />
      )}
    </div>
  );
};
export default IntegrationDetail;
