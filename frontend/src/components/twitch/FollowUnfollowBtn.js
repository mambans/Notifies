import axios from "axios";
import React, { useEffect, useState, useContext } from "react";

import { FollowBtn, UnfollowBtn } from "./StyledComponents";
import AccountContext from "./../account/AccountContext";
import reauthenticate from "./reauthenticate";
import Util from "./../../util/Util";

export default ({ channelName, id, alreadyFollowedStatus, size, style, refreshStreams }) => {
  const [following, setFollowing] = useState(alreadyFollowedStatus || false);
  const { setTwitchToken, setRefreshToken, twitchUserId } = useContext(AccountContext);

  const axiosConfig = (method, user_id, access_token = Util.getCookie("Twitch-access_token")) => {
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

  const UnfollowStream = async (user_id) => {
    await axios(axiosConfig("delete", user_id))
      .then(() => {
        console.log(`Unfollowed: ${channelName}`);
        if (refreshStreams) refreshStreams();
      })
      .catch(() => {
        reauthenticate(setTwitchToken, setRefreshToken).then(async (access_token) => {
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
        reauthenticate(setTwitchToken, setRefreshToken).then(async (access_token) => {
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
            Authorization: `OAuth ${Util.getCookie("Twitch-access_token")}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            Accept: "application/vnd.twitchtv.v5+json",
          },
        })
        .then((res) => {
          setFollowing(true);
        })
        .catch((error) => {
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
    }
    // else {
    //   setFollowing(alreadyFollowedStatus);
    // }
  }, [channelName, twitchUserId, id, alreadyFollowedStatus]);

  if (following) {
    return (
      <UnfollowBtn
        className='StreamFollowBtn'
        title={`Unfollow ${channelName}`}
        size={size || 30}
        style={{ ...style }}
        onClick={() => {
          setFollowing(false);
          UnfollowStream(id);
        }}
      />
    );
  } else {
    return (
      <FollowBtn
        className='StreamFollowBtn'
        title={`Follow ${channelName}`}
        size={size || 30}
        style={{ ...style }}
        onClick={() => {
          setFollowing(true);
          followStream(id);
        }}
      />
    );
  }
};
