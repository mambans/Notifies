import React from 'react';
import { Link } from 'react-router-dom';

import VodsFollowUnfollowBtn from './VodsFollowUnfollowBtn';
import { VodChannelListLi } from './StyledComponents';

export default ({ channel, param_Channels }) => {
  return (
    <VodChannelListLi>
      <Link to={`/${channel}/page`}>{channel}</Link>
      <VodsFollowUnfollowBtn channel={channel} param_Channels={param_Channels} />
    </VodChannelListLi>
  );
};
