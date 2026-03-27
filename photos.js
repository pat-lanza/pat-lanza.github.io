// ─── Lightbox ─────────────────────────────────────────────────────────────────
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxCap  = document.getElementById('lightbox-caption');
const closeBtn     = document.getElementById('lightbox-close');
const prevBtn      = document.getElementById('lightbox-prev');
const nextBtn      = document.getElementById('lightbox-next');

let allPhotos = [];   // { src, caption }
let currentIdx = 0;

function buildPhotoList() {
  document.querySelectorAll('.photo-item').forEach(item => {
    const img     = item.querySelector('img');
    const caption = item.querySelector('.photo-caption');
    allPhotos.push({
      src:     img.src,
      caption: caption ? caption.textContent : ''
    });
  });
}

function openLightbox(idx) {
  currentIdx = idx;
  showPhoto();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showPhoto() {
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src     = allPhotos[currentIdx].src;
    lightboxImg.alt     = allPhotos[currentIdx].caption;
    lightboxCap.textContent = allPhotos[currentIdx].caption;
    lightboxImg.style.opacity = '1';
  }, 150);
}

function prevPhoto() {
  currentIdx = (currentIdx - 1 + allPhotos.length) % allPhotos.length;
  showPhoto();
}

function nextPhoto() {
  currentIdx = (currentIdx + 1) % allPhotos.length;
  showPhoto();
}

// Attach click to each photo item
buildPhotoList();

document.querySelectorAll('.photo-item').forEach((item, idx) => {
  item.addEventListener('click', () => openLightbox(idx));
});

closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', prevPhoto);
nextBtn.addEventListener('click', nextPhoto);

// Click outside image to close
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard nav
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  prevPhoto();
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'Escape')     closeLightbox();
});
