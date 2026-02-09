import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Spin } from 'antd';
import MedianApi from 'services/MedianApi';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

export const TikTokIntegrations = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const type = 'tiktok';

  useEffect(() => {
    setLoading(true);
    MedianApi.integrationsTiktok({ page, per_page: 20 })
      .then(res => setData({
        data: Array.isArray(res?.data) ? res.data : [],
        total: res?.total ?? 0,
      }))
      .catch(() => setData({ data: [], total: 0 }))
      .finally(() => setLoading(false));
  }, [page]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Назва', dataIndex: 'name', key: 'name' },
  ];

  return (
    <Card title="TikTok Events (з БД)">
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data.data}
          onRow={record => ({ style: { cursor: 'pointer' }, onClick: () => navigate(`${APP_PREFIX_PATH}/integrations/${type}/${record.id}`) })}
          pagination={{
            total: data.total,
            pageSize: 20,
            current: page,
            onChange: setPage,
          }}
        />
      </Spin>
    </Card>
  );
};
export default TikTokIntegrations;
