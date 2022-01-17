import { ReactNode } from 'react';
import { Menu, MenuItemProps as AntdMenuItemProps } from 'antd';
import styled from 'styled-components';

type MenuGroupProps = {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
};

type MenuItemProps = AntdMenuItemProps & {
  badge?: ReactNode;
};

const MenuGroupTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MenuGroupTitleButton = styled.span`
  cursor: pointer;
`;

const StyledMenuItem = styled(Menu.Item)`
  && {
    height: 22px;
    line-height: 22px;
    padding-left: 16px;

    span.badge {
      display: inline-block;
      position: absolute;
      top: 2px;
      right: 10px;
      width: 18px;
      line-height: 18px;
      background-color: var(--ant-error-color);
      border-radius: 2px;
      color: #fff;
      font-size: smaller;
      text-align: center;
    }
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
      {props.icon && <MenuGroupTitleButton onClick={props.onClick}>{props.icon}</MenuGroupTitleButton>}
    </MenuGroupTitle>
  );

  return <Menu.ItemGroup title={title}>{props.children}</Menu.ItemGroup>;
}

function MenuItem(props: MenuItemProps) {
  return (
    <StyledMenuItem {...props}>
      {props.children}
      {props.badge ? <span className="badge">{props.badge}</span> : ''}
    </StyledMenuItem>
  );
}

export type { MenuGroupProps };
export { MenuGroup, MenuItem };
