import axios from 'axios';

const instanceAPI =  axios.create({
  baseURL: 'https://semargres.gmedia.id/api/',
  headers: {
    'Client-Service': 'frontend-client',
    'Auth-Key': 'gmedia_semargress',
    'Content-Type': 'application/json',

  },
});

const regisApi = (username,uid,token) => { 
  axios.create({
    baseURL: 'https://semargres.gmedia.id/api/',
    headers: {
      'Client-Service': 'frontend-client',
      'Auth-Key': 'gmedia_semargress',
      'Username' : username,
      'Uid' : uid,
      'Token' : token ,
      'Content-Type': 'application/json',
    },
  })
};

export {instanceAPI, regisApi};
