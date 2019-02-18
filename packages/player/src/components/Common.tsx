import styled from 'styled-components';

export const CollapseAble = styled('div') <{ isCollapsed?: boolean }>`
  transition-duration: 1s;
  transition-delay: 0s;
  transition-timing-function: ease-in-out;
`;

const HighlightMixin = (highlight?: boolean) => highlight && `
  background-color: var(--jukebox-highlight-background);
  color: var(--jukebox-highlight-foreground);
`;
export const CanHighlight = styled('div') <{ highlight?: boolean }>`
  ${props => HighlightMixin(props.highlight)}
`;
export const CanHighlightTableRow = styled('tr') <{ highlight?: boolean }>`
  ${props => HighlightMixin(props.highlight)}
`;

export const ScrollableMixin = `
  overflow-x: hidden;
  overflow-y: auto;
`;

export const HoverMixin = `
  cursor: pointer;
  &:hover {
    background-color: var(--jukebox-foreground);
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

export const IconMixin = `
  font-size: 1.5em;
  height: 2em;
  width: 2em;

  & i {
    font-size: 1.5em;
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
`;

export const getClickPercent = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const clicked: any = evt.currentTarget;
  const rect = clicked.getBoundingClientRect();
  const offset = evt.pageX - rect.left;
  return offset / (rect.right - rect.left);
};

export const MainViewContainer = styled.div`
  ${FlexStretchMixin}
`;

export const MainViewScrollable = styled.div`
  flex-grow: 1;
  ${ScrollableMixin}
`;

export const MainTitle = styled.h1`
  padding-left: calc(2 * var(--jukebox-tab-size));
  text-align: left;

  @media (max-width: 600px) {
    padding-left: 0px;
    text-align: center;
  }
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
