import addSystemNotification from "./addSystemNotification";
import FetchSingelChannelVods from "./../vods/FetchSingelChannelVods";
import { getLocalstorage } from "../../../util/Utils";

export default async ({
  liveStreams,
  oldLiveStreams,
  newlyAddedStreams,
  setVods,
  enableTwitchVods,
  setUnseenNotifications,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      const newLive = liveStreams.current.filter((stream) => {
        return !oldLiveStreams.current.find(({ user_name }) => stream.user_name === user_name);
      });
      if (newLive.length <= 0) reject("No new LIVE streams");
      resolve(newLive);
    });
    if (document.title.length > 15) {
      const title = document.title.substring(4);
      const count = parseInt(document.title.substring(1, 2)) + res.length;
      document.title = `(${count}) ${title}`;
    } else {
      const title_1 = document.title;
      document.title = `(${1}) ${title_1}`;
    }
    res.map((stream) => {
      newlyAddedStreams.current.push(stream.user_name);
      stream.newlyAdded = true;
      stream.status = "Live";
      addSystemNotification({
        status: "online",
        stream: stream,
        newlyAddedStreams: newlyAddedStreams,
        setUnseenNotifications: setUnseenNotifications,
      });
      if (
        enableTwitchVods &&
        getLocalstorage("VodChannels").includes(stream.user_name.toLowerCase())
      ) {
        setTimeout(async () => {
          await FetchSingelChannelVods(stream.user_id, setVods);
        }, 30000);
      }
      return "";
    });
    return res;
  } catch (e) {
    return [];
  }
};