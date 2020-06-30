function generateRandomInt(min, max){
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

(function () {
    var abTestParameter = getUrlVars()["abtest"];
    if (abTestParameter == "active") {        
        // check if parent visible
        abProc();
    }
})();

function abProc() {
    var arr = abTestSet();
    for (i = 0; i < arr.length; i++) {
        var setName = arr[i];
        var $el = "[data-ab-test-set=" + setName + "]";
        var $elLength = $($el).length;
        var len = ($($el).find('[data-ab-test]').length) / $elLength;
        var elemId = generateRandomInt(1, len);
        var elem = "[data-ab-test=" + elemId + "]";
        // console.log($el, elem);
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