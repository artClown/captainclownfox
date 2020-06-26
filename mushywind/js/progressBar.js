/* progress bar tracker */
function progressBar() {
    var $currentPage = parseInt($('[data-current-page]').attr('data-current-page'));
    var $totalPage = parseInt($('[data-current-page]').attr('data-total-page'));
    var $currWidth = (($currentPage / $totalPage) * 100).toFixed(2) + '%';
    var $remWidth = (100 - (($currentPage / $totalPage) * 100)).toFixed(2) + '%';
    $('.progress--bar-current').width($currWidth);
    $('.progress--bar-remaining').width($remWidth);
}


/* $(window).resize(function(){
    var a = $('#banner-a').width() / $('#banner-a').height();
    console.log(a);
}) */
