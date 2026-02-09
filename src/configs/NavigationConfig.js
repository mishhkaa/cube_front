import {
  DashboardOutlined,
  ApiOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  BellOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

const dashBoardNavTree = [{
  key: 'dashboards',
  path: `${APP_PREFIX_PATH}/dashboards`,
  title: 'Дашборд',
  icon: DashboardOutlined,
  breadcrumb: false,
  isGroupTitle: true,
  submenu: [
    {
      key: 'dashboards-default',
      path: `${APP_PREFIX_PATH}/dashboards/default`,
      title: 'Головна',
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: []
    }
  ]
}];

const adminNavTree = {
  key: 'admin',
  path: `${APP_PREFIX_PATH}/admin`,
  title: 'AdminTech',
  icon: SettingOutlined,
  breadcrumb: false,
  submenu: [
    { key: 'admin-index', path: `${APP_PREFIX_PATH}/admin`, title: 'Огляд', icon: DashboardOutlined, submenu: [] },
    { key: 'admin-logs', path: `${APP_PREFIX_PATH}/admin/logs`, title: 'Помилки', icon: FileTextOutlined, submenu: [] },
    { key: 'admin-requests', path: `${APP_PREFIX_PATH}/admin/requests`, title: 'Запити', icon: ApiOutlined, submenu: [] },
    { key: 'admin-jobs', path: `${APP_PREFIX_PATH}/admin/jobs`, title: 'Jobs', icon: ThunderboltOutlined, submenu: [] },
    { key: 'admin-tracking', path: `${APP_PREFIX_PATH}/admin/tracking-users`, title: 'Відстежувані користувачі', icon: TeamOutlined, submenu: [] },
  ]
};

const integrationsNavTree = {
  key: 'integrations',
  path: `${APP_PREFIX_PATH}/integrations`,
  title: 'Api Conversions',
  icon: ApiOutlined,
  breadcrumb: false,
  submenu: [
    { key: 'fb-capi', path: `${APP_PREFIX_PATH}/integrations/fb-capi`, title: 'Facebook Conversions', icon: ApiOutlined, submenu: [] },
    { key: 'tiktok', path: `${APP_PREFIX_PATH}/integrations/tiktok`, title: 'TikTok Events', icon: ApiOutlined, submenu: [] },
    { key: 'gads', path: `${APP_PREFIX_PATH}/integrations/gads-conversions`, title: 'Google Offline Conversions', icon: ApiOutlined, submenu: [] },
    { key: 'x', path: `${APP_PREFIX_PATH}/integrations/x`, title: 'Twitter (X) Conversions', icon: ApiOutlined, submenu: [] },
    { key: 'google-sheets', path: `${APP_PREFIX_PATH}/integrations/google-sheets`, title: 'Google Sheets', icon: FileTextOutlined, submenu: [] },
    { key: 'script-bundles', path: `${APP_PREFIX_PATH}/integrations/script-bundles`, title: 'Бандли скриптів', icon: FileTextOutlined, submenu: [] },
  ]
};

const notificationsNav = {
  key: 'notifications',
  path: `${APP_PREFIX_PATH}/integrations/fb-ads-balances-notices`,
  title: 'Notifications',
  icon: BellOutlined,
  breadcrumb: false,
  submenu: []
};

const csdNav = {
  key: 'csd',
  path: `${APP_PREFIX_PATH}/integrations/csd-projects`,
  title: 'Csd',
  icon: ProjectOutlined,
  breadcrumb: false,
  submenu: []
};

const adsSourcesNav = {
  key: 'ads-sources',
  path: `${APP_PREFIX_PATH}/ads-sources`,
  title: 'Ads Sources',
  icon: BarChartOutlined,
  breadcrumb: false,
  submenu: []
};

const usersNav = {
  key: 'users',
  path: `${APP_PREFIX_PATH}/users`,
  title: 'Користувачі',
  icon: TeamOutlined,
  breadcrumb: false,
  submenu: []
};

const settingsNav = {
  key: 'settings',
  path: `${APP_PREFIX_PATH}/settings`,
  title: 'Налаштування',
  icon: SettingOutlined,
  breadcrumb: false,
  submenu: []
};

const navigationConfig = [
  ...dashBoardNavTree,
  adminNavTree,
  integrationsNavTree,
  notificationsNav,
  csdNav,
  adsSourcesNav,
  usersNav,
  settingsNav,
];

export default navigationConfig;
