import "./index.css";
import {
  enableValidation,
  validationConfig,
  disableButton,
  resetValidation,
} from "../scripts/validate.js";

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

// Profile elements
const editModalBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__new-post-btn");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

// Form elements
const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__button");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

// Card-related elements
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

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
  profileNameEl.textContent = nameInput.value;
  profileDescriptionEl.textContent = descriptionInput.value;
  closeModal(editModal);
}

// Card form submission
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const newCard = { name: cardNameInput.value, link: cardLinkInput.value };
  cardsList.prepend(getCardElement(newCard));
  cardForm.reset();
  disableButton(cardSubmitBtn, validationConfig);
  closeModal(cardModal);
}

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

  editForm.addEventListener("submit", handleEditProfileSubmit);
  cardForm.addEventListener("submit", handleAddCardSubmit);

  enableOverlayClose();
  setModalCloseListeners();
}

initializeEventListeners();

// Creates a new card element
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", () =>
    cardLikeBtn.classList.toggle("card__like-btn_active")
  );
  cardDeleteBtn.addEventListener("click", () => cardElement.remove());

  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// Render initial cards
initialCards.forEach((card) => cardsList.append(getCardElement(card)));

// Enable validation
enableValidation(validationConfig);
