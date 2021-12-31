import { ReactNode } from 'react';
import { Menu } from 'antd';
import styled from 'styled-components';

type MenuGroupProps = {
  title: string;
  icon: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
};

const MenuGroupTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MenuGroupTitleButton = styled.span`
  cursor: pointer;
`;

const MenuItem = styled(Menu.Item)`
  && {
    height: 22px;
    line-height: 22px;
    padding-left: 16px;
  }
  &&&.ant-menu-item-selected {
    background-color: inherit;
    border-left: 5px solid #1890ff;
  }
`;

function MenuGroup(props: MenuGroupProps) {
  const title = (
    <MenuGroupTitle>
      <div>{props.title}</div>
      <MenuGroupTitleButton onClick={props.onClick}>{props.icon}</MenuGroupTitleButton>
    </MenuGroupTitle>
  );

  return <Menu.ItemGroup title={title}>{props.children}</Menu.ItemGroup>;
}

export type { MenuGroupProps };
export { MenuGroup, MenuItem };
