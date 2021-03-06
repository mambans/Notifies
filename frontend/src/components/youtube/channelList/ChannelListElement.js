import React from 'react';
import { MdDelete } from 'react-icons/md';
import styled from 'styled-components';

import { getCookie } from './../../../util/Utils';
import { UnfollowButton } from './../../sharedStyledComponents';
import UnfollowChannel from './unFollowChannel';
import useToken from '../useToken';

const ChannelListLi = styled.li`
  position: relative;
  height: 42px;
  border-bottom: thin solid #1e1616;

  a {
    color: ${({ selected }) => (selected ? '#ffffff' : 'inherit')};
    font-weight: ${({ selected }) => (selected ? 'bold' : 'unset')};

    > img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 3px;
    }
  }
`;

export default (data) => {
  const { channel, setNewChannels, videos, setVideos, selected } = data;
  const validateToken = useToken();

  const handleUnfollow = () => {
    validateToken().then(() =>
      UnfollowChannel({
        subscriptionId: channel.id,
        channelId: channel.snippet.resourceId.channelId,
        setChannels: setNewChannels,
        videos: videos,
        setVideos: setVideos,
      })
    );
  };

  return (
    <ChannelListLi
      key={channel.snippet.title}
      className={selected ? 'selected' : ''}
      selected={selected}
    >
      <a href={`https://www.youtube.com/channel/${channel.snippet.resourceId.channelId}`}>
        {channel.snippet.thumbnails.default.url ? (
          <img src={channel.snippet.thumbnails.default.url} alt=''></img>
        ) : (
          <img src={`${process.env.PUBLIC_URL}/images/placeholder.jpg`} alt=''></img>
        )}
        {channel.snippet.title}
      </a>
      <UnfollowButton
        disabled={getCookie('Youtube-readonly')}
        title={'Unfollow ' + channel.snippet.title}
        variant='link'
        onClick={handleUnfollow}
      >
        <MdDelete size={18} />
      </UnfollowButton>
    </ChannelListLi>
  );
};
