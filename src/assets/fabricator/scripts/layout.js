var wrapElems;

if (wrapElems = document.querySelectorAll('[data-computed-width]')) {
  new ComputedStyle(wrapElems);
}
