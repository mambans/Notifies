import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useState, useContext } from "react";
import Tooltip from "react-bootstrap/Tooltip";

import { FollowBtn, UnfollowBtn } from "./styledComponents";
import AccountContext from "./../account/AccountContext";
import reauthenticate from "./reauthenticate";

export default ({ channelName, id, alreadyFollowedStatus, size, style, refreshStreams }) => {
  const [following, setFollowing] = useState(false);
  const { setTwitchToken, twitchToken, setRefreshToken, refreshToken, twitchUserId } = useContext(
    AccountContext
  );

  // const myUserId = async () => {
  //   await axios
  //     .get(`https://api.twitch.tv/helix/users?`, {
  //       params: {
  //         login: Utilities.getCookie("Twitch-username"),
  //       },
  //       headers: {
  //         Authorization: `Bearer ${twitchToken}`,
  //         "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
  //       },
  //     })
  //     .then(res => {
  //       console.log("myUserId -> res", res);
  //       return res.data.data[0].id;
  //     })
  //     .catch(async error => {
  //       console.error(error);
  //     });
  // };

  const axiosConfig = (method, user_id, access_token = twitchToken) => {
    return {
      method: method,
      url: `https://api.twitch.tv/kraken/users/${twitchUserId}/follows/channels/${user_id}`,
      headers: {
        Authorization: `OAuth ${access_token}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        Accept: "application/vnd.twitchtv.v5+json",
      },
    };
  };

  const UnfollowStream = async user_id => {
    await axios(axiosConfig("delete", user_id))
      .then(() => {
        console.log(`Unfollowed: ${channelName}`);
        if (refreshStreams) refreshStreams();
      })
      .catch(() => {
        reauthenticate(setTwitchToken, setRefreshToken, refreshToken).then(async access_token => {
          await axios(axiosConfig("delete", user_id, access_token)).then(() => {
            console.log(`Unfollowed: ${channelName}`);
            if (refreshStreams) refreshStreams();
          });
        });
      });
  };

  async function followStream(user_id) {
    await axios(axiosConfig("put", user_id))
      .then(() => {
        console.log(`Followed: ${channelName}`);
        if (refreshStreams) refreshStreams();
      })
      .catch(() => {
        reauthenticate(setTwitchToken, setRefreshToken, refreshToken).then(async access_token => {
          await axios(axiosConfig("put", user_id, access_token)).then(() => {
            console.log(`Followed: ${channelName}`);
            if (refreshStreams) refreshStreams();
          });
        });
      });
  }

  useEffect(() => {
    const checkFollowing = async () => {
      await axios
        .get(`https://api.twitch.tv/kraken/users/${twitchUserId}/follows/channels/${id}`, {
          headers: {
            Authorization: `OAuth ${twitchToken}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            Accept: "application/vnd.twitchtv.v5+json",
          },
        })
        .then(res => {
          setFollowing(true);
        })
        .catch(error => {
          if (
            error.response &&
            error.response.status === 404 &&
            error.response.statusText === "Not Found"
          ) {
            console.log(`Not following ${channelName}`);
            setFollowing(false);
          } else {
            console.error(error);
          }
        });
    };
    if (!alreadyFollowedStatus) {
      checkFollowing();
    } else {
      setFollowing(alreadyFollowedStatus);
    }
  }, [channelName, twitchToken, twitchUserId, id, alreadyFollowedStatus]);

  if (following) {
    return (
      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        delay={{ show: 300, hide: 0 }}
        overlay={
          <Tooltip id={`tooltip-${"bottom"}`}>
            Unfollow <strong>{channelName}</strong>.
          </Tooltip>
        }>
        <UnfollowBtn
          // id='FollowUnfollowButton'
          id='IsFollowed'
          size={size || 30}
          style={{ ...style }}
          onClick={() => {
            setFollowing(false);
            UnfollowStream(id);
          }}
        />
      </OverlayTrigger>
    );
  } else {
    return (
      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        delay={{ show: 500, hide: 0 }}
        overlay={
          <Tooltip id={`tooltip-${"bottom"}`}>
            Follow <strong>{channelName}</strong>.
          </Tooltip>
        }>
        <FollowBtn
          id='IsNotFollowed'
          size={size || 30}
          style={{ ...style }}
          onClick={() => {
            setFollowing(true);
            followStream(id);
          }}
        />
      </OverlayTrigger>
    );
  }
};
