import axios from "axios";

// import placeholder from "../../assets/images/placeholder.png";
import Utilities from "../../utilities/Utilities";

async function getFollowedOnlineStreams() {
  let error;

  async function getProfile(user, tx, db, store, index) {
    return new Promise(async (resolve, reject) => {
      tx = db.transaction("TwitchProfiles", "readonly");
      store = tx.objectStore("TwitchProfiles");
      index = store.index("user_id");

      let profile = await store.get(user);
      profile.onsuccess = () => {
        resolve(profile.result);
      };

      profile.onerror = error => {
        console.log("error: ", profile.result);
        reject(error);
      };
    });
  }

  try {
    let LiveFollowedStreams;

    // GET all followed channels.
    const followedchannels = await axios
      .get(`https://api.twitch.tv/helix/users/follows?`, {
        params: {
          from_id: 32540540,
          first: 100,
        },
        headers: {
          Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .catch(error => {
        console.error("-Error: ", error.message);
        this.setState({
          error: error,
        });
      });
    // Gets data from second page when there are more than 50 followed channels.
    if (followedchannels.data.data.length > 0 && followedchannels.data.total > 0) {
      if (followedchannels.data.data.length < followedchannels.data.total) {
        const secondPage = await axios.get(`https://api.twitch.tv/helix/users/follows?`, {
          params: {
            from_id: 32540540,
            first: 100,
            after: followedchannels.data.pagination.cursor,
          },
          headers: {
            Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        });

        secondPage.data.data.forEach(channel => {
          followedchannels.data.data.push(channel);
        });
      }

      // Make an array of all followed channels id's for easier/less API reuqests.
      const followedChannelsIds = await followedchannels.data.data.map(channel => {
        return channel.to_id;
      });

      // Get all Live-streams from followed channels.
      LiveFollowedStreams = await axios.get(`https://api.twitch.tv/helix/streams`, {
        params: {
          user_id: followedChannelsIds,
        },
        headers: {
          Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      });

      try {
        let request = window.indexedDB.open("Notifies", 1),
          db,
          tx,
          store,
          index;

        const handleAlldata = new Promise((resolve, reject) => {
          request.onupgradeneeded = function(event) {
            let db = request.result,
              store = db.createObjectStore("TwitchProfiles", { keyPath: "user_id" }),
              // eslint-disable-next-line
              index = store.createIndex("user_id", "user_id", { unique: false });
          };

          request.onerror = function(event) {
            alert("error opening database " + event.target.errorCode);
          };

          request.onsuccess = async function(event) {
            db = request.result;
            db.onerror = function(event) {
              console.log("Error: ", event.target.errorCode);
            };

            if (LiveFollowedStreams.data.data.length > 0) {
              await LiveFollowedStreams.data.data.map(async user => {
                let profileImgUrl;

                const profile = await getProfile(user.user_id, tx, db, store, index);

                if (!profile) {
                  profileImgUrl = await axios.get(`https://api.twitch.tv/helix/users?`, {
                    params: {
                      id: user.user_id,
                    },
                    headers: {
                      Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
                      "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                    },
                  });

                  user.profile_img_url = profileImgUrl.data.data[0].profile_image_url;

                  tx = db.transaction("TwitchProfiles", "readwrite");
                  store = tx.objectStore("TwitchProfiles");
                  index = store.index("user_id");

                  await store.put({
                    user_id: user.user_id,
                    url: profileImgUrl.data.data[0].profile_image_url,
                  });

                  tx.oncomplete = function(event) {
                    db.close();
                  };
                } else {
                  user.profile_img_url = profile.url;
                }
              });

              // Removes game id duplicates before sending game request.
              const games = [
                ...new Set(
                  LiveFollowedStreams.data.data.map(channel => {
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
              LiveFollowedStreams.data.data.map(stream => {
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
              LiveFollowedStreams.data.data.map(stream => {
                gameNames.data.data.find(game => {
                  return game.id === stream.game_id;
                }) !== undefined
                  ? (stream.game_img = gameNames.data.data.find(game => {
                      return game.id === stream.game_id;
                    }).box_art_url)
                  : (stream.game_img = `${process.env.PUBLIC_URL}/images/placeholder.png`);

                return undefined;
              });

              resolve();
            } else {
              // error = "No followed streams online at the momment";
              reject("No streams online at the momment");
            }
          };
        });

        await handleAlldata;
      } catch (e) {
        console.error(e);
        error = e;
        return { error: error, status: 201 };
      }
    }
    return {
      data: LiveFollowedStreams.data.data,
      status: 200,
      error: error,
    };
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

export default getFollowedOnlineStreams;
