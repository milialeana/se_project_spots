export const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMsg, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add(config.inputErrorClass);
};

const hideInputError = (formEl, inputEl, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.remove(config.inputErrorClass);
};

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const disableButton = (buttonEl, config) => {
  if (!buttonEl.matches(config.submitButtonSelector)) return;
  buttonEl.disabled = true;
  buttonEl.classList.add(config.inactiveButtonClass);
};

const toggleButtonState = (inputList, buttonEl, config) => {
  if (!buttonEl.matches(config.submitButtonSelector)) return;
  hasInvalidInput(inputList)
    ? disableButton(buttonEl, config)
    : enableButton(buttonEl, config);
};

const enableButton = (buttonEl, config) => {
  buttonEl.disabled = false;
  buttonEl.classList.remove(config.inactiveButtonClass);
};

const checkInputValidity = (formEl, inputEl, config) => {
  if (inputEl.type === "url" && !isValidURL(inputEl.value)) {
    showInputError(formEl, inputEl, "Please enter a valid URL.", config);
  } else if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};

const isValidURL = (url) => {
  const pattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/;
  return pattern.test(url);
};

const resetValidation = (formEl, config) => {
  if (!formEl.matches(config.formSelector)) return;
  const inputList = [...formEl.querySelectorAll(config.inputSelector)];

  inputList.forEach((input) => hideInputError(formEl, input, config));

  toggleButtonState(
    inputList,
    formEl.querySelector(config.submitButtonSelector),
    config
  );
};

const setEventListeners = (formEl, config) => {
  const inputList = [...formEl.querySelectorAll(config.inputSelector)];
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) =>
    inputElement.addEventListener("input", () => {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    })
  );
};

export const enableValidation = (config) => {
  document
    .querySelectorAll(config.formSelector)
    .forEach((formEl) => setEventListeners(formEl, config));
};

export { disableButton, resetValidation };
