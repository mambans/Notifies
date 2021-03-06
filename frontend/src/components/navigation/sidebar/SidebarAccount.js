import { Button } from 'react-bootstrap';
import { GoSignOut } from 'react-icons/go';
import React, { useContext, useState, useCallback } from 'react';
import { MdVideocam, MdAutorenew, MdStar } from 'react-icons/md';
import { FaTwitch, FaYoutube, FaTwitter, FaRegWindowRestore } from 'react-icons/fa';
import { FiSidebar } from 'react-icons/fi';
import { TiFlash } from 'react-icons/ti';
import { AiOutlineDisconnect } from 'react-icons/ai';
import Slider from 'react-rangeslider';
import { debounce } from 'lodash';

import { AddCookie, getCookie } from '../../../util/Utils';
import AccountContext from './../../account/AccountContext';
import ClearAllAccountCookiesStates from './ClearAllAccountCookiesStates';
import DeleteAccountButton from './DeleteAccountButton';
import FeedsContext from './../../feed/FeedsContext';
import ReAuthenticateButton from './ReAuthenticateButton';
import Themeselector from './../../themes/Themeselector';
import ToggleButton from './ToggleButton';
import UpdateProfileImg from './UpdateProfileImg';
import UpdateTwitterLists from './UpdateTwitterLists';
import disconnectYoutube from './../../youtube/disconnectYoutube';
import disconnectTwitch from './../../twitch/disconnectTwitch';
import TwitterForms from './TwitterForms';
import {
  StyledProfileImg,
  StyledLogoutContiner,
  ShowAddFormBtn,
  CloseAddFormBtn,
  ProfileImgContainer,
  ToggleButtonsContainer,
  ToggleButtonsContainerHeader,
} from './StyledComponent';
import { TwitchContext } from '../../twitch/useToken';
import { YoutubeContext } from '../../youtube/useToken';
import { FeedSizeSlider } from '../StyledComponents';

