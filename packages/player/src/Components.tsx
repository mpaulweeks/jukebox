import styled from "styled-components";
import { DisplayConstants } from "./DisplayConstants";

export const CanHighlight = styled('div') <{ highlight?: boolean }>`
  cursor: pointer;

  ${props => props.highlight && `
    background-color: ${DisplayConstants.Highlight};
  `}
`;
