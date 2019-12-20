import "react-notifications-component/dist/theme.css";
import React, { useState, useEffect } from "react";
import ReactNotification from "react-notifications-component";
import { Spinner, Alert } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";

import "./Notifications.scss";
import DataHandler from "../twitch/DataHandler";
import ErrorHandeling from "./../error/Error";
import Twitch from "../twitch/Twitch";
import TwitchVods from "../twitch/vods/Twitch-vods";
import Utilities from "../../utilities/Utilities";
import Youtube from "./../youtube/Youtube";
import YoutubeDataHandler from "./../youtube/Datahandler";
import YoutubeHeader from "./../youtube/Header";
import styles from "./Feed.module.scss";

function Feed(props) {
  document.title = "Notifies | Feed";
  const [isLoaded] = useState(true);
  const [error] = useState(null);
  const [delayedEnableYoutube, setDelayedEnableYoutube] = useState(false);
  const [delayedEnableTwitchVods, setDelayedEnableTwitchVods] = useState(false);

  useEffect(() => {
    Notification.requestPermission().then(function(result) {
      console.log("Notifications: ", result);
    });
  }, []);

  useEffect(() => {
    const TIMEOUT = 1000;

    window.setTimeout(
      () => {
        setDelayedEnableYoutube("true");
      },
      localStorage.getItem("TwitchFeedEnabled") === "true" ? TIMEOUT : 0
    );

    window.setTimeout(
      () => {
        setDelayedEnableTwitchVods("true");
      },
      localStorage.getItem("YoutubeFeedEnabled") === "true" ? TIMEOUT * 3 : TIMEOUT
    );
  }, []);

  function NoFeedsEnabled() {
    const [show, setShow] = useState(true);
    if (
      localStorage.getItem("TwitchFeedEnabled") === "false" &&
      localStorage.getItem("YoutubeFeedEnabled") === "false" &&
      localStorage.getItem("TwitchVodsFeedEnabled") === "false" &&
      props.isLoggedIn &&
      show
    ) {
      return (
        <CSSTransition timeout={0} classNames='fade-1s' unmountOnExit>
          <Alert
            variant='info'
            style={Utilities.feedAlertWarning}
            onClose={() => setShow(false)}
            dismissible>
            <Alert.Heading>No feeds are enabled</Alert.Heading>
            <hr />
            Please enable some feeds in account settings
          </Alert>
        </CSSTransition>
      );
    }
    return null;
  }

  if (!Utilities.getCookie("Notifies_AccountName")) {
    return (
      <>
        <ErrorHandeling
          data={{
            title: "Please login",
            message: "You are not logged with your Notifies account.",
          }}></ErrorHandeling>
      </>
    );
  } else if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (!isLoaded) {
    return (
      <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <>
        <ReactNotification />
        <NoFeedsEnabled />

        {props.enableTwitch ? (
          <DataHandler>
            {liveStreams => (
              <CSSTransition in={props.enableTwitch} timeout={0} classNames='fade-1s' unmountOnExit>
                <div className={styles.twitchContainer}>
                  <Twitch data={liveStreams} />
                </div>
              </CSSTransition>
            )}
          </DataHandler>
        ) : null}

        {props.enableYoutube && delayedEnableYoutube ? (
          <div className={styles.container}>
            <YoutubeDataHandler>
              {data => (
                <>
                  <YoutubeHeader
                    refresh={data.refresh}
                    isLoaded={data.isLoaded}
                    requestError={data.requestError}
                    followedChannels={data.followedChannels}
                  />
                  {data.error ? <ErrorHandeling data={data.error}></ErrorHandeling> : null}
                  <Youtube
                    isLoaded={data.isLoaded}
                    refresh={data.refresh}
                    requestError={data.requestError}
                    initiated={data.initiated}
                    followedChannels={data.followedChannels}
                    videos={data.videos}
                    onChange={data.onChange}
                  />
                </>
              )}
            </YoutubeDataHandler>
          </div>
        ) : null}

        {props.enableTwitchVods && delayedEnableTwitchVods ? (
          <div className={styles.container}>
            <TwitchVods />
          </div>
        ) : null}
      </>
    );
  }
}

export default Feed;
