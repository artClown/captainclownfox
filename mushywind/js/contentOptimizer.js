/* selective content library by art. requires jquery. */

// ? Selective Content Helper Function
// array builder for selective content
function scToArray(){
    var $val = [];
    $('.selectiveContent').each(function(){
        var $this = $(this),
            $attr = $this.attr('data-selective-content');        
        $val.push($attr);
    });
    return $val;
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

// switch on off
function scElement($els){
    $els.each(function(){
        var $this = $(this),
            $img = $this.attr('data-img-src');
            $imgSrcSet = $this.attr('data-img-srcset')
        if ($this.is('img')) {
            // console.log(abTest);
            // console.log(!$this.hasClass('scAbTestOff'));
            if (!$this.hasClass('scAbTestOff')) {
                console.log('not');
                if (!$imgSrcSet) {
                    $this.attr("src", $img);
                } else {
                    $this.attr("src", $img);
                    $this.attr("srcset", $imgSrcSet);
                }
            }
        }
        $this.show()
    });
}

// ? AB Test Helper Function
// randomizer for ab test
function generateRandomInt(min, max){
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// array builder
function abTestSet(){
    var abArr = [];
    $('[data-ab-test-set]').each(function(){
        var attr = $(this).attr('data-ab-test-set');
        if (!isInArray(attr, abArr)) {
            abArr.push(attr);
        }
    });
    return abArr;
}


// ? SELECTIVE CONTENT
(function (){
    var abTest = getUrlVars()["abtest"];
    var $identifier = getUrlVars()["hidden_fields.campaign"];
    var $val = scToArray();
    if (typeof $identifier != 'undefined') {
        if (jQuery.inArray($identifier, $val) != -1) {
            var $el = "[data-selective-content=" + $identifier + "]";
            var $these = $($el);
            scElement($these);
            var $this = $($el).find('[data-ab-test]');
            abTester($this.length);
        } else {
            var $these = $('[data-selective-content="generic"]');
            scElement($these);
            var $this = $($el).find('[data-ab-test]');
            abTester($this.length);
        }
    } else {
        var $these = $('[data-selective-content="generic"]');
        scElement($these);
        var $this = $($el).find('[data-ab-test]');
        abTester($this.length);
    }
})();



// ? AB Test
function abTester(status) {
    if (status != 0) {
        var abTestParameter = getUrlVars()["abtest"];
        if (abTestParameter == "active") {        
            abProc();
        }
    }
}

function abProc() {
    var arr = abTestSet();
    for (i = 0; i < arr.length; i++) {
        var setName = arr[i];
        var $el = "[data-ab-test-set=" + setName + "]";
        var $elLength = $($el).length;
        var len = ($($el).find('[data-ab-test]').length) / $elLength;
        var elemId = generateRandomInt(1, len);
        var elem = "[data-ab-test=" + elemId + "]";
        $($el).find(elem).show();

        // if contains image, transfer the image source!
        if ($($el).find(elem).find('img').length) {
            var $this = $($el).find(elem).find('img');
            var srcImage = $this.attr('data-src');
            $this.attr('src', srcImage);

            // if found and another selectiveContent image is present next to the element, then turn it off - the selectiveContent should be placed right after the abtest-wrapper div
            console.log($('.scAbTestOff'));
            $('.scAbTestOff').attr('src', '');
            $('.scAbTestOff').css('display', 'none');
            $('.scAbTestOff').hide();
        }

        // additional auto-fill input field
        var inpId = "#hidden-" + (i + 1);
        var val = $el + "" + elem;
        $(inpId).show().val(val);
        // $(inpID).val();
    }
}