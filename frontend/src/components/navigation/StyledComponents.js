import styled from 'styled-components';

export const StyledNavSidebarTrigger = styled.div`
  align-items: center;
  cursor: pointer;
  margin-left: 20px;
  border-radius: 30px;
  height: inherit;
  display: flex;
  justify-content: center;
  margin-right: 10px;

  &:hover {
    svg {
      opacity: 1;
    }

    img#NavigationProfileImage {
      border: 2px solid rgb(200, 200, 200);
      box-shadow: 0px 0px 15px #000000;
    }
  }

  img#NavigationProfileImage {
    border-radius: 80%;
    object-fit: cover;
    width: 48px;
    height: 80%;
    align-self: center;
    transition: ease-in-out 0.2s;
    border: 2px solid transparent;
    box-shadow: 0px 0px 10px #000000;
  }
`;

export const StyledLoginButton = styled.p`
  margin-top: 0;
  margin-bottom: 0;
  font-size: 1.15rem;
  margin-right: 15px;
  color: var(--textColor1);
`;

export const FeedSizeSlider = styled.div`
  color: rgb(175, 175, 175);
  text-align: center;

  .rangeslider {
    margin: 10px 0;
  }

  .rangeslider-horizontal {
    width: 100%;
    height: 8px;
    cursor: pointer;

    .rangeslider__handle {
      width: 20px;
      height: 20px;
      border-radius: 20px;

      &::after {
        width: 10.5px;
        height: 10.5px;
        top: 4px;
        left: 4px;
      }
    }

    .rangeslider__fill {
      background-color: #2e6079;
    }
  }
`;
