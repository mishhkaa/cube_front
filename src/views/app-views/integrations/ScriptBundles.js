import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Spin, Button, Space, Tag, Typography, Modal, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, LinkOutlined, BarChartOutlined } from '@ant-design/icons';
import MedianApi from 'services/MedianApi';
import { APP_PREFIX_PATH, API_BASE_URL } from 'configs/AppConfig';
import { confirmDelete } from 'components/shared-components/ModalConfirmDelete';
import ScriptBundleFormModal from './ScriptBundleFormModal';

const INTEGRATION_LINKS = {
  facebookPixel: { path: 'fb-capi', label: 'Facebook CAPI' },
  googleAdsAccount: { path: 'gads-conversions', label: 'Google Ads' },
  googleSheetAccount: { path: 'google-sheets', label: 'Google Sheets' },
  xPixel: { path: 'x', label: 'X' },
  tikTokPixel: { path: 'tiktok', label: 'TikTok' },
};

const UTM_LABELS = { default: 'Звичайний', 'first-last': 'First Last' };

const scriptBase = (API_BASE_URL || '').replace(/\/api\/?$/, '');

export const ScriptBundles = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [connectionItem, setConnectionItem] = useState(null);
  const [jsContent, setJsContent] = useState('');
  const [eventsCountByPlatform, setEventsCountByPlatform] = useState({});
  const [statsLoading, setStatsLoading] = useState(false);

  const load = (p = page) => {
    setLoading(true);
    MedianApi.integrationsScriptBundles({ page: p, per_page: 20 })
      .then((res) =>
        setData({
          data: Array.isArray(res?.data) ? res.data : [],
          total: res?.total ?? 0,
        })
      )
      .catch(() => setData({ data: [], total: 0 }))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [page]);

  useEffect(() => {
    if (connectionItem) {
      MedianApi.integrationScriptBundlesJsContent()
        .then((r) => setJsContent(r?.data || ''))
        .catch(() => setJsContent(''));
    }
  }, [connectionItem]);

  useEffect(() => {
    setStatsLoading(true);
    Promise.all([
      MedianApi.integrationEventsCount('fb').catch(() => ({})),
      MedianApi.integrationEventsCount('tiktok').catch(() => ({})),
      MedianApi.integrationEventsCount('x').catch(() => ({})),
      MedianApi.integrationEventsCount('gads').catch(() => ({})),
    ])
      .then(([fb, tiktok, x, gads]) =>
        setEventsCountByPlatform({
          fb: fb || {},
          tiktok: tiktok || {},
          x: x || {},
          gads: gads || {},
        })
      )
      .catch(() => setEventsCountByPlatform({}))
      .finally(() => setStatsLoading(false));
  }, []);

  const handleRefreshScript = (record, e) => {
    e?.stopPropagation?.();
    MedianApi.integrationScriptBundlesStore({}, record.id).then(() => load());
  };

  const handleDelete = (record, e) => {
    e?.stopPropagation?.();
    confirmDelete(
      async () => {
        await MedianApi.integrationScriptBundlesDelete(record.id);
        load(1);
        if (page !== 1) setPage(1);
      },
      { content: 'Ви дійсно хочете видалити цей бандл?' }
    );
  };

  const integrationsColumn = (integrations) => {
    if (!integrations || typeof integrations !== 'object') return '—';
    return (
      <Space wrap size={[4, 4]}>
        {Object.entries(integrations).map(([key, id]) => {
          const link = INTEGRATION_LINKS[key];
          if (!link || id == null) return <Tag key={key}>{key}</Tag>;
          return (
            <Tag key={key}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`${APP_PREFIX_PATH}/integrations/${link.path}/${id}`);
                }}
              >
                {link.label} #{id}
              </a>
            </Tag>
          );
        })}
      </Space>
    );
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    {
      title: 'Назва',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Typography.Text style={record.active ? {} : { color: 'var(--color-error)' }}>
          {name || '—'}
          {!record.active && ' (не активний)'}
        </Typography.Text>
      ),
    },
    { title: 'Інтеграції', dataIndex: 'integrations', key: 'integrations', render: integrationsColumn },
    {
      title: 'UTM',
      dataIndex: 'utm',
      key: 'utm',
      width: 120,
      render: (v) => UTM_LABELS[v] || '—',
    },
    {
      title: '',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            title="Оновити скрипт"
            onClick={(e) => handleRefreshScript(record, e)}
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditItem(record);
              setModalVisible(true);
            }}
          />
          <Button
            type="text"
            size="small"
            icon={<LinkOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setConnectionItem(record);
            }}
          >
            Підключення
          </Button>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={(e) => handleDelete(record, e)} />
        </Space>
      ),
    },
  ];

  const scriptUrl = connectionItem && scriptBase ? `${scriptBase}/partners/js/bundle-${connectionItem.id}.js` : '';
  const callbackUrl = connectionItem && scriptBase ? `${scriptBase}/partners/callback/${connectionItem.id}` : '';
  const snippet = jsContent && connectionItem ? jsContent.replace('id', String(connectionItem.id)) : '';

  const totalEvents = (obj) => (obj && typeof obj === 'object' ? Object.values(obj).reduce((a, b) => a + (b || 0), 0) : 0);

  return (
    <>
      {Object.keys(eventsCountByPlatform).length > 0 && (
        <Card
          title={
            <Space>
              <BarChartOutlined />
              Статистика по CAPI (події по платформах)
            </Space>
          }
          className="card-elevated"
          style={{ marginBottom: 24 }}
        >
          <Spin spinning={statsLoading}>
            <Space wrap size="middle">
              <Typography.Text strong>Facebook CAPI:</Typography.Text>
              <Typography.Text>{totalEvents(eventsCountByPlatform.fb)} подій</Typography.Text>
              <Typography.Text type="secondary">|</Typography.Text>
              <Typography.Text strong>TikTok:</Typography.Text>
              <Typography.Text>{totalEvents(eventsCountByPlatform.tiktok)} подій</Typography.Text>
              <Typography.Text type="secondary">|</Typography.Text>
              <Typography.Text strong>X (Twitter):</Typography.Text>
              <Typography.Text>{totalEvents(eventsCountByPlatform.x)} подій</Typography.Text>
              <Typography.Text type="secondary">|</Typography.Text>
              <Typography.Text strong>Google Ads:</Typography.Text>
              <Typography.Text>{totalEvents(eventsCountByPlatform.gads)} подій</Typography.Text>
            </Space>
          </Spin>
        </Card>
      )}

      <Card
        title={`Бандли скриптів інтеграцій (${data.total})`}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditItem(null);
              setModalVisible(true);
            }}
          >
            Додати
          </Button>
        }
      >
        <Spin spinning={loading}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data.data}
            onRow={(record) => ({
              style: { cursor: 'pointer' },
              onClick: () => navigate(`${APP_PREFIX_PATH}/integrations/script-bundles/${record.id}`),
            })}
            pagination={{
              total: data.total,
              pageSize: 20,
              current: page,
              onChange: setPage,
            }}
          />
        </Spin>
      </Card>

      <ScriptBundleFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditItem(null);
        }}
        editItem={editItem}
        onSuccess={() => {
          load(1);
          if (page !== 1) setPage(1);
        }}
      />

      <Modal
        open={!!connectionItem}
        onCancel={() => setConnectionItem(null)}
        title="Підключення інтеграції"
        footer={null}
        width={560}
      >
        {connectionItem && (
          <>
            <p>Розмістити скрипт в блоці head:</p>
            <Typography.Link href={scriptUrl} target="_blank" rel="noopener noreferrer">
              {scriptUrl}
            </Typography.Link>
            <Input.TextArea
              readOnly
              value={snippet || (scriptUrl ? `<script src="${scriptUrl}"></script>` : '')}
              rows={3}
              style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 12 }}
            />
            <p style={{ marginTop: 16 }}>Postback/Webhook відправляти на посилання:</p>
            <Input.TextArea readOnly value={callbackUrl} rows={1} style={{ fontFamily: 'monospace', fontSize: 12 }} />
          </>
        )}
      </Modal>
    </>
  );
};
export default ScriptBundles;
