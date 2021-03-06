import React from 'react';
import { MdHighQuality } from 'react-icons/md';
import { GrRefresh } from 'react-icons/gr';
import ContextMenu from '../../ContextMenu';

export default ({
  PlayerUIControlls,
  TwitchPlayer,
  showAndResetTimer,
  setChatState,
  children,
  DEFAULT_CHAT_WIDTH,
  chatState,
  channelName,
}) => {
  return (
    <ContextMenu
      outerContainer={PlayerUIControlls}
      showAndResetTimer={showAndResetTimer}
      children={
        <>
          <li onClick={() => TwitchPlayer?.setQuality('chunked')}>
            <MdHighQuality size={24} />
            {'Max quality (Source)'}
          </li>
          {children}
          <li
            onClick={() => {
              setChatState({
                chatWidth: DEFAULT_CHAT_WIDTH,
                switchChatSide: false,
                hideChat: false,
              });
            }}
          >
            <GrRefresh size={24} />
            {'Reset chat position'}
          </li>
          <li
            onClick={() => {
              const confirmed = window.confirm('Reset ALL chat positions?');
              if (confirmed) {
                localStorage.setItem(
                  'TwitchChatState',
                  JSON.stringify({
                    [channelName?.toLowerCase()]: chatState,
                  })
                );

                setChatState({
                  chatWidth: DEFAULT_CHAT_WIDTH,
                  switchChatSide: false,
                  hideChat: false,
                });
              }
            }}
          >
            <GrRefresh size={24} />
            {'Reset ALL chat positions'}
          </li>
        </>
      }
    />
  );
};
