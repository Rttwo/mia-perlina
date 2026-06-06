// Hero slider
let cur = 0;
const total = 3;

function updateSlider() {
  const slides = document.getElementById('slides');
  if (slides) {
    slides.style.transform = `translateX(-${cur * 33.333}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('on', i === cur));
  }
}

function chSlide(d) {
  cur = (cur + d + total) % total;
  updateSlider();
}

function goSlide(i) {
  cur = i;
  updateSlider();
}

// Auto-advance
setInterval(() => chSlide(1), 5000);

// Category tabs
function setCat(el) {
  document.querySelectorAll('.cat').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
}
