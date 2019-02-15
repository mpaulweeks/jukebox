import React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { CollapseAble, Box } from './Common';

const CollapseWrapper = styled(CollapseAble) <{ box: BoxProps }>`
  color: var(--jukebox-foreground);
  background-color: var(--jukebox-background);

  z-index: 1;
  position: absolute;

  border: var(--jukebox-border-width) solid var(--jukebox-foreground);
  box-sizing: border-box;

  ${props => props.isCollapsed ? `
    ${[props.box.tightSide, props.box.outerSide].map(s => `
      ${s}: 0px;
    `).join('')}
    ${[props.box.gapSide, props.box.innerSide].map(s => `
      ${s}: auto;
    `).join('')}

    ${props.box.outerSide}: calc(0px - ((2 * var(--jukebox-border-width)) + (2 * var(--jukebox-frame-gap)) + var(--jukebox-tab-size)));

    ${[props.box.tightSide, props.box.innerSide].map(s => `
      margin-${s}: calc(0px - var(--jukebox-border-width));
      padding-${s}: 0px;
      border-${s}-width: 0px;
    `).join('')}
    ${[props.box.gapSide, props.box.outerSide].map(s => `
      margin-${s}: 0px;
      padding-${s}: var(--jukebox-frame-gap);
      border-${s}-width: var(--jukebox-border-width);
    `).join('')}
  ` : `
    ${[props.box.tightSide, props.box.outerSide].map(s => `
      ${s}: 0px;
      margin-${s}: calc(0px - var(--jukebox-border-width));
      padding-${s}: 0px;
      border-${s}-width: 0px;
    `).join('')}
    ${[props.box.gapSide, props.box.innerSide].map(s => `
      ${s}: auto;
      margin-${s}: 0px;
      padding-${s}: var(--jukebox-frame-gap);
      border-${s}-width: var(--jukebox-border-width);
    `).join('')}
  `}
`;

const CollapseBox = styled(Box)`
  cursor: pointer;

  width: var(--jukebox-tab-size);
  height: var(--jukebox-tab-size);

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
  innerSide: string,
  outerSide: string,
  gapSide: string,
  tightSide: string,
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
  innerSide: 'bottom',
  outerSide: 'top',
  gapSide: 'left',
  tightSide: 'right',
}, CollapseWrapper,
);
export const CollapseBottom = genCollapseBox({
  openText: '▲',
  collapsedText: '▼',
  innerSide: 'top',
  outerSide: 'bottom',
  gapSide: 'left',
  tightSide: 'right',
}, CollapseWrapper,
);
export const CollapseSidebar = genCollapseBox({
  openText: '◄',
  collapsedText: '►',
  innerSide: 'left',
  outerSide: 'right',
  gapSide: 'bottom',
  tightSide: 'top',
}, CollapseWrapper,
);
