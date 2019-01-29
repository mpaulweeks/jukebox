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
