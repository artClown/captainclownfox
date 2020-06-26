function bannerLoaderImg() {
    // ? ?WABFormEntryCommand=cmd_init&WT.ac=mkg_homepage_advance_banner&contentwabform=home&headbanner=0&hidden_fields.source=Ownchannel&hidden_fields.campaign=mkg_homepage_advance_banner#ffref1
    $('.selectiveContent').each(function(){
        var $identifier = getUrlVars()["hidden_fields.source"],
            $this = $(this),
            $img = $this.attr('data-banner-img'),
            $txt = $this.attr('data-banner-txt');
        if (typeof $identifier != 'undefined') {
            if ($img == $identifier) {
                $this.show();
                $genericIdent = 1;
                console.log('show image');
            }
            if ($genericIdent = 0 && $img == "generic") {
                $this.show();
            }
        }
        else {
            if ($img == "generic") {
                $this.show();
            }
        }
    });
}


// <img src="./images/banner-a.jpg" alt="banner-a" data-banner-img="generic"></img>
// <p data-banner-txt="generic">Generic heading for the banner</p>