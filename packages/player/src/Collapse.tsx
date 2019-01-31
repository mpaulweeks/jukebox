import React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { CollapseAble } from './Components';

const CollapseBox = styled(CollapseAble)`
  cursor: pointer;
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

const genCollapseBox = (openText: string, collapsedText: string, Container: StyledComponent<'div', any, { isCollapsed: boolean }, never>) => {
  return (props: Props) => {
    const { onClick, isCollapsed } = props;
    return (
      <Container
        onClick={onClick}
        isCollapsed={isCollapsed}
      >
        {isCollapsed ? collapsedText : openText}
      </Container>
    );
  }
}

// alternative arrows ⇦ ⇧ ⇨ ⇩

export const CollapseRoot = genCollapseBox('X', '', styled(CollapseBox)`
  top: 0px;
  right: 0px;
`);
export const CollapseBottom = genCollapseBox('▲', '▼', styled(CollapseBox)`
  right: 0px;
  bottom: 0px;
  ${props => props.isCollapsed && `
    bottom: -50px;
  `}
`);
export const CollapseSidebar = genCollapseBox('◄', '►', styled(CollapseBox)`
  top: 0px;
  right: 0px;
  ${props => props.isCollapsed && `
    right: -50px;
  `}
`);
