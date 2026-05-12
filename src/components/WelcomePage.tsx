import { useState } from 'react';
import { Input } from 'antd';
import {
  AudioOutlined,
  ArrowUpOutlined,
  BulbOutlined,
  CodeOutlined,
  EditOutlined,
  HeartOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import ModelSelector from './ModelSelector';
import PlusMenu from './PlusMenu';
import '../styles/welcome.css';

const { TextArea } = Input;

const QUICK_ACTIONS = [
  { key: 'create', icon: <ThunderboltOutlined />, label: 'Create' },
  { key: 'code', icon: <CodeOutlined />, label: 'Code' },
  { key: 'write', icon: <EditOutlined />, label: 'Write' },
  { key: 'learn', icon: <BulbOutlined />, label: 'Learn' },
  { key: 'life', icon: <HeartOutlined />, label: 'Life stuff' },
];

interface WelcomePageProps {
  onSend: (text: string) => void;
  model: string;
  onModelChange: (id: string) => void;
}

export default function WelcomePage({ onSend, model, onModelChange }: WelcomePageProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="welcome-container">
      <div className="welcome-inner">
        <div className="welcome-greeting">
          <div className="greeting-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.09 8.26L20 9L15 13.74L16.18 19.76L12 16.77L7.82 19.76L9 13.74L4 9L9.91 8.26L12 2Z" fill="#fff" opacity="0.9" />
            </svg>
          </div>
          <span>{getGreeting()}, sawyer</span>
        </div>

        <div className="welcome-input-area">
          <TextArea
            className="welcome-input"
            placeholder="How can I help you today?"
            autoSize={{ minRows: 1, maxRows: 8 }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="borderless"
          />

          <div className="welcome-toolbar">
            <div className="toolbar-left">
              <PlusMenu />
              <ModelSelector value={model} onChange={onModelChange} />
            </div>
            <div className="toolbar-right">
              <button className="tool-btn" title="Voice mode">
                <AudioOutlined />
              </button>
              <button
                className="tool-btn send"
                title="Send"
                onClick={handleSend}
                disabled={!value.trim()}
              >
                <ArrowUpOutlined />
              </button>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.key}
              className="quick-action"
              onClick={() => setValue(`Help me ${a.label.toLowerCase()}...`)}
            >
              {a.icon}
              <span>{a.label}</span>
            </button>
          ))}
        </div>

        <div className="welcome-tip">
          Claude can make mistakes. Please double-check responses.
        </div>
      </div>
    </div>
  );
}
