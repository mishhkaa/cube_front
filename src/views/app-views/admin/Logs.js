import React, { useEffect, useState } from 'react';
import { Card, Spin, Select, Typography } from 'antd';
import MedianApi from 'services/MedianApi';

const { Paragraph } = Typography;

export const AdminLogs = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState({ files: [], file: '', content: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    MedianApi.adminLogs()
      .then(setLogs)
      .catch(() => setLogs({ files: [], file: '', content: '' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedFile || !logs.files?.length) return;
    MedianApi.adminLogs({ file: selectedFile })
      .then(res => setLogs(prev => ({ ...prev, ...res })))
      .catch(() => {});
  }, [selectedFile]);

  const options = (logs.files || []).map(f => ({ value: f.value, label: f.label }));

  return (
    <Card title="Логи (з сервера)">
      <Spin spinning={loading}>
        {options.length > 0 && (
          <Select
            style={{ width: 320, marginBottom: 16 }}
            placeholder="Оберіть файл"
            options={options}
            value={selectedFile || logs.file}
            onChange={setSelectedFile}
          />
        )}
        <Paragraph style={{ background: '#f5f5f5', padding: 16, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>
          {logs.content || 'Немає вмісту'}
        </Paragraph>
      </Spin>
    </Card>
  );
};
export default AdminLogs;
