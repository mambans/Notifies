import { eye } from "react-icons-kit/icomoon/eye";
import { Icon } from "react-icons-kit";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useRef, useCallback, useState, useEffect } from "react";
import Tooltip from "react-bootstrap/Tooltip";

import { ImageContainer, VideoTitle } from "./../../sharedStyledComponents";
import StreamHoverIframe from "./../StreamHoverIframe.js";
import styles from "./../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";

const HOVER_DELAY = 1000;

function StreamEle(data) {
  const [isHovered, setIsHovered] = useState(false);

  const streamHoverTimer = useRef();
  const ref = useRef();
  const refChannel = useRef();

  const formatViewerNumbers = viewers => {
    if (viewers.toString().length === 7) {
      return (viewers / 1000000).toString().substring(0, 5) + "m";
    } else if (viewers.toString().length >= 5) {
      return viewers.toString().substring(0, viewers.toString().length - 3) + "k";
    } else {
      return viewers;
    }
  };

  const handleMouseOver = () => {
    streamHoverTimer.current = setTimeout(function() {
      setIsHovered(true);
    }, HOVER_DELAY);
  };

  const handleMouseOut = useCallback(event => {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (ref.current && localStorage.getItem(`TwitchVideoHoverEnabled`) === "true") {
      const refEle = ref.current;
      ref.current.addEventListener("mouseenter", handleMouseOver);
      ref.current.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, [handleMouseOut]);

  return (
    <div className={`${styles.video}`} key={data.data.id}>
      <ImageContainer ref={ref}>
        {isHovered ? (
          <StreamHoverIframe
            id={data.data.id}
            data={data.data}
            setIsHovered={setIsHovered}></StreamHoverIframe>
        ) : null}
        <a
          className={styles.img}
          href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
          <img
            src={
              data.data.thumbnail_url.replace("{width}", 640).replace("{height}", 360) +
              `#` +
              new Date().getTime()
            }
            alt={styles.thumbnail}
          />
        </a>
        <Moment className={styles.duration} durationFromNow>
          {data.data.started_at}
        </Moment>
      </ImageContainer>
      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        delay={{ show: 250, hide: 0 }}
        overlay={
          <Tooltip
            id={`tooltip-${"bottom"}`}
            style={{
              width: "336px",
            }}>
            {data.data.title}
          </Tooltip>
        }>
        <VideoTitle href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
          {Utilities.truncate(data.data.title, 50)}
        </VideoTitle>
      </OverlayTrigger>
      <div>
        <div className={styles.channelContainer} ref={refChannel}>
          <a
            href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}
            style={{ gridRow: 1 }}>
            <img src={data.data.profile_img_url} alt='' className={styles.profile_img}></img>
          </a>
          <p className={styles.channel}>
            <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}>
              {data.data.user_name}
            </a>
          </p>
        </div>
        <div className={styles.gameContainer}>
          <Link className={styles.game_img} to={"/twitch/top/" + data.data.game_name}>
            <img
              src={data.data.game_img.replace("{width}", 130).replace("{height}", 173)}
              alt=''
              className={styles.game_img}></img>
          </Link>
          <Link className={styles.game} to={"/twitch/top/" + data.data.game_name}>
            {Utilities.truncate(data.data.game_name, 50)}
          </Link>
          <p className={styles.viewers}>
            {/* {data.data.viewer_count} */}
            {formatViewerNumbers(data.data.viewer_count)}
            <Icon
              icon={eye}
              size={14}
              style={{
                color: "rgb(200, 200, 200)",
                paddingLeft: "5px",
                paddingTop: "3px",
                display: "flex",
                alignItems: "center",
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default StreamEle;
