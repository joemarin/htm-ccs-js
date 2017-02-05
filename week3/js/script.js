  // debugger;
$('.navbar .navbar-collapse')
  .on('hide.bs.collapse', function () {
    console.log('menu closed');
    $('.navbar .navbar-toggle').removeClass('active');
  })
  .on('show.bs.collapse', function () {
    console.log('menu open');
    $('.navbar .navbar-toggle').addClass('active');
  });
