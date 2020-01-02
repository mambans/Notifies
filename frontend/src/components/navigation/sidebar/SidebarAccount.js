import { Button } from "react-bootstrap";
import { ic_account_box } from "react-icons-kit/md/ic_account_box";
import { ic_refresh } from "react-icons-kit/md/ic_refresh";
import { Icon } from "react-icons-kit";
import { NavLink } from "react-router-dom";
import { out } from "react-icons-kit/entypo/out";
import { twitch } from "react-icons-kit/icomoon/twitch";
import { youtube } from "react-icons-kit/icomoon/youtube";
import axios from "axios";
import Popup from "reactjs-popup";
import React from "react";
import uniqid from "uniqid";

// import styles from "./../Navigation.module.scss";
import Themeselector from "./../../themes/Themeselector";
import ToggleSwitch from "../../account/ToggleSwitch";
import ToggleSwitchVideoHover from "../../account/ToggleSwitchVideoHover";
import UpdateProfileImg from "../../account/UpdateProfileImg";
import Utilities from "../../../utilities/Utilities";
import {
  StyledProfileImg,
  StyledConnectTwitch,
  StyledConnectYoutube,
  StyledLogoutContiner,
  StyledUploadImageButon,
} from "./styledComponent";

export default props => {
  document.title = "Notifies | Account";

  function logout() {
    document.cookie = `Notifies_AccountName=null; path=/`;
    document.cookie = `Notifies_AccountEmail=null; path=/`;
    document.cookie = `Twitch-access_token=null; path=/`;
    document.cookie = `Youtube-access_token=null; path=/`;
    document.cookie = `Notifies_AccountProfileImg=null; path=/`;

    props.setIsLoggedIn(false);
  }

  async function authenticatePopup(
    winName,
    domain,
    urlParam,
    setToken,
    setFeedEnable,
    setFeedEnableSecond
  ) {
    async function generateOrginState() {
      return uniqid();
    }

    const orginState = await generateOrginState();

    document.cookie = `${domain}-myState=${orginState}; path=/`;

    const url = urlParam + `&state=${orginState}`;
    const LeftPosition = window.screen.width ? (window.screen.width - 700) / 2 : 0;
    const TopPosition = window.screen.height ? (window.screen.height - 850) / 2 : 0;
    const settings = `height=700,width=600,top=${TopPosition},left=${LeftPosition},scrollbars=yes,resizable`;
    const popupWindow = window.open(url, winName, settings);

    try {
      popupWindow.onunload = function() {
        window.setTimeout(function() {
          if (popupWindow.closed) {
            setToken(true);
            setFeedEnable(true);
            if (setFeedEnableSecond) setFeedEnableSecond(true);
            localStorage.setItem(domain + "FeedEnabled", true);
            console.log(`Successfully authenticate to ${domain}`);
          }
        }, 1);
      };
    } catch (e) {
      alert("Another Authendicate popup window might already be open.");
      console.error("Another Authendicate popup window might already be open.");
      console.error("Auth Popup error:", e);
    }
  }

  async function disconnectTwitch() {
    document.cookie = "Twitch-access_token=null; path=/";

    await axios
      .put(`http://localhost:3100/notifies/account/twitch/connect`, {
        accountName: Utilities.getCookie("Notifies_AccountName"),
        accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
        twitchToken: null,
      })
      .then(() => {
        document.cookie = `Twitch-access_token=null; path=/`;
        props.setTwitchToken(null);
        props.setEnableTwitch(false);
        props.setEnableTwitchVods(false);
        localStorage.setItem("TwitchFeedEnabled", false);
        localStorage.setItem("TwitchVodsFeedEnabled", false);
        console.log(`Successfully disconnected from Twitch`);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function disconnectYoutube() {
    document.cookie = "Youtube-access_token=null; path=/";

    await axios
      .put(`http://localhost:3100/notifies/account/youtube/connect`, {
        accountName: Utilities.getCookie("Notifies_AccountName"),
        accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
        youtubeToken: null,
      })
      .then(() => {
        document.cookie = `Youtube-access_token=null; path=/`;
        props.setYoutubeToken(null);
        props.setEnableYoutube(false);
        localStorage.setItem("YoutubeFeedEnabled", false);
        console.log(`Successfully disconnected from Youtube`);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div>
      <Popup
        placeholder='Img url...'
        arrow={false}
        trigger={<StyledUploadImageButon>Change Profile image</StyledUploadImageButon>}
        position='bottom center'
        className='updateProfilePopup'>
        <UpdateProfileImg />
      </Popup>
      <StyledProfileImg
        src={
          Utilities.getCookie("Notifies_AccountProfileImg") ||
          `${process.env.PUBLIC_URL}/images/placeholder.png`
        }
        alt=''
      />

      <h1 style={{ fontSize: "2rem", textAlign: "center" }}>
        {Utilities.getCookie("Notifies_AccountName")}
      </h1>
      <p style={{ textAlign: "center" }}>{Utilities.getCookie("Notifies_AccountEmail")}</p>
      <ToggleSwitch {...props} label='Twitch' token='Twitch' tokenExists={props.twitchToken} />
      <ToggleSwitch {...props} label='Youtube' token='Youtube' tokenExists={props.youtubeToken} />
      <ToggleSwitch {...props} label='TwitchVods' token='Twitch' tokenExists={props.twitchToken} />
      <br />
      <ToggleSwitchVideoHover
        enableHover={props.twitchVideoHoverEnable}
        setEnableHover={props.setTwitchVideoHoverEnable}
        feed='Twitch'
      />
      <ToggleSwitchVideoHover
        enableHover={props.youtubeVideoHoverEnable}
        setEnableHover={props.setYoutubeVideoHoverEnable}
        feed='Youtube'
      />
      <br></br>
      {!props.twitchToken ? (
        <StyledConnectTwitch
          onClick={() => {
            authenticatePopup(
              `Connect Twitch`,
              "Twitch",
              `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`,
              props.setTwitchToken,
              props.setEnableTwitch,
              props.setEnableTwitchVods
            );
          }}>
          Connect Twitch
          <Icon icon={twitch} size={24} style={{ paddingLeft: "0.75rem" }} />
        </StyledConnectTwitch>
      ) : (
        <div style={{ marginBottom: "10px", width: "280px" }}>
          <StyledConnectTwitch
            // className={styles.connectTwitch}
            style={{ marginRight: "25px" }}
            onClick={() => {
              authenticatePopup(
                `Connect Twitch`,
                "Twitch",
                `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`,
                props.setTwitchToken,
                props.setEnableTwitch,
                props.setEnableTwitchVods
              );
            }}>
            <Icon icon={ic_refresh} size={24} />
          </StyledConnectTwitch>
          <StyledConnectTwitch
            style={{ backgroundColor: "hsla(268, 77%, 15%, 1)" }}
            onClick={disconnectTwitch}>
            Disconnect Twitch
          </StyledConnectTwitch>
        </div>
      )}
      {!props.youtubeToken ? (
        <StyledConnectYoutube
          //to unfollow: scope=https://www.googleapis.com/auth/youtube
          //else  scope=https://www.googleapis.com/auth/youtube.readonly
          onClick={() => {
            authenticatePopup(
              `Connect Youtube`,
              "Youtube",
              `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly`,
              props.setYoutubeToken,
              props.setEnableYoutube
            );
          }}>
          Connect Youtube
          <Icon icon={youtube} size={24} style={{ paddingLeft: "0.75rem" }} />
        </StyledConnectYoutube>
      ) : (
        <div style={{ marginBottom: "10px", width: "280px" }}>
          <StyledConnectYoutube
            style={{ marginRight: "25px" }}
            //to unfollow: scope=https://www.googleapis.com/auth/youtube
            //else  scope=https://www.googleapis.com/auth/youtube.readonly
            onClick={() => {
              authenticatePopup(
                `Connect Youtube`,
                "Youtube",
                `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly`,
                props.setYoutubeToken,
                props.setEnableYoutube
              );
            }}>
            <Icon icon={ic_refresh} size={24} />
          </StyledConnectYoutube>
          <StyledConnectYoutube
            style={{ backgroundColor: "hsla(0, 65%, 10%, 1)" }}
            onClick={disconnectYoutube}>
            Disconnect Youtube
          </StyledConnectYoutube>
        </div>
      )}
      <Themeselector />
      <StyledLogoutContiner>
        {window.location.href !== "http://localhost:3000/account" ? (
          <Button
            label='linkAsButton'
            style={{ width: "100%", marginBottom: "10px" }}
            as={NavLink}
            to='/account'>
            Account page
            <Icon icon={ic_account_box} size={24} style={{ paddingLeft: "0.75rem" }} />
          </Button>
        ) : null}
        <Button style={{ width: "100%", marginBottom: "10px" }} onClick={logout}>
          Logout
          <Icon icon={out} size={24} style={{ paddingLeft: "0.75rem" }} />
        </Button>
      </StyledLogoutContiner>
    </div>
  );
};