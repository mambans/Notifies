import { RemoveCookie } from '../../../util/Utils';

export default (setMainState) => {
  RemoveCookie('AioFeed_AccountName');
  RemoveCookie('AioFeed_AccountEmail');
  RemoveCookie('AioFeed_AccountProfileImg');
  RemoveCookie('AioFeed_AuthKey');

  RemoveCookie('Twitch-access_token');
  RemoveCookie('Twitch-refresh_token');
  RemoveCookie('Twitch-userId');
  RemoveCookie('Twitch-username');
  RemoveCookie('Twitch-profileImg');
  RemoveCookie('Twitch_AutoRefresh');
  RemoveCookie('Twitch_FeedEnabled');
  RemoveCookie('Twitch-myState');
  localStorage.removeItem('Twitch-ChannelsUpdateNotifs');

  RemoveCookie('TwitchVods_FeedEnabled');
  localStorage.removeItem('TwitchVods-Channels');

  RemoveCookie('Twitter_FeedEnabled');
  localStorage.removeItem('Twitter-Lists');

  RemoveCookie('Youtube-access_token');
  RemoveCookie('YoutubeUsername');
  RemoveCookie('YoutubeProfileImg');
  RemoveCookie('Youtube_FeedEnabled');

  localStorage.removeItem('Unseen-notifications');
  localStorage.removeItem('YT-followedChannels');
  localStorage.removeItem('activeTheme');
  localStorage.removeItem('CustomFilters');
  localStorage.removeItem('Vods');
  localStorage.removeItem('FavoritesLists');
  localStorage.removeItem('TwitchChatState');
  localStorage.removeItem('Cached_SavedYoutubeVideos');
  localStorage.removeItem('notifications');
  localStorage.removeItem('Feed-size');
  localStorage.removeItem('ChannelsUpdateNotifs');

  setMainState();
};
