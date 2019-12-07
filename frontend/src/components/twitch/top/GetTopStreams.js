import axios from "axios";

import Utilities from "./../../../utilities/Utilities";

export default async game => {
  const topStreams = await axios
    .get(`https://api.twitch.tv/helix/streams`, {
      params: {
        first: 27,
        game_id: game && game.name !== "All" ? game.id : null,
      },
      headers: {
        Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
      },
    })
    .catch(error => {
      console.error(error.message);
      return error;
    });

  try {
    const TwitchProfiles = JSON.parse(localStorage.getItem("TwitchProfiles")) || {};

    await Promise.all(
      topStreams.data.data.map(async user => {
        if (!TwitchProfiles[user.user_id]) {
          const profileImgUrl = await axios.get(`https://api.twitch.tv/helix/users?`, {
            params: {
              id: user.user_id,
            },
            headers: {
              Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
              "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            },
          });

          user.profile_img_url = profileImgUrl.data.data[0].profile_image_url;
          TwitchProfiles[user.user_id] = profileImgUrl.data.data[0].profile_image_url;
        } else {
          user.profile_img_url = TwitchProfiles[user.user_id];
        }
      })
    );

    localStorage.setItem("TwitchProfiles", JSON.stringify(TwitchProfiles));

    // Removes game id duplicates before sending game request.
    const games = [
      ...new Set(
        topStreams.data.data.map(channel => {
          return channel.game_id;
        })
      ),
    ];

    // Get game names from their Id's.
    const gameNames = await axios.get(`https://api.twitch.tv/helix/games`, {
      params: {
        id: games,
      },
      headers: {
        Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
      },
    });

    // Add the game name to each stream object.
    topStreams.data.data.map(stream => {
      gameNames.data.data.find(game => {
        return game.id === stream.game_id;
      }) !== undefined
        ? (stream.game_name = gameNames.data.data.find(game => {
            return game.id === stream.game_id;
          }).name)
        : (stream.game_name = "");

      return undefined;
    });

    // Add the game img to each stream object.
    topStreams.data.data.map(stream => {
      gameNames.data.data.find(game => {
        return game.id === stream.game_id;
      }) !== undefined
        ? (stream.game_img = gameNames.data.data.find(game => {
            return game.id === stream.game_id;
          }).box_art_url)
        : (stream.game_img = `${process.env.PUBLIC_URL}/images/placeholder.png`);

      return undefined;
    });
  } catch (e) {
    console.error(e);
  }

  return topStreams;
};