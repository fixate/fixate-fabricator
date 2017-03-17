var shell = require("shelljs/global"),
    exec = require("child_process").exec;

if (!test('-L', 'src/assets/toolkit/assets')) {
  echo('symlinking styleguide assets to src assets');
  cd('src/assets/toolkit');
  ln('-s', '../../../../src/assets', 'assets');
  echo('assets symlinked');
} else {
  echo('styleguide symlinked to src assets. Check that src/assets/toolkit references the correct directory');
}

if (!test('-f', 'src/views/layouts/includes/inline-icons.svg.html')) {
  echo('creating empty inline icons partial for styleguide');
  touch('src/views/layouts/includes/inline-icons.svg.html');
  echo('inline-icons.svg.html created');
} else {
  echo('inline-icons.svg.html ready');
}
