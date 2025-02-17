class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _request(endpoint, options = {}) {
    return fetch(`${this._baseUrl}${endpoint}`, {
      headers: this._headers,
      ...options,
    }).then(this._handleResponse);
  }

  _handleResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  getInitialCards() {
    return this._request("/cards");
  }

  getUserInfo() {
    return this._request("/users/me");
  }

  editUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  updateAvatar(avatar) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify(avatar),
    });
  }

  addCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(id) {
    return this._request(`/cards/${id}`, {
      method: "DELETE",
    });
  }

  changeLikeStatus(id, isLiked) {
    return this._request(`/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
    });
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }
}

export default Api;
