import React from 'react';
import { Card, Descriptions, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { onSwitchTheme, onLocaleChange } from 'store/slices/themeSlice';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

export const Settings = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.currentTheme);
  const locale = useSelector(state => state.theme.locale);

  return (
    <div>
      <Card title="Налаштування" className="card-elevated" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Тема">
            <Select
              value={theme}
              onChange={v => dispatch(onSwitchTheme(v))}
              style={{ width: 140 }}
              options={[
                { value: 'light', label: 'Світла' },
                { value: 'dark', label: 'Темна' },
              ]}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Мова інтерфейсу">
            <Select
              value={locale}
              onChange={v => dispatch(onLocaleChange(v))}
              style={{ width: 140 }}
              options={[
                { value: 'en', label: 'English' },
                { value: 'uk', label: 'Українська' },
              ]}
            />
          </Descriptions.Item>
          <Descriptions.Item label="API (бекенд)">
            {process.env.REACT_APP_API_URL || '—'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Розділи" className="card-elevated">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Усі розділи доступні з бічного меню: Дашборд, AdminTech, Api Conversions, Notifications, Csd, Ads Sources, Користувачі.
          Клік по рядку в таблиці відкриває деталі запису.
        </p>
      </Card>
    </div>
  );
};
export default Settings;
