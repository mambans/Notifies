"use strict";

const vodChannelsUpdate = require("./vodChannelsUpdate");

exports.handler = async (event) => {
  try {
    const { username, channels, authkey } = JSON.parse(event.body);

    if (!username) throw new Error("`Username` is required");
    if (!authkey) throw new Error("`authkey` is required");
    if (!channels) throw new Error("`Channels` is required");

    const res = await vodChannelsUpdate({
      username,
      channels,
      authkey,
    }).catch((e) => {
      console.log(e);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res.Attributes.MonitoredChannels),
      headers: {
        "Access-Control-Allow-Origin": "https://aiofeed.com",
      },
    };
  } catch (e) {
    console.log("TCL: e", e);
    return {
      statusCode: 422,
      headers: {
        "Access-Control-Allow-Origin": "https://aiofeed.com",
      },
      // body: JSON.stringify(res.data),
    };
  }
};
