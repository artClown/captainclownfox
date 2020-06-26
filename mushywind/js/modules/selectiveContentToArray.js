function scToArray(){
    var $val = [];
    $('.selectiveContent').each(function(){
        var $this = $(this),
            $attr = $this.attr('data-selective-content');        
        $val.push($attr);
    });
    return $val;
}