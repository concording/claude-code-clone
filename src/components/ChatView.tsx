import { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AudioOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  ReloadOutlined,
  LikeOutlined,
  DislikeOutlined,
} from '@ant-design/icons';
import ModelSelector from './ModelSelector';
import PlusMenu from './PlusMenu';
import type { ChatMessage } from '../types';
import '../styles/chat.css';

const { TextArea } = Input;

interface ChatViewProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  loading: boolean;
  model: string;
  onModelChange: (id: string) => void;
}

export default function ChatView({
  messages,
  onSend,
  loading,
  model,
  onModelChange,
}: ChatViewProps) {
  const [value, setValue] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    const text = value.trim();
    if (!text || loading) return;
    onSend(text);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="chat-messages-inner">
          {messages.map((m) => (
            <div key={m.id} className={`chat-message ${m.role}`}>
              {m.role === 'assistant' && (
                <div className="message-avatar assistant">C</div>
              )}
              <div className="message-body">
                <div className="message-content markdown-body">
                  {m.role === 'assistant' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                  )}
                </div>
                {m.role === 'assistant' && (
                  <div className="message-actions">
                    <button
                      className="message-action-btn"
                      title="Copy"
                      onClick={() => handleCopy(m.content)}
                    >
                      <CopyOutlined />
                    </button>
                    <button className="message-action-btn" title="Retry">
                      <ReloadOutlined />
                    </button>
                    <button className="message-action-btn" title="Good">
                      <LikeOutlined />
                    </button>
                    <button className="message-action-btn" title="Bad">
                      <DislikeOutlined />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message assistant">
              <div className="message-avatar assistant">C</div>
              <div className="message-body">
                <div className="typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="chat-input-container">
        <div className="chat-input-inner">
          <div className="welcome-input-area">
            <TextArea
              className="welcome-input"
              placeholder="Reply to Claude..."
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
                  disabled={!value.trim() || loading}
                >
                  <ArrowUpOutlined />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
