import React, { useEffect, useState } from 'react';
import { Card, Spin, Statistic, Row, Col, Table } from 'antd';
import ReactApexChart from 'react-apexcharts';
import MedianApi from 'services/MedianApi';

const defaultFrom = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
};
const defaultTo = () => new Date().toISOString().slice(0, 10);

export const AdminSummary = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    MedianApi.adminSummary({ from: defaultFrom(), to: defaultTo() })
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '48px auto' }} />;

  const requests = summary?.requests ?? {};
  const jobs = summary?.jobs ?? {};
  const requestsData = requests.data ?? [];
  const jobsData = jobs.data ?? [];

  const lineOptions = {
    chart: { type: 'line', toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: requestsData.map(r => r.time_step || '') },
    colors: ['#3e82f7', '#e74c3c'],
    dataLabels: { enabled: false },
  };
  const lineSeries = [
    { name: 'Всього', data: requestsData.map(r => r.all || 0) },
    { name: 'Помилки', data: requestsData.map(r => r.error || 0) },
  ];

  const barOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    xaxis: { categories: jobsData.map(j => j.name || '') },
    colors: ['#52c41a'],
    dataLabels: { enabled: true },
  };
  const barSeries = [{ name: 'Jobs', data: jobsData.map(j => j.count || 0) }];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card className="card-elevated">
            <Statistic title="Запити (за період)" value={requests.count ?? 0} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="card-elevated">
            <Statistic title="Jobs (за період)" value={jobs.count ?? 0} />
          </Card>
        </Col>
      </Row>

      {requestsData.length > 0 && (
        <Card title="Графік запитів по часу" className="card-elevated" style={{ marginBottom: 24 }}>
          <ReactApexChart options={lineOptions} series={lineSeries} type="line" height={300} />
        </Card>
      )}

      {jobsData.length > 0 && (
        <Card title="Jobs по чергах" className="card-elevated" style={{ marginBottom: 24 }}>
          <ReactApexChart options={barOptions} series={barSeries} type="bar" height={Math.max(200, jobsData.length * 36)} />
        </Card>
      )}

      {jobsData.length > 0 && (
        <Card title="Таблиця по чергах" className="card-elevated">
          <Table
            size="small"
            rowKey="name"
            dataSource={jobsData}
            columns={[
              { title: 'Черга', dataIndex: 'name', key: 'name' },
              { title: 'Всього', dataIndex: 'count', key: 'count', width: 100 },
            ]}
            pagination={false}
          />
        </Card>
      )}
    </div>
  );
};
export default AdminSummary;