export default () => {
  const {
    username,
    setUsername,
    profileImage,
    setTwitchToken,
    setYoutubeToken,
    youtubeToken,
  } = useContext(AccountContext);

  const {
    setAutoRefreshEnabled,
    autoRefreshEnabled,
    twitchVideoHoverEnable,
    setTwitchVideoHoverEnable,
    isEnabledOfflineNotifications,
    setIsEnabledOfflineNotifications,
    isEnabledUpdateNotifications,
    setIsEnabledUpdateNotifications,
  } = useContext(TwitchContext);

  const { youtubeVideoHoverEnable, setYoutubeVideoHoverEnable } = useContext(YoutubeContext);

  const {
    enableTwitch,
    setEnableTwitch,
    enableTwitchVods,
    setEnableTwitchVods,
    showTwitchSidebar,
    setShowTwitchSidebar,
    enableYoutube,
    setEnableYoutube,
    enableFavorites,
    setEnableFavorites,
    enableTwitter,
    setEnableTwitter,
    feedSize,
    setFeedSize,
  } = useContext(FeedsContext) || {};

  const [showAddImage, setShowAddImage] = useState(false);
  const [sizeValue, setSizeValue] = useState(feedSize);

  const logout = () => ClearAllAccountCookiesStates(setUsername);

  const delayedHandleChange = useCallback(
    debounce((v) => setFeedSize(v), 250, { leading: true, maxWait: 1000 }),
    []
  );

  const handleChange = (v) => {
    setSizeValue(v);
    delayedHandleChange(v);
  };

  return (
    <>
      <div style={{ minHeight: 'calc(100% - 120px)' }}>
        <ProfileImgContainer>
          {showAddImage ? (
            <CloseAddFormBtn onClick={() => setShowAddImage(false)} />
          ) : (
            <ShowAddFormBtn onClick={() => setShowAddImage(true)}>
              Change Profile image
            </ShowAddFormBtn>
          )}
          {showAddImage && <UpdateProfileImg close={() => setShowAddImage(false)} />}
          <StyledProfileImg
            src={profileImage || `${process.env.PUBLIC_URL}/images/placeholder.jpg`}
            alt=''
          />
        </ProfileImgContainer>
        <h1 style={{ fontSize: '2rem', textAlign: 'center' }} title='Username'>
          {username}
        </h1>
        <p style={{ textAlign: 'center' }} title='Email'>
          {getCookie('AioFeed_AccountEmail')}
        </p>
        <ToggleButtonsContainerHeader>Feeds</ToggleButtonsContainerHeader>
        <ToggleButtonsContainer>
          <ToggleButton
            setEnable={(value) => {
              setEnableTwitch(value);
              AddCookie('Twitch_FeedEnabled', value);
            }}
            enabled={enableTwitch}
            label='Twitch'
            serviceName='Twitch'
            tokenExists={getCookie(`Twitch-access_token`)}
            scrollIntoView={true}
            tooltip={
              getCookie(`Twitch-access_token`)
                ? (enableTwitch ? 'Disable ' : 'Enable ') + ` Twitch feed`
                : `Need to connect/authenticate with a Twitch account first.`
            }
            icon={<FaTwitch size={24} color='rgb(169, 112, 255)' />}
          />

          <ToggleButton
            setEnable={(value) => {
              setEnableTwitter(value);
              AddCookie('Twitter_FeedEnabled', value);
            }}
            serviceName='Twitter'
            enabled={enableTwitter}
            label='Twitter'
            tokenExists={true}
            tooltip={(enableTwitter ? 'Disable ' : 'Enable ') + ` Twitter feed`}
            icon={<FaTwitter size={24} color='rgb(29, 161, 242)' />}
          />
          <ToggleButton
            setEnable={(value) => {
              setEnableYoutube(value);
              AddCookie('Youtube_FeedEnabled', value);
            }}
            enabled={enableYoutube}
            label='Youtube'
            serviceName='Youtube'
            tokenExists={youtubeToken}
            scrollIntoView={true}
            tooltip={
              youtubeToken
                ? (enableYoutube ? 'Disable ' : 'Enable ') + ` Twitch feed`
                : `Need to connect/authenticate with a Youtube account first.`
            }
            icon={<FaYoutube size={24} color='rgb(255, 0, 0)' />}
          />
          <ToggleButton
            setEnable={(value) => {
              setEnableTwitchVods(value);
              AddCookie('TwitchVods_FeedEnabled', value);
            }}
            enabled={enableTwitchVods}
            label='TwitchVods'
            serviceName='TwitchVods'
            tokenExists={getCookie(`Twitch-access_token`)}
            scrollIntoView={true}
            tooltip={
              getCookie(`Twitch-access_token`)
                ? (enableTwitchVods ? 'Disable ' : 'Enable ') + ` Twitch feed`
                : `Need to connect/authenticate with a Twitch account first.`
            }
            icon={<MdVideocam size={24} color='rgb(169, 112, 255)' />}
          />
          <ToggleButton
            setEnable={(value) => {
              setEnableFavorites(value);
              AddCookie('Favorites_FeedEnabled', value);
            }}
            enabled={enableFavorites}
            label='Favorites'
            serviceName='Favorites'
            tokenExists={getCookie(`Twitch-access_token`) || youtubeToken}
            scrollIntoView={true}
            tooltip={(enableFavorites ? 'Disable ' : 'Enable ') + ` Favorites feed`}
            icon={<MdStar size={24} color='rgb(255,255,0)' />}
          />
        </ToggleButtonsContainer>

        {enableTwitter && (
          <>
            <TwitterForms />
            <UpdateTwitterLists style={{ opacity: '0.5', transition: 'opacity 250ms' }} />
          </>
        )}
        <br />
        <ToggleButtonsContainerHeader>Settings</ToggleButtonsContainerHeader>
        {(enableTwitch || enableTwitchVods || enableYoutube || enableFavorites) && (
          <FeedSizeSlider>
            Feed video size
            <Slider
              value={sizeValue || 100}
              // step={10}
              format={(v) => parseInt(v)}
              orientation='horizontal'
              onChange={handleChange}
              min={30}
              max={100}
              tooltip={true}
            />
          </FeedSizeSlider>
        )}
        <ToggleButtonsContainer buttonsperrow={3}>
          <ToggleButton
            setEnable={(value) => {
              setAutoRefreshEnabled(value);
              AddCookie('Twitch_AutoRefresh', value);
            }}
            enabled={autoRefreshEnabled}
            label='Twitch auto-refresh (25s)'
            serviceName='Twitch'
            tokenExists={getCookie(`Twitch-access_token`)}
            tooltip={
              getCookie(`Twitch-access_token`)
                ? (autoRefreshEnabled ? 'Disable ' : 'Enable ') + `Twitch auto refresh`
                : `Need to connect/authenticate with a Twitch account first.`
            }
            icon={<MdAutorenew size={18} color='rgb(169, 112, 255)' />}
          />
          <ToggleButton
            setEnable={(value) => {
              setShowTwitchSidebar(value);
              AddCookie('Twitch_SidebarEnabled', value);
            }}
            enabled={showTwitchSidebar}
            label='Twitch sidebar'
            serviceName='Twitch'
            tokenExists={getCookie(`Twitch-access_token`)}
            tooltip={
              getCookie(`Twitch-access_token`)
                ? (showTwitchSidebar ? 'Hide ' : 'Show ') + `Twitch Sidebar`
                : `Need to connect/authenticate with a Twitch account first.`
            }
            icon={<FiSidebar size={18} color='rgb(169, 112, 255)' />}
          />
          <ToggleButton
            setEnable={(value) => {
              setIsEnabledUpdateNotifications(value);
              AddCookie('Twitch_update_notifications', value);
            }}
            enabled={isEnabledUpdateNotifications}
            label='Twitch update notifications'
            serviceName='Twitch'
            tokenExists={getCookie(`Twitch-access_token`)}
            tooltip={
              getCookie(`Twitch-access_token`)
                ? (isEnabledUpdateNotifications ? 'Disable ' : 'Enable ') +
                  `notifications for when streams title or game changes`
                : `Need to connect/authenticate with a Twitch account first.`
            }
            icon={<TiFlash size={18} color='rgb(169, 112, 255)' />}
          />
          <ToggleButton
            setEnable={(value) => {
              setIsEnabledOfflineNotifications(value);
              AddCookie('Twitch_offline_notifications', value);
            }}
            enabled={isEnabledOfflineNotifications}
            label='Twitch offline notifications'
            serviceName='Twitch'
            tokenExists={getCookie(`Twitch-access_token`)}
            tooltip={
              getCookie(`Twitch-access_token`)
                ? (isEnabledOfflineNotifications ? 'Disable ' : 'Enable ') +
                  `notifications for when streams go offline`
                : `Need to connect/authenticate with a Twitch account first.`
            }
            icon={<AiOutlineDisconnect size={18} color='rgb(169, 112, 255)' />}
          />

          <ToggleButton
            setEnable={(value) => {
              setTwitchVideoHoverEnable(value);
              AddCookie('TwitchVideoHoverEnabled', value);
            }}
            enabled={twitchVideoHoverEnable}
            label='Twitch hover-video'
            serviceName='Twitch'
            tokenExists={getCookie(`Twitch-access_token`)}
            tooltip={
              getCookie(`Twitch-access_token`)
                ? (twitchVideoHoverEnable ? 'Disable ' : 'Enable ') + `live video preview on hover`
                : `Need to connect/authenticate with a Youtube account first.`
            }
            icon={<FaRegWindowRestore size={18} />}
            smallerIcons={<FaTwitch size={14} color='rgb(169, 112, 255)' />}
          />
          <ToggleButton
            setEnable={(value) => {
              setYoutubeVideoHoverEnable(value);
              AddCookie('YoutubeVideoHoverEnabled', value);
            }}
            enabled={youtubeVideoHoverEnable}
            label='Youtube hover-video'
            serviceName='Youtube'
            tokenExists={youtubeToken}
            tooltip={
              youtubeToken
                ? (youtubeVideoHoverEnable ? 'Disable ' : 'Enable ') + `video on hover`
                : `Need to connect/authenticate with a Youtube account first.`
            }
            icon={<FaRegWindowRestore size={18} />}
            smallerIcons={<FaYoutube size={14} color='rgb(255, 0, 0)' />}
          />
        </ToggleButtonsContainer>
        <br />

        <ReAuthenticateButton
          disconnect={() => disconnectTwitch({ setTwitchToken, setEnableTwitch })}
          serviceName={'Twitch'}
        />
        <ReAuthenticateButton
          disconnect={() => disconnectYoutube({ setYoutubeToken, setEnableYoutube })}
          serviceName={'Youtube'}
        />
        <Themeselector />
      </div>
      <StyledLogoutContiner>
        <DeleteAccountButton />
        <Button style={{ width: '100%' }} label='logout' onClick={logout} variant='secondary'>
          Logout
          <GoSignOut size={24} style={{ marginLeft: '0.75rem' }} />
        </Button>
      </StyledLogoutContiner>
    </>
  );
};
