const html = require('choo/html');

function absoluteLink(path) {
  return typeof location === 'undefined'
    ? path
    : `${location.protocol}//${location.host}${path}`;
}

// eslint-disable-next-line no-unused-vars
module.exports = function(state, emit) {
  const user = state.user;
  const menu = user.loggedIn
    ? html`
    <ul class="account_dropdown">
      <li class="account_dropdown__text">
        ${user.email}
      </li>
      <li>
        <a class="account_dropdown__link" onclick=${logout}>${state.translate(
        'logOut'
      )}</a>
      </li>
    </ul>`
    : html`
    <ul class="account_dropdown"
          tabindex="-1"
    >
      <li>
        <a href="${absoluteLink('/api/fxa/login')}"
          class="account_dropdown__link">${state.translate(
            'signInMenuOption'
          )}</a>
      </li>
    </ul>
  `;

  return html`
    <div class="account">
      <div class="account__avatar">
        <img
          class="account__avatar"
          src="${user.avatar}"
          onclick=${avatarClick}
        />
      </div>
      ${menu}
    </div>`;

  function avatarClick(event) {
    event.preventDefault();
    const dropdown = document.querySelector('.account_dropdown');
    dropdown.classList.toggle('visible');
    dropdown.focus();
  }

  function logout(event) {
    event.preventDefault();
    state.user.logout();
    emit('render');
  }

  //the onblur trick makes links unclickable wtf
  /*
  function hideMenu(event) {
    event.stopPropagation();
    const dropdown = document.querySelector('.account_dropdown');
    dropdown.classList.remove('visible');
  }
  */
};
