/*$(document).ready(function () {*/

//handles scrolling to element being modified


/*$("input").on('input propertychange paste', function() {
    $(this).focus();f
});
*/
/*$('input').change(function() { 
$(this).focus();
});

$('input').click(function() {
  $(this).focus();
});*/

$(function() {

    $('input, textarea').each(function() {
        var os = $(this).offset().top;
        $(this).bind('focus', function() {
            $('#topcolumn').animate({scrollTop: os}, 300);
        });
    });

});

//add generatl entercommand








/*}
*/