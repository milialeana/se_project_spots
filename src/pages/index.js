import "./index.css";
import {
  enableValidation,
  validationConfig,
  disableButton,
  resetValidation,
} from "../scripts/validate.js";
import Api from "../utils/Api.js";
import { renderLoading } from "../utils/helpers.js";

// API instance
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "7a4cbe3d-1843-4925-ad81-cf16a73f8f62",
    "Content-Type": "application/json",
  },
});

// Fetch API info
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    profileElements.name.textContent = userInfo.name;
    profileElements.description.textContent = userInfo.about;
    profileElements.avatar.src = userInfo.avatar;

    cards.forEach((item) => elements.cardsList.append(getCardElement(item)));
  })
  .catch(console.error);

// Dom Elements
const profileElements = {
  editBtn: document.querySelector(".profile__edit-btn"),
  newPostBtn: document.querySelector(".profile__new-post-btn"),
  avatarBtn: document.querySelector(".profile__avatar-btn"),
  name: document.querySelector(".profile__name"),
  description: document.querySelector(".profile__description"),
  avatar: document.querySelector(".profile__avatar"),
};

const forms = {
  editProfile: document.forms["edit-profile-form"],
  addCard: document.forms["add-card-form"],
  editAvatar: document.forms["edit-avatar-form"],
  deleteCard: document.forms["delete-form"],
};

const inputs = {
  name: forms.editProfile.elements["name"],
  description: forms.editProfile.elements["description"],
  avatar: forms.editAvatar.elements["Avatar"],
  cardName: forms.addCard.elements["name"],
  cardLink: forms.addCard.elements["link"],
};

const modals = {
  delete: document.querySelector("#delete-modal"),
  preview: document.querySelector("#preview-modal"),
};

const elements = {
  cardsList: document.querySelector(".cards__list"),
  cardTemplate: document.querySelector("#card-template"),
};

let selectedCard, selectedCardId;

// Other ways to close the modal
const closeModal = (modal) => {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
};

const openModal = (modal) => {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
};

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) closeModal(openModal);
  }
}

// Overlay clicking
document.querySelectorAll(".modal").forEach((modal) =>
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) closeModal(modal);
  })
);

// El for close button
document
  .querySelectorAll(".modal__close")
  .forEach((btn) =>
    btn.addEventListener("click", () => closeModal(btn.closest(".modal")))
  );

// Submit handlers
function handleSubmit(apiMethod, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;

  renderLoading(true, submitButton, initialText, loadingText);

  apiMethod()
    .then(() => evt.target.reset())
    .catch(console.error)
    .finally(() => renderLoading(false, submitButton, initialText));
}

// Form handlers
function handleEditProfileSubmit(evt) {
  handleSubmit(
    () =>
      api
        .editUserInfo({
          name: inputs.name.value,
          about: inputs.description.value,
        })
        .then(() => {
          profileElements.name.textContent = inputs.name.value;
          profileElements.description.textContent = inputs.description.value;
          closeModal(forms.editProfile.closest(".modal"));
        }),
    evt
  );
}

function handleAddCardSubmit(evt) {
  handleSubmit(
    () =>
      api
        .addCard({
          name: inputs.cardName.value,
          link: inputs.cardLink.value,
        })
        .then((cardData) => {
          elements.cardsList.prepend(getCardElement(cardData));
          disableButton(evt.submitter, validationConfig);
          closeModal(forms.addCard.closest(".modal"));
        }),
    evt
  );
}

function handleAvatarSubmit(evt) {
  handleSubmit(
    () =>
      api
        .updateAvatar({
          avatar: inputs.avatar.value,
        })
        .then((data) => {
          profileElements.avatar.src = data.avatar;
          closeModal(forms.editAvatar.closest(".modal"));
          disableButton(evt.submitter, validationConfig);
        }),
    evt
  );
}

// Delete a card
function handleDeleteSubmit(evt) {
  handleSubmit(
    () =>
      api.deleteCard(selectedCardId).then(() => {
        if (selectedCard) selectedCard.remove();
        closeModal(modals.delete);
      }),
    evt,
    "Deleting..."
  );
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(modals.delete);
}

forms.deleteCard.addEventListener("submit", handleDeleteSubmit);

// Handles the like button
function handleLike(evt, id) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-btn_active");

  api
    .changeLikeStatus(id, isLiked)
    .then(() => likeButton.classList.toggle("card__like-btn_active", !isLiked))
    .catch(console.error);
}

// Create a card
function getCardElement(data) {
  const cardElement = elements.cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardElement.dataset.id = data._id;

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name || "Image";

  if (data.isLiked) cardLikeBtn.classList.add("card__like-btn_active");

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  return cardElement;
}

// El to modals and forms
function setupModal(button, form, reset = false) {
  button.addEventListener("click", () => {
    if (reset) form.reset();
    resetValidation(form, validationConfig);
    openModal(form.closest(".modal"));
  });
}

setupModal(profileElements.editBtn, forms.editProfile);
setupModal(profileElements.newPostBtn, forms.addCard, true);
setupModal(profileElements.avatarBtn, forms.editAvatar, true);

forms.editProfile.addEventListener("submit", handleEditProfileSubmit);
forms.addCard.addEventListener("submit", handleAddCardSubmit);
forms.editAvatar.addEventListener("submit", handleAvatarSubmit);
forms.deleteCard.addEventListener("submit", handleDeleteSubmit);

document
  .querySelector(".modal__button--cancel")
  .addEventListener("click", () => closeModal(modals.delete));

enableValidation(validationConfig);
