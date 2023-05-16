import { optionsApi } from './const.js';

class Api {
  constructor({ url, cohort, token }) {
    this._cohort = cohort;
    this._token = token;
    this._url = url;
  }

  _getResponseData(res) {
    return res.ok ? res.json() : Promise.reject();
  }

  getCards() {
    return fetch(`${this._url}${this._cohort}/cards`, {
      headers: {
        authorization: this._token
      }
    })
      .then((res) => this._getResponseData(res))
  };

  sendCard({ name, link }) {
    return fetch(`${this._url}${this._cohort}/cards`, {
      method: 'POST',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
      .then((res) => this._getResponseData(res));
  };

  deleteCard(cardId) {
    return fetch(`${this._url}${this._cohort}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this._token
      }
    })
      .then((res) => this._getResponseData(res));
  };

  getUserInfo() {
    return fetch(`${this._url}${this._cohort}/users/me`, {
      headers: {
        authorization: this._token
      }
    })
      .then((res) => this._getResponseData(res));
  };

  updateUserInfo({ name, about }) {
    return fetch(`${this._url}${this._cohort}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then((res) => this._getResponseData(res));
  };

  updateUserAvatar({ avatar }) {
    return fetch(`${this._url}${this._cohort}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: avatar
      })
    })
      .then((res) => this._getResponseData(res));
  }

  sendLike(cardId) {
    return fetch(`${this._url}${this._cohort}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => this._getResponseData(res));
  };

  deleteLike(cardId) {
    return fetch(`${this._url}${this._cohort}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: this._token
      }
    })
      .then((res) => this._getResponseData(res));
  };
}

export default  Api;
export const api = new Api(optionsApi);