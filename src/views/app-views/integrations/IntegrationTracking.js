import React, { useEffect, useState, useMemo } from 'react';
import { Card, Tabs, Checkbox, Select, DatePicker, Button, Space, Table, Spin, Typography } from 'antd';
import { BarChartOutlined, LineChartOutlined, UnorderedListOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import MedianApi from 'services/MedianApi';

const { RangePicker } = DatePicker;

const STATUS_OPTIONS = [
  { value: '', label: 'Всі статуси' },
  { value: 'new', label: 'Нові' },
  { value: 'processing', label: 'Виконується' },
  { value: 'done', label: 'OK' },
  { value: 'warning', label: 'Попередження' },
  { value: 'error', label: 'Помилка' },
];

const CHART_COLORS = ['#722ed1', '#fa8c16', '#eb2f96', '#13c2c2', '#faad14', '#52c41a', '#1890ff'];

const formatDate = (d) => (d && d.format ? d.format('YYYY-MM-DD') : (d ? dayjs(d).format('YYYY-MM-DD') : ''));

export const IntegrationTracking = ({ platform, integrationId }) => {
  const [dates, setDates] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [onlyFromAds, setOnlyFromAds] = useState(false);
  const [status, setStatus] = useState('');
  const [eventsList, setEventsList] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [tab, setTab] = useState('total');
  const [queryKey, setQueryKey] = useState(0);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [countByEvents, setCountByEvents] = useState([]);
  const [countByDays, setCountByDays] = useState([]);
  const [listData, setListData] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [listPage, setListPage] = useState(1);

  const params = useMemo(() => {
    const from = formatDate(dates[0]);
    const to = formatDate(dates[1]);
    return {
      from,
      to,
      onlyFromAds: onlyFromAds ? '1' : '',
      events: selectedEvents.length ? selectedEvents.join(',') : (eventsList.length ? eventsList.join(',') : ''),
      status: status || undefined,
    };
  }, [dates, onlyFromAds, status, selectedEvents, eventsList]);

  useEffect(() => {
    if (!platform || !integrationId) {
      setEventsLoading(false);
      return;
    }
    setEventsLoading(true);
    MedianApi.integrationEvents(platform, integrationId)
      .then((list) => {
        const arr = Array.isArray(list) ? list : [];
        setEventsList(arr);
        setSelectedEvents((prev) => (prev.length === 0 ? arr : prev));
      })
      .catch(() => setEventsList([]))
      .finally(() => setEventsLoading(false));
  }, [platform, integrationId]);

  const eventsParam = params.events;
  const hasEvents = !!eventsParam;

  useEffect(() => {
    if (!platform || !integrationId || !hasEvents) {
      setCountByEvents([]);
      setCountByDays([]);
      return;
    }
    setLoading(true);
    Promise.all([
      MedianApi.integrationEventsCountByEvents(platform, integrationId, params),
      tab === 'days' ? MedianApi.integrationEventsCountByDaysAndEvents(platform, integrationId, params) : Promise.resolve([]),
    ])
      .then(([byEvents, byDays]) => {
        setCountByEvents(Array.isArray(byEvents) ? byEvents : []);
        setCountByDays(Array.isArray(byDays) ? byDays : []);
      })
      .catch(() => {
        setCountByEvents([]);
        setCountByDays([]);
      })
      .finally(() => setLoading(false));
  }, [platform, integrationId, queryKey, hasEvents, tab, params.from, params.to, params.onlyFromAds, params.events, params.status]);

  useEffect(() => {
    if (!platform || !integrationId || !hasEvents || tab !== 'list') return;
    setLoadingList(true);
    MedianApi.integrationEventsList(platform, integrationId, {
      ...params,
      page: listPage,
      sort: 'created_at',
      direction: 'desc',
    })
      .then((res) => setListData({
        data: res?.data ?? [],
        total: res?.total ?? 0,
      }))
      .catch(() => setListData({ data: [], total: 0 }))
      .finally(() => setLoadingList(false));
  }, [platform, integrationId, queryKey, listPage, tab, hasEvents, params.from, params.to, params.onlyFromAds, params.events, params.status]);

  const refresh = () => setQueryKey((k) => k + 1);

  const eventOptions = eventsList.map((e) => ({ label: e, value: e }));
  const showOnlyFromAds = ['fb', 'tiktok', 'x'].includes(platform);

  const barSeries = [{ name: 'Кількість', data: countByEvents.map((r) => r.count) }];
  const barOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, distributed: true } },
    colors: CHART_COLORS,
    xaxis: { categories: countByEvents.map((r) => r.event) },
    dataLabels: { enabled: true },
    legend: { show: false },
    yaxis: { title: { text: 'Кількість' } },
  };

  const lineSeries = countByDays.length
    ? (eventsParam ? eventsParam.split(',') : []).map((event, i) => ({
        name: event,
        data: countByDays.map((d) => d[event] ?? 0),
      })).filter((s) => s.name)
    : [];
  const lineOptions = {
    chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: countByDays.map((d) => d.date) },
    colors: CHART_COLORS,
    dataLabels: { enabled: false },
    legend: { position: 'top' },
  };

  const listColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Подія', dataIndex: 'action', key: 'action', width: 120 },
    { title: 'Статус', dataIndex: 'status', key: 'status', width: 100 },
    { title: 'Повідомлення', dataIndex: 'message', key: 'message', ellipsis: true },
    { title: 'Створено', dataIndex: 'created_at', key: 'created_at', width: 170 },
  ];

  const hasEventsList = eventsList.length > 0;

  return (
    <Card title="Відстеження подій (статистика CAPI)" className="card-elevated" style={{ marginTop: 24 }}>
      {eventsLoading ? (
        <Spin tip="Завантаження подій..." />
      ) : !hasEventsList ? (
        <Typography.Paragraph type="secondary">
          Поки немає подій для цього пікселя. Статистика з’явиться після надсилання подій з сайту (з’єднайте скрипт і дочекайтесь подій).
        </Typography.Paragraph>
      ) : (
        <>
          <Space wrap style={{ marginBottom: 16 }} size="middle">
        {showOnlyFromAds && (
          <Checkbox checked={onlyFromAds} onChange={(e) => setOnlyFromAds(e.target.checked)}>
            Тільки з реклади
          </Checkbox>
        )}
        <Space>
          <Typography.Text type="secondary">Статус:</Typography.Text>
          <Select
            options={STATUS_OPTIONS}
            value={status || undefined}
            onChange={setStatus}
            style={{ width: 140 }}
            allowClear
            placeholder="Всі"
          />
        </Space>
        <Space>
          <Typography.Text type="secondary">Події:</Typography.Text>
          <Select
            mode="multiple"
            options={eventOptions}
            value={selectedEvents.length ? selectedEvents : eventsList}
            onChange={setSelectedEvents}
            style={{ minWidth: 200 }}
            placeholder="Оберіть події"
            maxTagCount="responsive"
          />
        </Space>
        <RangePicker
          value={dates}
          onChange={(range) => range && setDates([range[0], range[1]])}
          format="YYYY-MM-DD"
        />
            <Button icon={<ReloadOutlined />} onClick={refresh} />
          </Space>

          <Tabs
            activeKey={tab}
            onChange={setTab}
            items={[
              { key: 'total', label: 'Зведення', children: null },
              { key: 'days', label: 'Графік', children: null },
              { key: 'list', label: 'Список', children: null },
            ]}
          />

          {tab === 'total' && (
            <Spin spinning={loading}>
              {!hasEvents ? (
                <Typography.Text type="secondary">Оберіть події та діапазон дат.</Typography.Text>
              ) : countByEvents.length === 0 ? (
                <Typography.Text type="secondary">Немає даних за обраний період.</Typography.Text>
              ) : (
                <>
                  <Typography.Text type="secondary">Кількість ({countByEvents.reduce((s, r) => s + r.count, 0)})</Typography.Text>
                  <div style={{ marginTop: 8 }}>
                    <ReactApexChart options={barOptions} series={barSeries} type="bar" height={300} />
                  </div>
                </>
              )}
            </Spin>
          )}

          {tab === 'days' && (
            <Spin spinning={loading}>
              {!hasEvents ? (
                <Typography.Text type="secondary">Оберіть події та діапазон дат.</Typography.Text>
              ) : countByDays.length === 0 ? (
                <Typography.Text type="secondary">Немає даних за обраний період.</Typography.Text>
              ) : (
                <ReactApexChart options={lineOptions} series={lineSeries} type="line" height={300} />
              )}
            </Spin>
          )}

          {tab === 'list' && (
            <Spin spinning={loadingList}>
              {!hasEvents ? (
                <Typography.Text type="secondary">Оберіть події та діапазон дат.</Typography.Text>
              ) : (
                <Table
                  rowKey="id"
                  size="small"
                  columns={listColumns}
                  dataSource={listData.data}
                  pagination={{
                    total: listData.total,
                    current: listPage,
                    pageSize: 35,
                    onChange: setListPage,
                    showSizeChanger: false,
                  }}
                />
              )}
            </Spin>
          )}
        </>
      )}
    </Card>
  );
};
export default IntegrationTracking;
