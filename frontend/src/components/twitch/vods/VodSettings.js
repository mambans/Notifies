import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import Icon from "react-icons-kit";
import { deleteIconic } from "react-icons-kit/iconic/deleteIconic";

import Utilities from "../../../utilities/Utilities";

function AddChannelForm() {
  const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: event => {
          setValue(event.target.value);
        },
      },
    };
  };

  const [channels, setChannels] = useState();
  const { value: channel, bind: bindchannel, reset: resetchannel } = useInput("");

  async function addChannel() {
    try {
      await axios.post(`http://localhost:3100/notifies/vod-channels`, {
        channelName: channel,
      });

      // const localstorageChannels = JSON.parse(localStorage.getItem("VodChannels"));
      // localstorageChannels.unshift({ name: channel });

      // console.log("TCL: addChannel -> localstorageChannels", localstorageChannels);

      // await axios.put(
      //   `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
      //   {
      //     username: Utilities.getCookie("Notifies_AccountName"),
      //     channels: localstorageChannels,
      //   }
      // );

      getChannels();
    } catch (e) {
      console.log(e.message);
    }
  }

  async function removeChannel(channel) {
    try {
      await axios.delete(`http://localhost:3100/notifies/vod-channels`, {
        data: {
          channelName: channel,
        },
      });

      // const localstorageChannels = JSON.parse(localStorage.getItem("VodChannels"));

      // localstorageChannels.splice(
      //   localstorageChannels.findIndex(value => {
      //     return value.name === channel;
      //   }),
      //   1
      // );

      // await axios.put(
      //   `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
      //   {
      //     username: Utilities.getCookie("Notifies_AccountName"),
      //     channels: localstorageChannels,
      //   }
      // );

      getChannels();
    } catch (e) {
      console.log(e.message);
    }
  }

  const getChannels = useCallback(async () => {
    const monitoredChannels = await axios.get(`http://localhost:3100/notifies/vod-channels`);
    localStorage.setItem("VodChannels", JSON.stringify(monitoredChannels.data.channels));
    setChannels(monitoredChannels.data.channels);
  }, []);

  // const getChannels = useCallback(async () => {
  //   setChannels(await axios.get(`http://localhost:3100/notifies/vod-channels`));
  //   // localStorage.setItem("VodChannels", JSON.stringify(channels));
  // }, []);

  const handleSubmit = evt => {
    evt.preventDefault();
    addChannel();
    resetchannel();
  };

  useEffect(() => {
    getChannels();

    return () => {
      console.log("unloading vodSettings.");
    };
  }, [getChannels]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Add channel:
          <input type='text' placeholder='Channel name..' {...bindchannel} />
        </label>
        <input type='submit' value='Add' />
      </form>
      {channels ? (
        <ul>
          {channels.map(channel => {
            return (
              <li key={channel.name}>
                <p>{channel.name}</p>
                <Button
                  variant='danger'
                  size='sm'
                  onClick={() => {
                    removeChannel(channel.name);
                  }}>
                  <Icon icon={deleteIconic} size={24}></Icon>
                </Button>
              </li>
            );
          })}
        </ul>
      ) : (
        <Spinner animation='border' role='status' style={Utilities.loadingSpinner}>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      )}
    </>
  );
}

export default AddChannelForm;