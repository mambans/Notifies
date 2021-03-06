import { FaList } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';
import React, { useContext, useState, useCallback } from 'react';

import {
  VideoAndChatContainer,
  ShowNavbarBtn,
  ResizeDevider,
  VolumeEventOverlay,
  PlayerExtraButtons,
} from './twitch/player/StyledComponents';
import NavigationContext from './navigation/NavigationContext';
import FavoriteButton from './favorites/buttonList/FavoriteButton';
import useQuery from './../hooks/useQuery';
import PlaylistInPlayer from './youtube/PlaylistInPlayer';
import useSyncedLocalState from '../hooks/useSyncedLocalState';
import YoutubeVideoPlayer from './youtube/YoutubeVideoPlayer';
import VideoPlayer from './twitch/player/VideoPlayer';
import useFullscreen from '../hooks/useFullscreen';

const DEFAULT_LIST_WIDTH = Math.max(window.innerWidth * 0.1, 400);

export default () => {
  const location = useLocation();
  const { videoId, channelName } = useParams() || {};
  const { visible } = useContext(NavigationContext);
  const listName = useQuery().get('list') || useQuery().get('listName') || null;
  const [viewStates, setViewStates] = useSyncedLocalState(`${listName}-viewStates`, {
    listWidth: DEFAULT_LIST_WIDTH,
    hideList: false,
    default: true,
  });
  const [resizeActive, setResizeActive] = useState(false);

  useFullscreen();

  const handleResizeMouseDown = () => setResizeActive(true);
  const handleResizeMouseUp = (e) => setResizeActive(false);
  const resize = useCallback(
    (e) => {
      if (resizeActive) {
        const mouseX = e.clientX;

        const newWidth = Math.min(
          Math.max(parseInt(window.innerWidth - mouseX), 10),
          window.innerWidth - 250
        );

        setViewStates((curr) => {
          delete curr?.default;
          return { ...curr, listWidth: newWidth };
        });
      }
    },
    [resizeActive, setViewStates]
  );
  return (
    <>
      <VideoAndChatContainer
        id='twitch-embed'
        visible={visible}
        chatwidth={viewStates.listWidth || DEFAULT_LIST_WIDTH}
        resizeActive={resizeActive}
        hidechat={viewStates.hideList || !listName}
        onMouseUp={handleResizeMouseUp}
        onMouseMove={resize}
      >
        <FavoriteButton
          videoId_p={videoId}
          style={{
            right: listName && !viewStates.hideList ? `${viewStates.listWidth + 15}px` : '15px',
            top: '55px',
            opacity: '1',
          }}
          size={32}
        />
        <PlayerExtraButtons channelName={channelName}>
          {listName && (
            <ShowNavbarBtn
              variant='dark'
              onClick={() => {
                setViewStates((curr) => {
                  const newValue = !curr.hideList;
                  delete curr?.default;

                  return { ...curr, hideList: newValue };
                });
              }}
            >
              <FaList
                style={{
                  transform: visible ? 'rotateX(180deg)' : 'unset',
                  right: '10px',
                }}
                size={30}
                title='Show list'
              />
              List
            </ShowNavbarBtn>
          )}
        </PlayerExtraButtons>
        <VolumeEventOverlay
          show={resizeActive}
          type='live'
          id='controls'
          hidechat={String(viewStates.hideList)}
          chatwidth={viewStates.listWidth || DEFAULT_LIST_WIDTH}
        />

        {location.pathname.split('/')[1] === 'youtube' ? (
          <YoutubeVideoPlayer />
        ) : (
          <VideoPlayer
            listIsOpen={listName && !viewStates.hideList}
            listWidth={viewStates.listWidth}
          />
        )}
        {/* {children} */}

        {!viewStates.hideList && listName && (
          <>
            <ResizeDevider
              onMouseDown={handleResizeMouseDown}
              resizeActive={resizeActive}
              chatwidth={viewStates.listWidth}
            >
              <div />
            </ResizeDevider>
            <div id='chat'>
              <PlaylistInPlayer listName={listName} />
            </div>
          </>
        )}
      </VideoAndChatContainer>
    </>
  );
};
