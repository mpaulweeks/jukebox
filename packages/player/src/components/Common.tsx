import styled from 'styled-components';

export const CollapseAble = styled('div') <{ isCollapsed?: boolean }>`
  transition-duration: 1s;
  transition-delay: 0s;
  transition-timing-function: ease-in-out;
`;

const Highlightable = styled('div') <{ highlight?: boolean }>``;
export const CanHighlight = styled(Highlightable)`
  ${props =>
    props.highlight &&
    `
    background-color: var(--jukebox-highlight);
  `}
`;
export const CanHighlightIcon = styled(Highlightable)`
  ${props =>
    props.highlight &&
    `
    color: var(--jukebox-highlight);
  `}
`;

export const ScrollableMixin = `
  overflow-x: hidden;
  overflow-y: auto;
`;

export const HoverMixin = `
  cursor: pointer;
  &:hover {
    background-color: var(--jukebox-hover);
    color: var(--jukebox-background);
  }
`;

export const FlexStretchMixin = `
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  flex-wrap: no-wrap;
  flex-grow: 1;
`;

export const MainViewContainer = styled.div`
  ${FlexStretchMixin}
`;

export const MainViewScrollable = styled.div`
  flex-grow: 1;
  ${ScrollableMixin}
`;

// todo use this in App
// https://stackoverflow.com/a/5863871
export const ResetMixin = styled.div`
  &,
  & *,
  & a:hover,
  & a:visited,
  & a:active {
    background: none;
    border: none;
    bottom: auto;
    clear: none;
    cursor: default;
    display: block;
    float: none;
    font-family: Arial, Helvetica, sans-serif;
    font-size: medium;
    font-style: normal;
    font-weight: normal;
    height: auto;
    left: auto;
    letter-spacing: normal;
    line-height: normal;
    max-height: none;
    max-width: none;
    min-height: 0;
    min-width: 0;
    overflow: visible;
    position: static;
    right: auto;
    text-align: left;
    text-decoration: none;
    text-indent: 0;
    text-transform: none;
    top: auto;
    visibility: visible;
    white-space: normal;
    width: auto;
    z-index: auto;
  }
`;

export const Box = styled.div`
  position: relative;

  ${FlexStretchMixin}

  border: var(--jukebox-border-width) solid var(--jukebox-foreground);
  box-sizing: border-box;
  padding: 10px;
`;
