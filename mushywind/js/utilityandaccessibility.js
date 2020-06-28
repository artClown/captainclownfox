$('.info-button').on('click', function(){
    $(this).next('.tooltip-container').toggle(0);
});

$('.close-button').on('click', function(){
    $(this).closest('.tooltip').closest('.tooltip-container').toggle(0);
});

$('.accordion').on('click', function(e){
    e.preventDefault();
    var accrd = $(this).next('.accordion-content'),
        button = $(this).find('.accordion-button'),
        chevr = $(this).find('.chevron-accordion');
        panelHeight = $(this).next('.accordion-content').attr('data-height');
        accrd.css('height', panelHeight);
    if (accrd.hasClass('inactive')) {
        accrd.toggle(350);
        chevr.css('transform', 'rotate(-90deg)');
        accrd.removeClass('inactive').addClass('active');
        button.attr('aria-expanded', 'true');
    }
    else {
        accrd.toggle(250);
        chevr.css('transform', 'rotate(90deg)');
        accrd.removeClass('active').addClass('inactive');
        button.attr('aria-expanded', 'false');
    }
})
