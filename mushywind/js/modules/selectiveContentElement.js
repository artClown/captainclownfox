function scElement($els){
    $els.each(function(){
        var $this = $(this),
            $img = $this.attr('data-img-src');
        if ($this.is('img')) {
            $this.attr("src", $img);
        }
        $this.show()
    });
}