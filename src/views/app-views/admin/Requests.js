import React, { useEffect, useState } from 'react';
import { Card, Table, Spin } from 'antd';
import MedianApi from 'services/MedianApi';

const defaultFrom = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
};
const defaultTo = () => new Date().toISOString().slice(0, 10);

export const AdminRequests = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ data: [], total: 0 });
  const [page, setPage] = useState(1);

  const load = (pageNum = 1) => {
    setLoading(true);
    MedianApi.adminRequests({
      from: defaultFrom(),
      to: defaultTo(),
      page: pageNum,
      per_page: 50,
    })
      .then(res => setData({
        data: res?.data ?? [],
        total: res?.total ?? 0,
      }))
      .catch(() => setData({ data: [], total: 0 }))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(page), [page]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 80 },
    { title: 'URL', dataIndex: 'url', key: 'url', ellipsis: true },
    { title: 'Метод', dataIndex: 'method', key: 'method', width: 80 },
    { title: 'Створено', dataIndex: 'created_at', key: 'created_at', width: 180 },
  ];

  return (
    <Card title="Запити (з БД)">
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
export default AdminRequests;
