import styled from 'styled-components';
import { FlexStretchMixin } from './Common';

export const PopupContainer = styled.div`
  ${FlexStretchMixin}
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  z-index: var(--jukebox-popup-z-index);

  background-color: rgba(0,0,0,0.5);
`;

export const PopupInner = styled.div`
  background-color: var(--jukebox-background);
  color: var(--jukebox-foreground);
  border: 0.5em solid var(--jukebox-foreground);
  border-radius: 2em;
  padding: 2em;
  text-align: center;
`;

export const PopupTitle = styled.div`
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 0.5em;
`;
