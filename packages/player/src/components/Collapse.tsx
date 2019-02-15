import React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { CollapseAble, Box } from './Common';

const CollapseWrapper = styled(CollapseAble) <{ box: BoxProps }>`
  color: var(--jukebox-foreground);
  background-color: var(--jukebox-background);

  z-index: 1;
  position: absolute;

  border: var(--jukebox-border-width) solid var(--jukebox-foreground);

  ${props => props.box.tightSides.map(s => `
    ${s}: 0px;
    margin-${s}: calc(0px - var(--jukebox-border-width));
    border-${s}: 0px;
  `).join('')}
  ${props => props.box.gapSides.map(s => `
    padding-${s}: var(--jukebox-frame-gap);
  `).join('')}
`;

const CollapseBox = styled(Box)`
  cursor: pointer;

  width: 50px;
  height: 50px;

  justify-content: center;
  align-items: center;
`;

interface Props {
  onClick(): void;
  isCollapsed: boolean;
}

interface BoxProps {
  collapsedText: string,
  openText: string,
  gapSides: string[],
  tightSides: string[],
}

const genCollapseBox = (
  box: BoxProps,
  Container: StyledComponent<'div', any, { isCollapsed: boolean, box: BoxProps }, never>,
) => {
  return (props: Props) => {
    const { onClick, isCollapsed } = props;
    return (
      <Container isCollapsed={isCollapsed} box={box} >
        <CollapseBox onClick={onClick}>
          {isCollapsed ? box.collapsedText : box.openText}
        </CollapseBox>
      </Container>
    );
  };
};

// alternative arrows ⇦ ⇧ ⇨ ⇩

export const CollapseRoot = genCollapseBox({
  openText: 'X',
  collapsedText: '',
  gapSides: ['bottom', 'left'],
  tightSides: ['top', 'right'],
}, styled(CollapseWrapper)`
    top: 0px;
    right: 0px;
  `,
);
export const CollapseBottom = genCollapseBox({
  openText: '▲',
  collapsedText: '▼',
  gapSides: ['top', 'left'],
  tightSides: ['bottom', 'right'],
}, styled(CollapseWrapper)`
    ${props =>
    props.isCollapsed &&
    `
    bottom: -50px;
  `}
  `,
);
export const CollapseSidebar = genCollapseBox({
  openText: '◄',
  collapsedText: '►',
  gapSides: ['bottom', 'left'],
  tightSides: ['top', 'right'],
}, styled(CollapseWrapper)`
    top: 0px;
    right: 0px;
    ${props =>
    props.isCollapsed &&
    `
    right: -50px;
  `}
  `,
);
