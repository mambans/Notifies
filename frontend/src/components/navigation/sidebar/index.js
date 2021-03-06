import React, { useContext } from 'react';
import { CSSTransition } from 'react-transition-group';

import AccountContext from './../../account/AccountContext';
import CreateAccount from './CreateAccount';
import Login from './Login';
import NavigationContext from './../NavigationContext';
import SidebarAccount from './SidebarAccount';
import { StyledNavSidebarTrigger, StyledLoginButton } from './../StyledComponents';
import {
  StyledNavSidebar,
  StyledNavSidebarBackdrop,
  StyledSidebarTrigger,
} from './StyledComponent';

export default () => {
  const { profileImage, username } = useContext(AccountContext);
  const { renderModal, showSidebar, setShowSidebar } = useContext(NavigationContext);

  const handleToggle = () => setShowSidebar(!showSidebar);

  const modal = {
    account: <SidebarAccount />,
    login: <Login />,
    create: <CreateAccount />,
  };

  return (
    <>
      <StyledNavSidebarTrigger onClick={handleToggle} title='Sidebar'>
        {username ? (
          <>
            <StyledSidebarTrigger id='NavigationProfileImageHoverOverlay' open={showSidebar} />
            <img
              id='NavigationProfileImage'
              src={profileImage || `${process.env.PUBLIC_URL}/images/placeholder.jpg`}
              alt=''
            />
          </>
        ) : (
          <StyledLoginButton>Login</StyledLoginButton>
        )}
      </StyledNavSidebarTrigger>

      <CSSTransition
        in={showSidebar}
        timeout={500}
        classNames='NavSidebarBackdropFade'
        unmountOnExit
      >
        <StyledNavSidebarBackdrop onClick={() => setShowSidebar(false)} />
      </CSSTransition>

      <CSSTransition
        in={showSidebar}
        timeout={1000}
        classNames='NavSidebarSlideRight'
        unmountOnExit
      >
        <StyledNavSidebar>{modal[renderModal]}</StyledNavSidebar>
      </CSSTransition>
    </>
  );
};
