import axios from "axios";

async function getFollowedChannels() {
  try {
    if (
      !localStorage.getItem(`followedChannels`) ||
      JSON.parse(localStorage.getItem(`followedChannels`)).casheExpire <= new Date()
    ) {
      console.log("Youtube: Followed-channels REQUEST sent.");

      const firstPage = await axios.get(`https://www.googleapis.com/youtube/v3/subscriptions?`, {
        params: {
          maxResults: 50,
          mine: true,
          part: "snippet",
          order: "relevance",
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("Youtube-access_token"),
          Accept: "application/json",
        },
      });

      const CheckNextPage =
        firstPage.data.pageInfo.totalResults / firstPage.data.pageInfo.resultsPerPage;

      if (CheckNextPage >= 1) {
        const secondPage = await axios.get(`https://www.googleapis.com/youtube/v3/subscriptions?`, {
          params: {
            maxResults: 50,
            mine: true,
            part: "snippet",
            order: "relevance",
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
            pageToken: firstPage.data.nextPageToken,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Youtube-access_token"),
            Accept: "application/json",
          },
        });
        let currentTime = new Date();

        localStorage.setItem(
          `followedChannels`,
          JSON.stringify({
            data: firstPage.data.items.concat(secondPage.data.items),
            casheExpire: currentTime.setHours(currentTime.getHours() + 12),
          })
        );

        return JSON.parse(localStorage.getItem("followedChannels")).data;
      } else {
        return firstPage;
      }
    } else {
      console.log("Youtube: Followed-channels cashe used.");
      return JSON.parse(localStorage.getItem("followedChannels")).data;
    }
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
}

export default getFollowedChannels;