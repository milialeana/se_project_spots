import "./index.css";
import {
  enableValidation,
  validationConfig,
  disableButton,
  resetValidation,
} from "../scripts/validate.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

import valThorensImg from "../images/val-thorens.jpg";
import restaurantTerraceImg from "../images/restaurant-terrace.jpg";
import outdoorCafeImg from "../images/outdoor-cafe.jpg";
import longBridgeImg from "../images/long-bridge.jpg";
import tunnelImg from "../images/tunnel.jpg";
import logCabinImg from "../images/log-cabin.jpg";

const initialCards = [
  {
    name: "Val Thorens",
    link: valThorensImg,
  },
  {
    name: "Restaurant terrace",
    link: restaurantTerraceImg,
  },
  {
    name: "An outdoor cafe",
    link: outdoorCafeImg,
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: longBridgeImg,
  },
  {
    name: "Tunnel with morning light",
    link: tunnelImg,
  },
  {
    name: "Log Cabin in snow",
    link: logCabinImg,
  },
];

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
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });

    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatarEl.src = userInfo.avatar;
  })
  .catch(console.error);

// Profile elements
const editModalBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__new-post-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

// Form elements
const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");

// Card Form elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__button");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

// Avatar Form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

// Preview Elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

// Card-related elements
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

// Store selected card and ID
let selectedCard, selectedCardId;

// Escape Key Closure
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) closeModal(openModal);
  }
}

// Open modal function
function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
}

// Close modal function
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

// Closing via overlay click
function enableOverlayClose() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) closeModal(modal);
    });
  });
}

// Attach close event listeners
function setModalCloseListeners() {
  document
    .querySelectorAll(".modal__close")
    .forEach((btn) =>
      btn.addEventListener("click", () => closeModal(btn.closest(".modal")))
    );
}

// Profile form submission
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;

  setButtonText(submitBtn, true);

  api
    .editUserInfo({ name: nameInput.value, about: descriptionInput.value })
    .then(() => {
      profileNameEl.textContent = nameInput.value;
      profileDescriptionEl.textContent = descriptionInput.value;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false));
}

// Card form submission
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;

  setButtonText(submitBtn, true);

  api
    .addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((cardData) => {
      const cardEl = getCardElement(cardData);
      if (cardEl) cardsList.prepend(cardEl);

      cardForm.reset();
      disableButton(submitBtn, validationConfig);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false));
}

// Avatar form submission
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;

  setButtonText(submitBtn, true);

  api
    .updateAvatar({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
      disableButton(submitBtn, validationConfig);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false));
}

// Handle delete confirmation
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;

  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      if (selectedCard) selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false, "Delete", "Deleting..."));
}

// Delete Cards
function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;

  openModal(deleteModal);
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

// Initialize event listeners
function initializeEventListeners() {
  editModalBtn.addEventListener("click", () => {
    nameInput.value = profileNameEl.textContent;
    descriptionInput.value = profileDescriptionEl.textContent;
    resetValidation(editForm, validationConfig);
    openModal(editModal);
  });

  cardModalBtn.addEventListener("click", () => {
    cardForm.reset();
    resetValidation(cardForm, validationConfig);
    openModal(cardModal);
  });

  avatarModalBtn.addEventListener("click", () => {
    avatarForm.reset();
    resetValidation(avatarForm, validationConfig);
    disableButton(avatarSubmitBtn, validationConfig);
    openModal(avatarModal);
  });

  editForm.addEventListener("submit", handleEditProfileSubmit);
  cardForm.addEventListener("submit", handleAddCardSubmit);
  avatarForm.addEventListener("submit", handleAvatarSubmit);

  enableOverlayClose();
  setModalCloseListeners();
}

initializeEventListeners();

// Handles the like button
function handleLike(evt, id) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-btn_active");

  api
    .changeLikeStatus(id, isLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-btn_active", !isLiked);
    })
    .catch((err) => console.error(err));
}

// Handles image preview
function handleImageClick(data) {
  previewModalImageEl.src = data.link;
  previewModalImageEl.alt = data.name;
  previewModalCaptionEl.textContent = data.name;
  openModal(previewModal);
}

// Creates a new card element
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  const cancelDeleteBtn = document.querySelector(".modal__button--cancel");

  // Card title and image
  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  // Is like checked
  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_active");
  }

  // El to like button
  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  // El to delete button
  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  // El to cancel button
  cancelDeleteBtn.addEventListener("click", () => closeModal(deleteModal));

  // El to image click
  cardImageEl.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

enableValidation(validationConfig);
