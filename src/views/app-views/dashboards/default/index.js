import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Spin, List, Typography, Row, Col, Statistic, Button, Space, Table } from 'antd';
import { UserOutlined, BellOutlined, ApiOutlined, ThunderboltOutlined, PlusOutlined, LinkOutlined, FundOutlined, GlobalOutlined, LaptopOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import MedianApi from 'services/MedianApi';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

const { Text } = Typography;

const COUNTRY_NAMES = {
  UA: 'Україна', US: 'США', DE: 'Німеччина', PL: 'Польща', GB: 'Велика Британія',
  FR: 'Франція', NL: 'Нідерланди', CA: 'Канада', IT: 'Італія', ES: 'Іспанія', CZ: 'Чехія',
};
const getCountryName = (code) => COUNTRY_NAMES[code] || code;

const defaultFrom = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
};
const defaultTo = () => new Date().toISOString().slice(0, 10);

export const DefaultDashboard = () => {
  const user = useSelector(state => state.auth.user);
  const [notices, setNotices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [integrationCounts, setIntegrationCounts] = useState(null);
  const [requestsByIp, setRequestsByIp] = useState([]);
  const [requestsByCountry, setRequestsByCountry] = useState([]);
  const [loading, setLoading] = useState(true);

  const from = defaultFrom();
  const to = defaultTo();

  useEffect(() => {
    Promise.all([
      MedianApi.lastNotices().then(res => Array.isArray(res) ? res : []).catch(() => []),
      MedianApi.adminSummary({ from, to }).catch(() => null),
      Promise.all([
        MedianApi.integrationsFbCapi({ per_page: 1 }).then(r => r?.total ?? 0),
        MedianApi.integrationsTiktok({ per_page: 1 }).then(r => r?.total ?? 0),
        MedianApi.integrationsX({ per_page: 1 }).then(r => r?.total ?? 0),
        MedianApi.adsSources({ per_page: 1 }).then(r => r?.total ?? 0),
        MedianApi.users({ per_page: 1 }).then(r => r?.total ?? 0),
      ]).then(([fb, tiktok, x, ads, users]) => ({
        fbCapi: fb, tiktok, x, adsSources: ads, users,
        total: fb + tiktok + x + ads + users,
      })).catch(() => null),
      MedianApi.adminRequestsByIp({ from, to }).then(res => Array.isArray(res) ? res : []).catch(() => []),
      MedianApi.adminRequestsByCountry({ from, to }).then(res => Array.isArray(res) ? res : []).catch(() => []),
    ]).then(([n, s, counts, byIp, byCountry]) => {
      setNotices(n);
      setSummary(s);
      setIntegrationCounts(counts);
      setRequestsByIp(byIp);
      setRequestsByCountry(byCountry);
    }).finally(() => setLoading(false));
  }, []);

  const requestsData = summary?.requests?.data ?? [];
  const chartOptions = {
    chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
    xaxis: { categories: requestsData.map(r => r.time_step || '') },
    colors: ['#3e82f7'],
    dataLabels: { enabled: false },
  };
  const chartSeries = [{ name: 'Запити', data: requestsData.map(r => r.all || 0) }];

  return (
    <>
      <Card title="Швидкі дії" className="card-elevated" style={{ marginBottom: 24 }}>
        <Space wrap>
          <Link to={`${APP_PREFIX_PATH}/users`}>
            <Button type="primary" icon={<PlusOutlined />}>Додати користувача</Button>
          </Link>
          <Link to={`${APP_PREFIX_PATH}/ads-sources`}>
            <Button icon={<LinkOutlined />}>Джерела даних (Ads Sources)</Button>
          </Link>
          <Link to={`${APP_PREFIX_PATH}/integrations/fb-capi`}>
            <Button icon={<ApiOutlined />}>Facebook CAPI</Button>
          </Link>
          <Link to={`${APP_PREFIX_PATH}/integrations/tiktok`}>
            <Button icon={<ApiOutlined />}>TikTok Events</Button>
          </Link>
          <Link to={`${APP_PREFIX_PATH}/integrations/x`}>
            <Button icon={<ApiOutlined />}>X Conversions</Button>
          </Link>
        </Space>
      </Card>

      {(integrationCounts && integrationCounts.total > 0) && (
        <Card title="Активні інтеграції та ресурси" className="card-elevated" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 8]}>
            <Col span={8}><Statistic title="Користувачі" value={integrationCounts.users} /></Col>
            <Col span={8}><Statistic title="Ads Sources" value={integrationCounts.adsSources} /></Col>
            <Col span={8}><Statistic title="FB CAPI пікселі" value={integrationCounts.fbCapi} /></Col>
            <Col span={8}><Statistic title="TikTok" value={integrationCounts.tiktok} /></Col>
            <Col span={8}><Statistic title="X (Twitter)" value={integrationCounts.x} /></Col>
            <Col span={8}><Statistic title="Всього записів" value={integrationCounts.total} prefix={<FundOutlined />} /></Col>
          </Row>
        </Card>
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-elevated" loading={loading}>
            <Statistic title="Запити (7 днів)" value={summary?.requests?.count ?? 0} prefix={<ApiOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-elevated" loading={loading}>
            <Statistic title="Jobs (7 днів)" value={summary?.jobs?.count ?? 0} prefix={<ThunderboltOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-elevated">
            <Statistic title="Сповіщення" value={notices.length} prefix={<BellOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-elevated">
            {user ? (
              <Statistic title="Ви увійшли як" value={user.name || user.email} valueStyle={{ fontSize: 16 }} prefix={<UserOutlined />} />
            ) : (
              <Statistic title="Гість" value="—" />
            )}
          </Card>
        </Col>
      </Row>

      {requestsData.length > 0 && (
        <Card title="Запити по часу (останні 7 днів)" className="card-elevated" style={{ marginBottom: 24 }}>
          <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={280} />
        </Card>
      )}

      <Card title="Останні сповіщення" className="card-elevated">
        <Spin spinning={loading}>
          {notices.length === 0 && !loading && <p style={{ color: 'var(--color-text-secondary)' }}>Немає сповіщень.</p>}
          {notices.length > 0 && (
            <List
              dataSource={notices.slice(0, 5)}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name || item.type || '—'}
                    description={<><Text type="secondary">ID: {item.id}</Text> {item.created_at && <>, {item.created_at}</>}</>}
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={<><LaptopOutlined /> Топ IP-адреси (запити за період)</>} className="card-elevated">
            <Spin spinning={loading}>
              {requestsByIp.length === 0 && !loading && <Text type="secondary">Немає даних по IP.</Text>}
              {requestsByIp.length > 0 && (
                <Table
                  size="small"
                  rowKey="ip"
                  dataSource={requestsByIp}
                  columns={[
                    { title: 'IP', dataIndex: 'ip', key: 'ip', render: (v) => <Text copyable code>{v}</Text> },
                    { title: 'Запитів', dataIndex: 'count', key: 'count', width: 100 },
                  ]}
                  pagination={{ pageSize: 10, hideOnSinglePage: true }}
                />
              )}
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><GlobalOutlined /> Трафік по країнах (орієнтовно)</>} className="card-elevated">
            <Spin spinning={loading}>
              {requestsByCountry.length === 0 && !loading && <Text type="secondary">Немає даних по країнах. Підключіть GeoIP для реального розподілу.</Text>}
              {requestsByCountry.length > 0 && (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <ReactApexChart
                      options={{
                        chart: { type: 'donut' },
                        labels: requestsByCountry.map(r => getCountryName(r.country)),
                        colors: ['#722ed1', '#fa8c16', '#eb2f96', '#13c2c2', '#52c41a', '#1890ff', '#faad14'],
                        legend: { position: 'bottom' },
                        dataLabels: { enabled: true },
                      }}
                      series={requestsByCountry.map(r => r.count)}
                      type="donut"
                      height={220}
                    />
                  </div>
                  <Table
                    size="small"
                    rowKey="country"
                    dataSource={requestsByCountry}
                    columns={[
                      { title: 'Країна', dataIndex: 'country', key: 'country', render: (c) => getCountryName(c) },
                      { title: 'Запитів', dataIndex: 'count', key: 'count', width: 90 },
                    ]}
                    pagination={false}
                  />
                </>
              )}
            </Spin>
          </Card>
        </Col>
      </Row>

      {requestsByCountry.length > 0 && (
        <Card title="Географія запитів — за країнами" className="card-elevated" style={{ marginTop: 24 }}>
          <ReactApexChart
            options={{
              chart: { type: 'bar', toolbar: { show: false } },
              plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
              xaxis: { categories: requestsByCountry.map(r => getCountryName(r.country)), title: { text: 'Запитів' } },
              yaxis: { labels: { maxWidth: 120 } },
              colors: ['#1890ff'],
              dataLabels: { enabled: true },
            }}
            series={[{ name: 'Запити', data: requestsByCountry.map(r => r.count) }]}
            type="bar"
            height={Math.max(200, requestsByCountry.length * 36)}
          />
        </Card>
      )}
    </>
  );
};

export default DefaultDashboard;
