import { Dropdown } from 'antd';
import {
  PlusOutlined,
  PictureOutlined,
  CameraOutlined,
  FolderAddOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  GlobalOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const items: MenuProps['items'] = [
  {
    key: 'files',
    icon: <PictureOutlined />,
    label: 'Add files or photos',
  },
  {
    key: 'screenshot',
    icon: <CameraOutlined />,
    label: 'Take a screenshot',
  },
  {
    key: 'project',
    icon: <FolderAddOutlined />,
    label: 'Add to project',
  },
  { type: 'divider' },
  {
    key: 'skills',
    icon: <ThunderboltOutlined />,
    label: 'Skills',
  },
  {
    key: 'connectors',
    icon: <ApiOutlined />,
    label: 'Add connectors',
  },
  {
    key: 'websearch',
    icon: <GlobalOutlined />,
    label: 'Web search',
  },
  {
    key: 'style',
    icon: <BgColorsOutlined />,
    label: 'Use style',
  },
];

export default function PlusMenu() {
  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement="topLeft"
    >
      <button className="tool-btn" title="More">
        <PlusOutlined />
      </button>
    </Dropdown>
  );
}
