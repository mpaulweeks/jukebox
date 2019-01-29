import React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { CollapseAble } from './Components';

const CollapseBox = styled(CollapseAble)`
  width: 50px;
  height: 50px;
  color: var(--jukebox-collapse-foreground);
  background-color: var(--jukebox-collapse-background);

  z-index: 1;
  position: absolute;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
`;

interface Props {
  onClick(): void,
  isCollapsed: boolean,
};

const genCollapseBox = (Container: StyledComponent<'div', any, { isCollapsed: boolean }, never>) => {
  return (props: Props) => {
    const { onClick, isCollapsed } = props;
    return (
      <Container
        onClick={onClick}
        isCollapsed={isCollapsed}
      >
        +
      </Container>
    );
  }
}

export const CollapseBottom = genCollapseBox(styled(CollapseBox)`
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  ${props => props.isCollapsed && `
    bottom: -50px;
  `}
`);
export const CollapseSidebar = genCollapseBox(styled(CollapseBox)`
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.isCollapsed && `
    right: -50px;
  `}
`);
