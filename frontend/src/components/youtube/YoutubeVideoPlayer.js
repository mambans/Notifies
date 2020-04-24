import { useParams } from "react-router-dom";
import styled from "styled-components";
import YouTube from "react-youtube";
import { MdVerticalAlignBottom } from "react-icons/md";
import React, { useContext, useEffect, useState } from "react";
// import queryString from "query-string";

import NavigationContext from "./../navigation/NavigationContext";
import { VideoAndChatContainer, ShowNavbarBtn } from "./../twitch/player/StyledComponents";
import PlayerNavbar from "./PlayerNavbar";

const StyledYoutubeIframe = styled(YouTube)`
  border: none;
  height: 100%;
  width: 100%;
`;

export default () => {
  const [video, setVideo] = useState({});
  const param = useParams().videoId;
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  // const video = (() => {
  //   const param = useParams().videoId;

  //   if (param.includes("&t=")) {
  //     return { id: param.split("&t=")[0], startTime: param.split("&t=")[1].replace("s", "") };
  //   } else {
  //     return { id: param };
  //   }
  // })();

  useEffect(() => {
    if (param.includes("&t=")) {
      setVideo({ id: param.split("&t=")[0], startTime: param.split("&t=")[1].replace("s", "") });
    } else {
      setVideo({ id: param });
    }
  }, [param]);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    setShrinkNavbar("true");
    setVisible(false);
    setFooterVisible(false);

    return () => {
      document.documentElement.style.overflow = "visible";
      setShrinkNavbar("false");
      setFooterVisible(true);
      setVisible(true);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible]);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      origin: "https://aiofeed.com/youtube",
      start: video.startTime || 0,
      frameborder: "0",
      fs: 1,
    },
  };

  return (
    <>
      <PlayerNavbar visible={visible} />
      <VideoAndChatContainer
        style={{
          height: visible ? "calc(100vh - 85px)" : "100vh",
          top: visible ? "85px" : "0",
          display: "unset",
        }}>
        <ShowNavbarBtn
          variant='dark'
          onClick={() => {
            setVisible(!visible);
          }}
          style={{ right: "0" }}>
          <MdVerticalAlignBottom
            style={{
              transform: visible ? "rotateX(180deg)" : "unset",
              right: "10px",
            }}
            size={30}
            title='Show navbar'
          />
          Navbar
        </ShowNavbarBtn>
        <StyledYoutubeIframe
          videoId={video.id}
          opts={opts}
          id={video.id + "player"}
          containerClassName='IframeContainer'
        />
      </VideoAndChatContainer>
    </>
  );
};
