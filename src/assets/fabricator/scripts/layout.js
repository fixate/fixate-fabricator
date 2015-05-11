var wrapElems;

if (wrapElems = document.querySelectorAll('[data-computed-style]')) {
  new ComputedStyle(wrapElems);
}
