var smartgrid = require('smart-grid');


var settings = {
  columns: 12, // количество колонок
  offset: '30px',
  filename: '_smartgrid',
  outputStyle: 'sass',
  oldSizeStyle: false,
  container: {
    maxWidth: '1170px',
    fields: '15px'
  },
  breakPoints: {
    md: {
      width: '1200px',
      fields: '15px'
    },
    sm: {
      width: '992px',
      fields: '15px'
    },
    xs: {
      width: '767px',
      fields: '15px'
    },
    xxs: {
      width: '320px',
      fields: '15px'
    },
  },
  properties: []
};

smartgrid('./source/sass/default/', settings);