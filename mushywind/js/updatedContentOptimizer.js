// ! DECLARATION - modify as needed

/*
    * Selective content works by using class "sc.ClassName" and then adding data-attribute "sc.attrName" in the same element (div, p, hx, etc.).
    * Specific for image element, we need to also add the selective content class with data-attribute "sc.imgAttrName". For a src set image, add "sc.imgSrcSetAttrName" to allow lazy/selective loading.
    * Selective content will be initiated based on URL parameter, i.e., www.x.com/abc?urlParam.sc=xyz
    * Any sc.attrName value that match xyz will be turned on.
*/
var sc = {                                              // ? selective content variables
    className: '.selectiveContent',                     // ? class name
    attrName: 'data-selective-content',                 // ? data-attribute name
    attrNameGeneric: 'generic',                         // ? generic content identifier
    imgAttrName: 'data-img-src',                        // ? data-attribute name for image
    imgSrcSetAttrName: 'data-img-srcset'                // ? data-attribute name for srcset image
    
};

var ab = {                                              // ? ab test variables
    className: '.abtest',                               // ? class name
    attrName: 'data-ab-test',                           // ? data-attribute name
    imgAttrName: 'data-src',                            // ? data-attribute name for image
    setName: 'data-ab-test-set'                   // ? set name
    
};


/*
    * Selective content will be initiated based on URL parameter, i.e., www.x.com/abc?urlParam.sc=xyz
    * Any sc.attrName value that match xyz will be turned on.
*/
var urlParam = {                                        // ? url parameters
    sc: 'hidden_fields.campaign',                       // ? selective content
    ab: 'abtest',                                       // ? ab test
    abVal: 'active'                                     // ? value for ab test to be run
};

var scAndAbTestOff = '.scAbTestOff';                    // ? turn off immediate SC when AB is active

// ! Generated Var Declaration
sc.genericSelector = "[" + sc.attrName + "=" + sc.attrNameGeneric + "]";
ab.attrSelector = "[" + ab.attrName + "]";
ab.setSelector = "[" + ab.setName + "]";

// ! FUNCTIONS
function getUrlParam() {                                // ? get URL parameter
    var vars = [], 
        hash,    
        hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function generateRandomInt(min, max){                   // ? random number generator
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSelector(name){                             // ? get selector name for buildArray
    return (name == "unique" ? ab.setSelector : sc.className);
}

function getAttribute(name){                            // ? get attribute name for buildArray
    return (name == "unique" ? ab.setName : sc.attrName);
}

function buildArray(name) {                             // ? array builder for elements collection
    var arr = [],
        selector = getSelector(name),
        attribute = getAttribute(name);
    $(selector).each(function(){
        var attr = $(this).attr(attribute);
        arr.push(attr);
    });
    return arr;
}

function getUniqueArray(array) {                        // ? generate unique array based on array input
    return array.filter(function(elem, pos, arr){
        return arr.indexOf(elem) == pos;
    });
}

function turnOffScAb(){
    $(scAndAbTestOff).attr('src', '');
    $(scAndAbTestOff).css('display', 'none');
    $(scAndAbTestOff).hide();
}

function processAbTest(){
    var arr = getUniqueArray(buildArray("unique"));
    var arrLen = arr.length;
    for(var i = 0; i < arrLen; i++){
        var setName = arr[i],
            el = "[" + ab.setName + "=" + setName + "]",
            elLength = $(el).length,
            len = ($(el).find(ab.attrSelector).length) / elLength,
            elemId = generateRandomInt(1, len),
            elem = "[" + ab.attrName + "=" + elemId + "]";
        $(el).find(elem).show();
        if ($(el).find(elem).find('img').length){
            var $this = $(el).find(elem).find('img'),
                srcImage = $this.attr(ab.imgAttrName);
            $this.attr('src', srcImage);
            turnOffScAb();                          // ? if selectiveContent image is present next to the element, then turn it off - the selectiveContent should be placed right after the abtest-wrapper div
        }
    }
}

function processSelectiveContent(elems){
    elems.each(function(){
        var el = $(this),
            img = el.attr(sc.imgAttrName),
            srcSetImg = el.attr(sc.imgSrcSetAttrName);
        if (el.is('img') && !($(ab.className).is(':visible'))) {
            if (!srcSetImg) {
                el.attr("src", img);
            } else {
                el.attr("src", img);
                el.attr("srcset", srcSetImg);
            }
        }
        el.show();
    });
}

function abTestCheck(len) {
    if (len != 0) {
        var abTestParameter = getUrlParam()[urlParam.ab];
        if (abTestParameter == urlParam.abVal) {        
            processAbTest();
        }
    }
}

function selectiveContentRunner(content, abTestLen){
    processSelectiveContent(content);
    abTestCheck(abTestLen);
}

function selectiveContentSwitcher(swtch, identifier){
    var el, these, abTest, fn;
    var scSwitch = {
        'other': function(){
            el = "[" + sc.attrName + "=" + identifier + "]";
            these = $(el);
            abTest = $(el).find(ab.attrSelector);
            selectiveContentRunner(these, abTest.length);
        },
        'default': function(){
            these = $(sc.genericSelector);
            abTest = $(sc.genericSelector).find(ab.attrSelector);
            selectiveContentRunner(these, abTest.length);
        }
    };
    if(scSwitch[swtch]){
        fn = scSwitch[swtch];
    }
    else {
        fn = scSwitch['default'];
    }
    fn();
}

function selectiveContent(identifier){
    var arr = buildArray("normal");
    if (typeof identifier != 'undefined' && $.inArray(identifier, arr) != -1) {
        selectiveContentSwitcher("other", identifier);
    }
    else {
        selectiveContentSwitcher("generic", identifier);
    }
}

(function (){
    var identifier = getUrlParam()[urlParam.sc];
    selectiveContent(identifier);
})();