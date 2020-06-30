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
        console.log($el, elem);
        $($el).find(elem).show();

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