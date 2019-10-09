import React, { useEffect, useState, useRef, useCallback } from "react";
import { Spinner } from "react-bootstrap";

import ErrorHandeling from "./../error/Error";
import getFollowedOnlineStreams from "./GetFollowedStreams";
import Utilities from "utilities/Utilities";
import styles from "./Twitch.module.scss";

function HandleData({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const liveStreams = useRef();
  const oldLiveStreams = useRef();
  // const lastRan = useRef(null);
  const newlyAddedStreams = useRef([]);
  const timer = useRef();

  function resetNewlyAddedStreams() {
    newlyAddedStreams.current = [];
  }

  const refreshRate = 20; // seconds

  const addSystemNotification = useCallback((status, stream) => {
    if (Notification.permission === "granted") {
      let notification = new Notification(
        `${stream.user_name} ${status === "offline" ? "Offline" : "Live"}`,
        {
          body:
            status === "offline"
              ? ""
              : `${Utilities.truncate(stream.title, 60)}\n${stream.game_name}`,
          icon: stream.profile_img_url || `${process.env.PUBLIC_URL}/icons/v2/Logo-2k.png`,
          badge: stream.profile_img_url || `${process.env.PUBLIC_URL}/icons/v2/Logo-2k.png`,
          silent: status === "offline" ? true : false,
          // icon: stream.profile_img_url || logo,
          // badge: stream.profile_img_url || logo,
        }
      );

      notification.onclick = function(event) {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        status === "offline"
          ? window.open(
              "https://www.twitch.tv/" + stream.user_name.toLowerCase() + "/videos",
              "_blank"
            )
          : window.open("https://www.twitch.tv/" + stream.user_name.toLowerCase(), "_blank");
      };

      return notification;
    }
  }, []);

  const refresh = useCallback(() => {
    async function refetch() {
      setRefreshing(true);
      try {
        const streams = await getFollowedOnlineStreams();
        // console.log("TCL: refetch -> streams", streams.status);

        if (streams.status === 200) {
          // console.log("-200-");

          oldLiveStreams.current = liveStreams.current;
          liveStreams.current = streams.data;
          setRefreshing(false);

          oldLiveStreams.current.forEach(stream => {
            let isStreamLive = liveStreams.current.find(
              ({ user_name }) => user_name === stream.user_name
            );

            if (!isStreamLive) addSystemNotification("offline", stream);
          });

          liveStreams.current.forEach(stream => {
            let isStreamLive = oldLiveStreams.current.find(
              ({ user_name }) => user_name === stream.user_name
            );

            if (!isStreamLive) {
              addSystemNotification("online", stream);
              newlyAddedStreams.current.push(stream.user_name);
              stream.newlyAdded = true;

              // document.getElementById(
              //   "favicon16"
              // ).href = `${process.env.PUBLIC_URL}/icons/favicon2Noti-16x16.png`;
              // document.getElementById(
              //   "favicon32"
              // ).href = `${process.env.PUBLIC_URL}/icons/favicon2Noti-32x32.png`;

              if (document.title.length > 15) {
                const title = document.title.substring(4);
                const count = parseInt(document.title.substring(1, 2)) + 1;
                document.title = `(${count}) ${title}`;
              } else {
                const title = document.title;
                document.title = `(${1}) ${title}`;
              }
            }
          });
        } else if (streams.status === 201) {
          // console.log("-201-");
          setRefreshing(false);
        }

        setRefreshing(false);
        setIsLoaded(true);
      } catch (error) {
        console.log("CATCH: ", error);
        setError(error);
      }
    }
    refetch();
  }, [addSystemNotification]);

  useEffect(() => {
    async function fetchData() {
      try {
        const timeNow = new Date();
        setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + refreshRate));

        timer.current = setInterval(() => {
          const timeNow = new Date();
          // console.log("Interval time - ", timeNow.toLocaleTimeString("sv-SE"));
          setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + refreshRate));
          refresh();
        }, refreshRate * 1000);
        const streams = await getFollowedOnlineStreams();
        if (streams.status === 200) {
          liveStreams.current = streams.data;
        } else {
          setError(streams.error);
        }

        setIsLoaded(true);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();

    return () => {};
  }, [liveStreams, oldLiveStreams, refresh]);

  useEffect(() => {
    return () => {
      // console.log("clearTimeout");
      clearInterval(timer.current);
    };
  }, []);

  if (!isLoaded) {
    return (
      <>
        <div
          className={styles.header_div}
          // style={{
          //   marginTop: "0",
          // }}
        >
          <h4 className={styles.container_header}>Twitch</h4>
        </div>
        <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      </>
    );
  } else if (!Utilities.getCookie("Twitch-access_token")) {
    return (
      <ErrorHandeling
        data={{
          title: "Couldn't load Twitch feed",
          message: "You are not connected with your Twitch account to Notifies",
        }}></ErrorHandeling>
    );
  } else {
    return children({
      liveStreams: liveStreams.current,
      refresh: refresh,
      refreshTimer: refreshTimer,
      newlyAddedStreams: newlyAddedStreams.current,
      resetNewlyAddedStreams: resetNewlyAddedStreams,
      error: error,
      // lastRan: lastRan.current,
      timer: timer.current,
      refreshing: refreshing,
    });
  }
}

export default HandleData;