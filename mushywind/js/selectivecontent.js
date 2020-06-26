/* selective content library by art. requires jquery. */
function scToArray(){
    var $val = [];
    $('.selectiveContent').each(function(){
        var $this = $(this),
            $attr = $this.attr('data-selective-content');        
        $val.push($attr);
    });
    return $val;
}

function scElement($els){
    $els.each(function(){
        var $this = $(this),
            $img = $this.attr('data-img-src');
            $imgSrcSet = $this.attr('data-img-srcset')
        if ($this.is('img')) {
            if (!$imgSrcSet) {
                $this.attr("src", $img);
            } else {
                $this.attr("src", $img);
                $this.attr("srcset", $imgSrcSet);
            }
        }
        $this.show()
    });
}

function selectiveContent(){
    var $identifier = getUrlVars()["hidden_fields.campaign"];
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