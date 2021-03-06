import axios from 'axios';
import { getCookie, getLocalstorage } from './../../../util/Utils';

export default async ({ subscriptionId, channelId, setChannels, videos, setVideos }) => {
  const followedChannels = getLocalstorage(`YT-followedChannels`) || [];
  const newFollowedChannels = followedChannels.data.filter(
    (channel) => channel.id !== subscriptionId
  );
  const newFilteredVideos = videos.filter((video) => video.snippet.channelId !== channelId);

  setChannels(newFollowedChannels);
  setVideos(newFilteredVideos);

  localStorage.setItem(
    `YT-followedChannels`,
    JSON.stringify({
      data: newFollowedChannels,
      casheExpire: followedChannels.casheExpire,
    })
  );

  await axios.delete(`https://www.googleapis.com/youtube/v3/subscriptions`, {
    params: {
      id: subscriptionId,
      key: process.env.REACT_APP_YOUTUBE_API_KEY,
    },
    headers: {
      Authorization: 'Bearer ' + getCookie('Youtube-access_token'),
      Accept: 'application/json',
    },
  });
};
