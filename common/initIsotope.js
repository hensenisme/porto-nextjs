import Isotope from 'isotope-layout';

const initIsotope = () => {
  let iso;
  let grid = document.querySelectorAll('.gallery');
  let grid2 = document.querySelectorAll('.gallery2');
  let filtersElem = document.querySelector('.filtering');
  let buttonGroups = document.querySelectorAll('.filtering');

  // Initialize Standard Gallery
  if (grid.length >= 1) {
    grid.forEach((item) => {
      iso = new Isotope(item, {
        itemSelector: '.items',
      });
    });
  }

  // Initialize Masonry Gallery (Gallery2)
  let gallery2Iso;
  if (grid2.length >= 1) {
    grid2.forEach((item) => {
      gallery2Iso = new Isotope(item, {
        itemSelector: '.items',
        masonry: {
          columnWidth: '.width2',
        },
      });
    });
  }

  // Handle Filtering
  if (filtersElem) {
    filtersElem.addEventListener('click', function (event) {
      if (!event.target.matches('span')) {
        return;
      }
      var filterValue = event.target.getAttribute('data-filter');

      // Apply filter to both if they exist
      if (iso) iso.arrange({ filter: filterValue });
      if (gallery2Iso) gallery2Iso.arrange({ filter: filterValue });
    });

    const radioButtonGroup = (buttonGroup) => {
      buttonGroup.addEventListener('click', (event) => {
        if (!event.target.matches('span')) {
          return;
        }
        buttonGroup.querySelector('.active').classList.remove('active');
        event.target.classList.add('active');
      });
    };
    for (var i = 0, len = buttonGroups.length; i < len; i++) {
      var buttonGroup = buttonGroups[i];
      radioButtonGroup(buttonGroup);
    }
  }
};

export default initIsotope;
