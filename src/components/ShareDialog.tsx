import { useState } from 'react';
import { Modal, Button } from 'antd';
import {
  LockOutlined,
  TeamOutlined,
  LinkOutlined,
  CheckOutlined,
} from '@ant-design/icons';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
}

const OPTIONS = [
  {
    key: 'private',
    icon: <LockOutlined />,
    title: 'Keep private',
    desc: 'Only you can see this conversation',
  },
  {
    key: 'team',
    icon: <TeamOutlined />,
    title: 'Share with your team',
    desc: 'Members of your organization can view this chat',
  },
  {
    key: 'public',
    icon: <LinkOutlined />,
    title: 'Create public link',
    desc: 'Anyone with the link can view this conversation',
  },
];

export default function ShareDialog({ open, onClose }: ShareDialogProps) {
  const [selected, setSelected] = useState('private');

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Share chat"
      className="share-dialog"
      width={480}
      centered
    >
      <div className="share-options">
        {OPTIONS.map((opt) => (
          <div
            key={opt.key}
            className={`share-option ${selected === opt.key ? 'selected' : ''}`}
            onClick={() => setSelected(opt.key)}
          >
            <div className="share-option-icon">{opt.icon}</div>
            <div className="share-option-body">
              <div className="share-option-title">{opt.title}</div>
              <div className="share-option-desc">{opt.desc}</div>
            </div>
            {selected === opt.key && (
              <CheckOutlined style={{ color: 'var(--accent)', marginTop: 8 }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" onClick={onClose}>
          {selected === 'public' ? 'Copy link' : 'Done'}
        </Button>
      </div>
    </Modal>
  );
}
