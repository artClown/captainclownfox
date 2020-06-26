function selectiveContent(){
    var $identifier = getUrlVars()["hidden_fields.source"];
    var $val = scToArray();
    if (typeof $identifier != 'undefined') {
        if (jQuery.inArray($identifier, $val) != -1) {
            var $el = "[data-selective-content=" + $identifier + "]";
            var $these = $($el);
            scElement($these);
        } else {
            var $these = $('[data-selective-content="generic"]');
            scElement($these);
        }
    } else {
        var $these = $('[data-selective-content="generic"]');
        scElement($these);
    }
}