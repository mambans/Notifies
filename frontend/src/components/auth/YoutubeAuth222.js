import React, { useEffect, useState, useCallback } from 'react';
import uniqid from 'uniqid';

import AlertHandler from './../alert';
import { AddCookie } from '../../util/Utils';
import LoadingIndicator from '../LoadingIndicator';

function YoutubeAuth() {
  const [error, setError] = useState();

  const initiateAuth = useCallback(async () => {
    const generateOrginState = async () => uniqid();

    const orginState = await generateOrginState();

    AddCookie('Youtube-myState', orginState);

    // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/youtube/auth&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly&include_granted_scopes=true&state=${myState.current}`;

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=https://aiofeed.com/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube&include_granted_scopes=true&state=${orginState}`;
  }, []);

  useEffect(() => {
    (async () => {
      const url = new URL(window.location.href);

      try {
        url.href === 'https://aiofeed.com/auth/youtube'
          ? await initiateAuth()
          : setError({ message: 'Visit account page to authendicate with Twitch.' });
      } catch (error) {
        setError(error);
      }
    })();
  }, [initiateAuth]);

  if (error) return <AlertHandler data={error} />;
  return <LoadingIndicator height={150} width={150} />;
}

export default YoutubeAuth;
