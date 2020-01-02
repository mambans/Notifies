import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import { Button } from "react-bootstrap";

import "./Navigation.scss";
import AccountContext from "./../account/AccountContext";
import FeedsContext from "./../feed/FeedsContext";
import NavigationContext from "./NavigationContext";
import AccountModal from "../account/AccountModal";
import CreateAccountModal from "../account/CreateAccountModal";
import LoginModal from "../account/LoginModal";
import styles from "./Navigation.module.scss";
import Utilities from "../../utilities/Utilities";

export default props => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    props.setRenderModal("login");
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <div onClick={handleShow} className={styles.navProfileContainer}>
        {props.isLoggedIn ? (
          <img
            // onClick={handleToggle}
            className={styles.navProfile}
            id='NavigationProfileImage'
            src={
              Utilities.getCookie("Notifies_AccountProfileImg") !== null
                ? Utilities.getCookie("Notifies_AccountProfileImg")
                : `${process.env.PUBLIC_URL}/images/placeholder.png`
            }
            style={{ marginLeft: "0" }}
            alt=''></img>
        ) : (
          <p className={styles.LoginAccountButton}>Login</p>
        )}
      </div>

      <Modal show={show} onHide={handleClose} dialogClassName={styles.modal}>
        <Modal.Header closeButton closeLabel='' style={{ border: "none" }}></Modal.Header>

        {props.isLoggedIn ? (
          <NavigationContext.Consumer>
            {navProps => {
              return (
                <AccountContext.Consumer>
                  {accProps => {
                    return (
                      <FeedsContext.Consumer>
                        {feedsProps => {
                          return (
                            <AccountModal
                              {...accProps}
                              {...feedsProps}
                              {...navProps}
                              setRenderModal={props.setRenderModal}></AccountModal>
                          );
                        }}
                      </FeedsContext.Consumer>
                    );
                  }}
                </AccountContext.Consumer>
              );
            }}
          </NavigationContext.Consumer>
        ) : (
          <div className={styles.createAccountContainer}>
            {props.renderModal !== "login" ? (
              <CreateAccountModal {...props} />
            ) : (
              <>
                <LoginModal {...props}></LoginModal>
                <Button
                  className={styles.disconnectButton}
                  onClick={() => {
                    props.setRenderModal("create");
                  }}>
                  Create Account
                </Button>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};