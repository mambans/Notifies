import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";

import ErrorHandeling from "./../error/Error";
// import getFollowedOnlineStreams from "./GetFollowedStreams";
import getFollowedOnlineStreams from "./GetFollowedStreamsNEW";
import RenderTwitch from "./Render-Twitch";
import styles from "./Twitch.module.scss";
import Utilities from "utilities/Utilities";

function Twitch() {
  const [liveStreams, setLiveStreams] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(200);

  const lastRan = useRef(null);

  const windowFocusHandler = useCallback(() => {
    async function fetchData() {
      try {
        setRefreshing(true);
        const streams = await getFollowedOnlineStreams(lastRan.current);

        if (streams.status === 200) {
          setLiveStreams(streams.data);
          lastRan.current = new Date();
        }

        setRefreshTimer(streams.refreshTimer);
        setRefreshing(false);
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, []);

  const windowBlurHandler = useCallback(() => {}, []);

  useEffect(() => {
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);
    setRefreshing(true);

    async function fetchData() {
      try {
        const streams = await getFollowedOnlineStreams(lastRan.current);

        setError(streams.error);
        setLiveStreams(streams.data);
        setIsLoaded(true);
        setRefreshing(false);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
    lastRan.current = new Date();

    return () => {
      window.removeEventListener("blur", windowBlurHandler);
      window.removeEventListener("focus", windowFocusHandler);
    };
  }, [lastRan, windowBlurHandler, windowFocusHandler]);

  if (error) {
    console.error(error);

    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (!isLoaded) {
    return (
      <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  } else {
    console.log("Render liveStreams: ", liveStreams);
    return (
      <>
        <div
          className={styles.header_div}
          style={{
            marginTop: "0",
          }}>
          <Button
            variant="outline-secondary"
            className={styles.refreshButton}
            onClick={windowFocusHandler}>
            Reload
          </Button>
          {refreshing ? (
            <Spinner
              animation="border"
              role="status"
              style={Utilities.loadingSpinnerSmall}></Spinner>
          ) : (
            <p key={refreshTimer} className={styles.refreshTimer}>
              {Math.trunc(refreshTimer) >= 0
                ? `in ${Math.trunc(refreshTimer)} seconds`
                : "recently refreshed"}
            </p>
          )}
          <h4 className={styles.container_header}>Twitch</h4>
        </div>
        <div className={styles.container}>
          {liveStreams.map(stream => {
            return <RenderTwitch data={stream} key={stream.id} />;
          })}
        </div>
      </>
    );
  }
}

export default Twitch;
