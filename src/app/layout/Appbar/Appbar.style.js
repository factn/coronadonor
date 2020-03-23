import styled from "styled-components";
import { colors } from "../../../constants";

export const AppbarContainer = styled.div`
  height: 89px;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
`;

export const AppbarDefault = styled.div`
  height: inherit;
  box-sizing: border-box;
  display: flex;
`;
export const LogoContainer = styled.div`
  height: inherit;
  width: 100px;
  margin-right: auto;
  cursor: pointer;
  > svg {
    height: inherit;
  }
`;
export const MenuContainer = styled.div`
  height: inherit;
  width: 100px;
  cursor: pointer;
  > svg {
    height: inherit;
    width: 2em;
  }
`;
