import axios from 'axios';
import { getCookie } from '../../util/Utils';
import autoReauthenticate from './autoReauthenticate';

export default async ({ authKey = getCookie(`AioFeed_AuthKey`) } = {}) => {
  const access_token = getCookie('Youtube-access_token');

  if (access_token) {
    // console.log('Youtube: Validating token..');
    return await axios
      .post(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`)
      .then((res) => {
        // console.log('YouTube: Valid Access_token');
        return res;
      })
      .catch((error) => {
        console.warn('YouTube: Invalid Access_token');
        return autoReauthenticate({ authKey });
      });
  }
  console.warn('YouTube: No Access_token found');
  return autoReauthenticate({ authKey });
  // throw new Error('No tokens found.');
};
