import axios from 'axios';
import { SessionManager } from './SessionManager';

export const Api = axios.create({
    baseURL: 'https://semargres.gmedia.id/',
    headers: {
      Accept: 'application/json',
      'Client-Service': 'frontend-client',
      'Auth-Key': 'gmedia_semargress',
      'Content-Type': 'application/json',
    },
  });


// Intercept all requests
Api.interceptors.request.use(
  async (request) => {
    console.log(request, 'Cek Request');
    const session = await SessionManager.GetAsObject('@user')
    if (session != null) {
      request.headers.common['Uid'] = session.uid;
      request.headers.common['Token'] = session.token;
      request.headers.common['Username'] = session.email;
    }
    // console.log(request.headers)
    if (request.data) {
      console.log('request ', JSON.stringify(request.data));
    } else {
      console.log('request no data');
    }
    return request;
  },
  (error) => Promise.reject(error),
);

// Intercept all responses
Api.interceptors.response.use(
  async (response) => {
    console.log('response', response.data);
    return response;
  },
  (error) => {
    console.log('error message api interceptors '+error)
    let result = {
      status: '400',
      message: `Error : ${JSON.stringify(error.response)}`,
    };
    console.log(error);
    if (error == 'Error: Network Error') {
      result = {
        status: '400',
        message: 'Error : Cek Koneksi Anda.',
      };
    } else if (error.response.status) {
      switch (error.response.status) {
        case 401:
          result = {
            status: 'E',
            message: 'Error : Not Login or Token Expired.',
          };
          break;
        default:
          result = {status: 'E', message: 'Whoops, Something Bad happen. :)'};
          break;
      }
    }

    return Promise.reject(result);
  },
);

