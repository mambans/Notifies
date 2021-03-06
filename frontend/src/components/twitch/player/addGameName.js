import API from '../API';
import { getLocalstorage } from '../../../util/Utils';

export default async ({ streamInfo, newStreamInfo }) => {
  try {
    if (!streamInfo || streamInfo?.game_id !== newStreamInfo) {
      const cachedGameInfo = getLocalstorage('Twitch_game_details') || { data: [] };
      const foundCachedGame = cachedGameInfo.data.find(
        (game) => game?.id === newStreamInfo?.game_id
      );

      const gameInfo =
        foundCachedGame ||
        (newStreamInfo?.game_id &&
          (await API.getGames({
            params: {
              id: newStreamInfo?.game_id,
            },
          }).then((res) => res.data.data[0])));

      if (!foundCachedGame && gameInfo) {
        localStorage.setItem(
          'Twitch_game_details',
          JSON.stringify({
            data: [...cachedGameInfo.data, gameInfo],
            expire: cachedGameInfo.expire,
          })
        );
      }

      return { ...newStreamInfo, game_name: gameInfo?.name };
    }
    return newStreamInfo;
  } catch (error) {
    console.log('error', error);
  }
};
