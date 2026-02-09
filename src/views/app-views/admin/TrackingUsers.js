import React, { useEffect, useState } from 'react';
import { Card, Table, Spin, Input, Space, Tag, Typography } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import MedianApi from 'services/MedianApi';

const { Text } = Typography;

export const TrackingUsers = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ data: [], total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setLoading(true);
    MedianApi.adminTrackingUsers({ page, per_page: 30, search: search || undefined })
      .then(res => setData({
        data: res?.data ?? [],
        total: res?.total ?? 0,
      }))
      .catch(() => setData({ data: [], total: 0 }))
      .finally(() => setLoading(false));
  }, [page, search]);

  const onSearch = () => setSearch(searchInput.trim());

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      ellipsis: true,
      render: (id) => <Text copyable code style={{ fontSize: 12 }}>{id}</Text>,
    },
    {
      title: 'Інтеграції',
      dataIndex: 'integrations',
      key: 'integrations',
      width: 220,
      render: (integrations) => (
        Array.isArray(integrations) && integrations.length > 0
          ? <Space wrap size={[4, 4]}>{integrations.map((name, i) => <Tag key={i}>{name}</Tag>)}</Space>
          : <Text type="secondary">—</Text>
      ),
    },
    { title: 'Створено', dataIndex: 'created_at', key: 'created_at', width: 170 },
    { title: 'Оновлено', dataIndex: 'updated_at', key: 'updated_at', width: 170 },
  ];

  return (
    <Card
      title={
        <Space>
          <UserOutlined />
          Відстежувані користувачі
        </Space>
      }
      extra={
        <Input.Search
          placeholder="Пошук по ID або даних (data)..."
          allowClear
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onSearch={onSearch}
          onPressEnter={onSearch}
          style={{ width: 280 }}
          enterButton={<SearchOutlined />}
        />
      }
    >
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data.data}
          pagination={{
            total: data.total,
            pageSize: 30,
            current: page,
            onChange: setPage,
            showSizeChanger: false,
            showTotal: (total) => `Всього: ${total}`,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '8px 0', background: 'var(--color-fill-quaternary)' }}>
                <Text strong>Дані (data):</Text>
                <pre style={{ margin: '8px 0 0', fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {record.data && typeof record.data === 'object'
                    ? JSON.stringify(record.data, null, 2)
                    : (record.data ?? '—')}
                </pre>
              </div>
            ),
            rowExpandable: (record) => record.data && Object.keys(record.data || {}).length > 0,
          }}
        />
      </Spin>
    </Card>
  );
};
export default TrackingUsers;
