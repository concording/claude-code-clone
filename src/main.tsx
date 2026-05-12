import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#d97757',
          colorBgBase: '#262624',
          colorBgContainer: '#2d2c2a',
          colorBgElevated: '#30302e',
          colorText: '#f5f4ee',
          colorTextSecondary: '#b8b6b0',
          colorBorder: '#3a3836',
          borderRadius: 10,
          fontFamily: "'Söhne', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#343330',
            itemHoverBg: '#343330',
            itemColor: '#b8b6b0',
            itemSelectedColor: '#f5f4ee',
          },
          Button: {
            borderRadius: 10,
          },
          Input: {
            colorBgContainer: '#30302e',
            colorBorder: 'transparent',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
