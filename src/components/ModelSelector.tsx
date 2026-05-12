import { useState } from 'react';
import { Dropdown, Switch } from 'antd';
import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import { MODELS } from '../constants';
import type { ModelOption } from '../types';

interface ModelSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [thinking, setThinking] = useState(true);
  const current = MODELS.find((m) => m.id === value) || MODELS[1];

  const dropdownRender = () => (
    <div
      className="model-dropdown"
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      {MODELS.map((m: ModelOption) => (
        <div
          key={m.id}
          className={`model-option ${m.id === value ? 'selected' : ''}`}
          onClick={() => onChange(m.id)}
        >
          <div className="model-option-info">
            <div className="model-option-name">
              {m.name}
              {m.badge && <span className="model-badge">{m.badge}</span>}
            </div>
            <div className="model-option-desc">{m.description}</div>
          </div>
          {m.id === value && (
            <CheckOutlined style={{ color: 'var(--accent)' }} />
          )}
        </div>
      ))}
      <div className="model-divider" />
      <div className="thinking-row">
        <div>
          <div className="thinking-label">Adaptive thinking</div>
          <div className="thinking-desc">
            Use extended thinking when helpful
          </div>
        </div>
        <Switch
          checked={thinking}
          onChange={setThinking}
          size="small"
        />
      </div>
    </div>
  );

  return (
    <Dropdown
      trigger={['click']}
      placement="topLeft"
      dropdownRender={dropdownRender}
    >
      <button className="model-selector">
        <span>{current.name.replace('Claude ', '')}</span>
        <DownOutlined style={{ fontSize: 10 }} />
      </button>
    </Dropdown>
  );
}
