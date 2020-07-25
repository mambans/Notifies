import React, { useState } from 'react';
import { MdSettings } from 'react-icons/md';

import { ButtonShowQualities, QualitiesList } from './StyledComponents';
import useEventListener from '../../../hooks/useEventListener';

export default ({ TwitchPlayer }) => {
  const [showQualities, setShowQualities] = useState();
  const [qualities, setQualities] = useState();
  const [activeQuality, setActiveQuality] = useState();

  useEventListener(window.Twitch.Player.PLAYING, onPlaying, TwitchPlayer);

  function onPlaying() {
    const defaultQuality = TwitchPlayer.getQuality();
    setActiveQuality(
      TwitchPlayer.getQualities().find((quality) => {
        return quality.group === defaultQuality;
      })
    );
  }

  return (
    <>
      {showQualities && qualities && (
        <QualitiesList>
          {qualities.map((quality) => {
            return (
              <li
                key={quality.name}
                onClick={() => {
                  TwitchPlayer.setQuality(quality.group);
                  setActiveQuality(quality);
                  setShowQualities(false);
                }}
              >
                {quality.name}
              </li>
            );
          })}
        </QualitiesList>
      )}
      <ButtonShowQualities
        id='showQualities'
        title='Show qualities'
        disabled={!TwitchPlayer}
        onClick={() => {
          setShowQualities(!showQualities);
          setQualities(TwitchPlayer.getQualities());
        }}
      >
        <MdSettings size={24} />
        {activeQuality ? activeQuality.name : TwitchPlayer && TwitchPlayer.getQuality().name}
      </ButtonShowQualities>
    </>
  );
};
