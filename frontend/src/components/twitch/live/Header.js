import React from 'react';
import AllFiltersList from '../CustomFilters/AllFiltersList';

import { HeaderContainer } from './../../sharedStyledComponents';
import ChannelSearchList from './../channelList';

export default ({ data }) => {
  const { refreshing, autoRefreshEnabled, refreshTimer, refresh } = data;

  return (
    <HeaderContainer
      id='TwitchHeader'
      text={
        <>
          Twitch <span id='live-indicator'>Live</span>
        </>
      }
      onHoverIconLink='live'
      refreshTimer={refreshTimer}
      autoRefreshEnabled={autoRefreshEnabled}
      isLoading={refreshing}
      refreshFunc={() => refresh({ forceRefreshThumbnails: true, forceValidateToken: true })}
      rightSide={
        <>
          <AllFiltersList />
          <ChannelSearchList placeholder='...' />
        </>
      }
    />
  );
};
