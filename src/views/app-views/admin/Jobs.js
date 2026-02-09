import React, { useEffect, useState } from 'react';
import { Card, Table, Spin } from 'antd';
import MedianApi from 'services/MedianApi';

const defaultFrom = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
};
const defaultTo = () => new Date().toISOString().slice(0, 10);

export const AdminJobs = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ data: [], total: 0 });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    MedianApi.adminJobs({
      from: defaultFrom(),
      to: defaultTo(),
      page,
      per_page: 50,
    })
      .then(res => setData({
        data: res?.data ?? [],
        total: res?.total ?? 0,
      }))
      .catch(() => setData({ data: [], total: 0 }))
      .finally(() => setLoading(false));
  }, [page]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'Queue', dataIndex: 'queue', key: 'queue', width: 120 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
    { title: 'Створено', dataIndex: 'created_at', key: 'created_at', width: 180 },
  ];

  return (
    <Card title="Jobs (з БД)">
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={data.data}
          pagination={{
            total: data.total,
            pageSize: 50,
            current: page,
            onChange: setPage,
          }}
        />
      </Spin>
    </Card>
  );
};
export default AdminJobs;
