/**
 * Клієнт до Laravel API (логіка з frontend-app).
 * Базовий URL та credentials налаштовані в FetchInterceptor.
 */
import fetch from 'auth/FetchInterceptor';

const api = (method, url, options = {}) =>
  fetch({
    url: url.startsWith('/api') ? url : `/api/${url}`,
    method,
    ...options,
  });

const MedianApi = {
  get: (url, params) => api('get', url, { params }),
  post: (url, data) => api('post', url, { data }),
  put: (url, data) => api('put', url, { data }),
  delete: (url) => api('delete', url),

  // Auth (також в AuthService)
  user: () => api('get', '/api/user'),
  logout: () => api('get', '/api/logout'),

  // Admin
  adminSummary: (params) => api('get', '/api/admin', { params }),
  adminRequests: (params) => api('get', '/api/admin/requests', { params }),
  adminJobs: (params) => api('get', '/api/admin/jobs', { params }),
  adminLogs: (params) => api('get', '/api/admin/logs', { params }),
  adminTrackingUsers: (params) => api('get', '/api/admin/tracking-users', { params }),
  adminRequestsByIp: (params) => api('get', '/api/admin/requests-by-ip', { params }),
  adminRequestsByCountry: (params) => api('get', '/api/admin/requests-by-country', { params }),

  // Dashboard
  lastNotices: () => api('get', '/api/dashboard/last-notices'),

  // Users
  users: (params) => api('get', '/api/users', { params }),
  userShow: (id) => api('get', `/api/users/${id}`),
  userStore: (data) => api('post', '/api/users', { data }),
  userUpdate: (id, data) => api('put', `/api/users/${id}`, { data }),
  userDelete: (id) => api('delete', `/api/users/${id}`),
  usersAll: () => api('get', '/api/users/all'),

  // Ads Sources
  adsSources: (params) => api('get', '/api/ads-sources', { params }),
  adsSourceShow: (id) => api('get', `/api/ads-sources/${id}`),
  adsSourceStore: (data) => api('post', '/api/ads-sources', { data }),
  adsSourceUpdate: (id, data) => api('put', `/api/ads-sources/${id}`, { data }),
  adsSourceDelete: (id) => api('delete', `/api/ads-sources/${id}`),

  // Integrations — fb-capi
  integrationsFbCapi: (params) => api('get', '/api/integrations/fb-capi', { params }),
  integrationFbCapiShow: (id) => api('get', `/api/integrations/fb-capi/${id}`),
  integrationFbCapiStore: (data) => api('post', '/api/integrations/fb-capi', { data }),
  integrationFbCapiUpdate: (id, data) => api('put', `/api/integrations/fb-capi/${id}`, { data }),
  integrationFbCapiDelete: (id) => api('delete', `/api/integrations/fb-capi/${id}`),
  // tiktok
  integrationsTiktok: (params) => api('get', '/api/integrations/tiktok', { params }),
  integrationTiktokShow: (id) => api('get', `/api/integrations/tiktok/${id}`),
  integrationTiktokStore: (data) => api('post', '/api/integrations/tiktok', { data }),
  integrationTiktokUpdate: (id, data) => api('put', `/api/integrations/tiktok/${id}`, { data }),
  integrationTiktokDelete: (id) => api('delete', `/api/integrations/tiktok/${id}`),
  // x
  integrationsX: (params) => api('get', '/api/integrations/x', { params }),
  integrationXShow: (id) => api('get', `/api/integrations/x/${id}`),
  integrationXStore: (data) => api('post', '/api/integrations/x', { data }),
  integrationXUpdate: (id, data) => api('put', `/api/integrations/x/${id}`, { data }),
  integrationXDelete: (id) => api('delete', `/api/integrations/x/${id}`),
  // gads-conversions
  integrationsGadsConversions: (params) => api('get', '/api/integrations/gads-conversions', { params }),
  integrationGadsConversionsShow: (id) => api('get', `/api/integrations/gads-conversions/${id}`),
  integrationGadsConversionsStore: (data) => api('post', '/api/integrations/gads-conversions', { data }),
  integrationGadsConversionsUpdate: (id, data) => api('put', `/api/integrations/gads-conversions/${id}`, { data }),
  integrationGadsConversionsDelete: (id) => api('delete', `/api/integrations/gads-conversions/${id}`),
  // google-sheets
  integrationsGoogleSheets: (params) => api('get', '/api/integrations/google-sheets', { params }),
  integrationGoogleSheetsShow: (id) => api('get', `/api/integrations/google-sheets/${id}`),
  integrationGoogleSheetsStore: (data) => api('post', '/api/integrations/google-sheets', { data }),
  integrationGoogleSheetsUpdate: (id, data) => api('put', `/api/integrations/google-sheets/${id}`, { data }),
  integrationGoogleSheetsDelete: (id) => api('delete', `/api/integrations/google-sheets/${id}`),
  // script-bundles
  integrationsScriptBundles: (params) => api('get', '/api/integrations/script-bundles', { params }),
  integrationScriptBundlesShow: (id) => api('get', `/api/integrations/script-bundles/${id}`),
  integrationScriptBundlesStore: (data, id) => (id ? api('put', `/api/integrations/script-bundles/${id}`, { data }) : api('post', '/api/integrations/script-bundles', { data })),
  integrationScriptBundlesUpdate: (id, data) => api('put', `/api/integrations/script-bundles/${id}`, { data }),
  integrationScriptBundlesDelete: (id) => api('delete', `/api/integrations/script-bundles/${id}`),
  integrationScriptBundlesIntegrationsAccounts: () => api('get', '/api/integrations/script-bundles/integrations-accounts'),
  integrationScriptBundlesJsContent: () => api('get', '/api/integrations/script-bundles/js-content'),
  // events count per platform (pixel id -> count), for CAPI statistics
  integrationEventsCount: (platform) => api('get', `/api/integrations/events-${platform}`),
  // fb-ads-balances
  integrationsFbAdsBalances: (params) => api('get', '/api/integrations/fb-ads-balances', { params }),
  integrationFbAdsBalancesShow: (id) => api('get', `/api/integrations/fb-ads-balances/${id}`),
  integrationFbAdsBalancesStore: (data) => api('post', '/api/integrations/fb-ads-balances', { data }),
  integrationFbAdsBalancesUpdate: (id, data) => api('put', `/api/integrations/fb-ads-balances/${id}`, { data }),
  integrationFbAdsBalancesDelete: (id) => api('delete', `/api/integrations/fb-ads-balances/${id}`),
  // csd-projects
  integrationsCsdProjects: (params) => api('get', '/api/integrations/csd-projects', { params }),
  integrationCsdProjectsShow: (id) => api('get', `/api/integrations/csd-projects/${id}`),
  integrationCsdProjectsStore: (data) => api('post', '/api/integrations/csd-projects', { data }),
  integrationCsdProjectsUpdate: (id, data) => api('put', `/api/integrations/csd-projects/${id}`, { data }),
  integrationCsdProjectsDelete: (id) => api('delete', `/api/integrations/csd-projects/${id}`),

  // Events tracking (Meta/Google/TikTok/X) — platform: fb | gads | tiktok | x
  integrationEvents: (platform, id) => api('get', `/api/integrations/events-${platform}/${id}`),
  integrationEventsCountByEvents: (platform, id, params) =>
    api('get', `/api/integrations/events-${platform}/${id}/countByEvents`, { params }),
  integrationEventsCountByDaysAndEvents: (platform, id, params) =>
    api('get', `/api/integrations/events-${platform}/${id}/countByDaysAndEvents`, { params }),
  integrationEventsList: (platform, id, params) =>
    api('get', `/api/integrations/events-${platform}/${id}/list`, { params }),
};

export default MedianApi;
