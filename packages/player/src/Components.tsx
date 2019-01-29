import styled from "styled-components";

export const CollapseAble = styled('div') <{ isCollapsed?: boolean }>`
  transition-duration: 1s;
  transition-delay: 0s;
  transition-timing-function: ease-in-out;
`;

export const CanHighlight = styled('div') <{ highlight?: boolean }>`
  cursor: pointer;

  ${props => props.highlight && `
    background-color: var(--jukebox-highlight);
  `}
`;

export const ScrollableMixin = `
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const MainViewContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: no-wrap;
`;

export const MainViewScrollable = styled.div`
  flex-grow: 1;
  ${ScrollableMixin}
`;
