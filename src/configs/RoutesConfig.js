import React from 'react';
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig';

export const publicRoutes = [
  {
    key: 'login',
    path: `${AUTH_PREFIX_PATH}/login`,
    component: React.lazy(() => import('views/auth-views/authentication/login')),
    meta: { blankLayout: true },
  },
  {
    key: 'register',
    path: `${AUTH_PREFIX_PATH}/register`,
    component: React.lazy(() => import('views/auth-views/authentication/register')),
    meta: { blankLayout: true },
  },
  {
    key: 'forgot-password',
    path: `${AUTH_PREFIX_PATH}/forgot-password`,
    component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
    meta: { blankLayout: true },
  },
];

export const protectedRoutes = [
  {
    key: 'dashboard.default',
    path: `${APP_PREFIX_PATH}/dashboards/default`,
    component: React.lazy(() => import('views/app-views/dashboards/default')),
  },
  // Admin
  {
    key: 'admin',
    path: `${APP_PREFIX_PATH}/admin`,
    component: React.lazy(() => import('views/app-views/admin')),
  },
  {
    key: 'admin.logs',
    path: `${APP_PREFIX_PATH}/admin/logs`,
    component: React.lazy(() => import('views/app-views/admin/Logs')),
  },
  {
    key: 'admin.requests',
    path: `${APP_PREFIX_PATH}/admin/requests`,
    component: React.lazy(() => import('views/app-views/admin/Requests')),
  },
  {
    key: 'admin.jobs',
    path: `${APP_PREFIX_PATH}/admin/jobs`,
    component: React.lazy(() => import('views/app-views/admin/Jobs')),
  },
  {
    key: 'admin.tracking-users',
    path: `${APP_PREFIX_PATH}/admin/tracking-users`,
    component: React.lazy(() => import('views/app-views/admin/TrackingUsers')),
  },
  // Integrations
  {
    key: 'integrations.fb-capi',
    path: `${APP_PREFIX_PATH}/integrations/fb-capi`,
    component: React.lazy(() => import('views/app-views/integrations/FbCApi')),
  },
  {
    key: 'integrations.tiktok',
    path: `${APP_PREFIX_PATH}/integrations/tiktok`,
    component: React.lazy(() => import('views/app-views/integrations/TikTok')),
  },
  {
    key: 'integrations.gads-conversions',
    path: `${APP_PREFIX_PATH}/integrations/gads-conversions`,
    component: React.lazy(() => import('views/app-views/integrations/GAdsConversions')),
  },
  {
    key: 'integrations.x',
    path: `${APP_PREFIX_PATH}/integrations/x`,
    component: React.lazy(() => import('views/app-views/integrations/XConversions')),
  },
  {
    key: 'integrations.google-sheets',
    path: `${APP_PREFIX_PATH}/integrations/google-sheets`,
    component: React.lazy(() => import('views/app-views/integrations/GoogleSheets')),
  },
  {
    key: 'integrations.script-bundles',
    path: `${APP_PREFIX_PATH}/integrations/script-bundles`,
    component: React.lazy(() => import('views/app-views/integrations/ScriptBundles')),
  },
  {
    key: 'integrations.fb-ads-balances',
    path: `${APP_PREFIX_PATH}/integrations/fb-ads-balances-notices`,
    component: React.lazy(() => import('views/app-views/integrations/FbAdsBalances')),
  },
  {
    key: 'integrations.csd-projects',
    path: `${APP_PREFIX_PATH}/integrations/csd-projects`,
    component: React.lazy(() => import('views/app-views/integrations/CsdProjects')),
  },
  // Ads Sources & Users
  {
    key: 'ads-sources',
    path: `${APP_PREFIX_PATH}/ads-sources`,
    component: React.lazy(() => import('views/app-views/ads-sources')),
  },
  {
    key: 'ads-sources.detail',
    path: `${APP_PREFIX_PATH}/ads-sources/:id`,
    component: React.lazy(() => import('views/app-views/ads-sources/AdsSourceDetail')),
  },
  {
    key: 'users',
    path: `${APP_PREFIX_PATH}/users`,
    component: React.lazy(() => import('views/app-views/users')),
  },
  {
    key: 'users.detail',
    path: `${APP_PREFIX_PATH}/users/:id`,
    component: React.lazy(() => import('views/app-views/users/UserDetail')),
  },
  // Integration detail (type: fb-capi, tiktok, x, gads-conversions, google-sheets, csd-projects)
  {
    key: 'integrations.detail',
    path: `${APP_PREFIX_PATH}/integrations/:type/:id`,
    component: React.lazy(() => import('views/app-views/integrations/IntegrationDetail')),
  },
  // Settings
  {
    key: 'settings',
    path: `${APP_PREFIX_PATH}/settings`,
    component: React.lazy(() => import('views/app-views/settings')),
  },
];
