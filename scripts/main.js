import { images } from "./images.js";
import { getNextIndex, getPreviousIndex } from "./gallery.js";

const featuredButton = document.querySelector("#featured-button");
const featuredImage = document.querySelector("#featured-image");
const featuredCaption = document.querySelector("#featured-caption");
const thumbnailsContainer = document.querySelector("#thumbnails");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxCloseBtn = document.querySelector("#lightbox-close");

let selectedIndex = 0;
let lastFocusedElement = null;

function renderThumbnails() {
  images.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "thumbnail";
    button.setAttribute("role", "option");
    button.dataset.index = String(index);

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";

    button.appendChild(img);
    thumbnailsContainer.appendChild(button);
  });
}

function updateSelectedThumbnail() {
  const buttons = thumbnailsContainer.querySelectorAll(".thumbnail");
  buttons.forEach((button, index) => {
    const isSelected = index === selectedIndex;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-selected", String(isSelected));
  });
}

function selectImage(index, { fade = true } = {}) {
  selectedIndex = index;
  const image = images[selectedIndex];

  featuredImage.src = image.src;
  featuredImage.alt = image.alt;
  featuredCaption.textContent = image.caption;

  if (fade) {
    featuredImage.classList.remove("fade-in");
    // Restart the animation even if it's already mid-fade from a fast click.
    void featuredImage.offsetWidth;
    featuredImage.classList.add("fade-in");
  }

  updateSelectedThumbnail();

  if (!lightbox.hidden) {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.caption;
  }
}

function openLightbox() {
  lastFocusedElement = document.activeElement;
  const image = images[selectedIndex];

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.caption;

  lightbox.hidden = false;
  lightboxCloseBtn.focus();
  document.addEventListener("keydown", handleLightboxKeydown);
}

function closeLightbox() {
  lightbox.hidden = true;
  document.removeEventListener("keydown", handleLightboxKeydown);
  lastFocusedElement?.focus();
}

function handleLightboxKeydown(event) {
  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowRight") {
    selectImage(getNextIndex(selectedIndex, images.length), { fade: false });
  } else if (event.key === "ArrowLeft") {
    selectImage(getPreviousIndex(selectedIndex, images.length), { fade: false });
  }
}

function handleThumbnailClick(event) {
  const button = event.target.closest(".thumbnail");
  if (!button) return;
  selectImage(Number(button.dataset.index));
}

function handleThumbnailKeydown(event) {
  const button = event.target.closest(".thumbnail");
  if (!button) return;

  const isNext = event.key === "ArrowRight" || event.key === "ArrowDown";
  const isPrevious = event.key === "ArrowLeft" || event.key === "ArrowUp";
  if (!isNext && !isPrevious) return;

  event.preventDefault();
  const nextIndex = isNext
    ? getNextIndex(selectedIndex, images.length)
    : getPreviousIndex(selectedIndex, images.length);

  selectImage(nextIndex);
  thumbnailsContainer.children[nextIndex].focus();
}

renderThumbnails();
selectImage(0, { fade: false });

thumbnailsContainer.addEventListener("click", handleThumbnailClick);
thumbnailsContainer.addEventListener("keydown", handleThumbnailKeydown);
featuredButton.addEventListener("click", openLightbox);
lightboxCloseBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
