$(function ($){
    // live validation
    // document.querySelector(".inputPhone").addEventListener("keypress", function (evt) {
    //     if (evt.which < 48 || evt.which > 57) {
    //         evt.preventDefault();
    //         $(this).closest('.form-group').find('.tooltip-text-helper').show();
    //     } 
    //     else {
    //         $(this).closest('.form-group').find('.tooltip-text-helper').hide();
    //     }
    // });

    // document.querySelector(".inputText").addEventListener("keypress", function (evt) {
    //     if ((evt.which >= 65 && evt.which <= 90) || evt.which != 8 || 16 || evt.which != 32) {
    //         evt.preventDefault();
    //         $(this).closest('.form-group').find('.tooltip-text-helper').show();
    //     } 
    //     else {
    //         $(this).closest('.form-group').find('.tooltip-text-helper').hide();
    //     }
    // });

    $('form').on('blur', 'input[type="text"]', function () {
        validateField(jQuery(this));
    }).on('change', 'select', function () {
        validateField(jQuery(this));
    }).on('change', 'input[type="checkbox"], input[type="radio"]', function () {
        validateField(jQuery(this).closest('.validate'));
    }).on('keyup keydown', 'input[type="text"]', function(evt) {
        validateField(jQuery(this));
    })

    // submission validation
    jQuery('form').on('submit', function (e) {
        var valid = validateGroup(jQuery('#form-content .validate'));
        if (!valid) {
            e.preventDefault();
            jQuery('.help-inline:visible').filter(":first").prev().focus();
        }
    });
});

function validateGroup($el) {
    var validFields = [];
    $el.each(function () {
        validFields.push(validateField($(this)));
    });
    if (_.compact(validFields).length === validFields.length) {
        return true;
    } 
    else {
        return false;
    }
}

function validateField($el) {
    var validates = validate($el);
    if (validates) {
        $el.closest('.form-group').find('.help-inline').hide();
        $el.removeClass('invalid-input');
        $el.addClass('valid-input');
    } 
    else {
        // event.preventDefault();
        if($el.val() != "") {
            $el.closest('.form-group').find('.help-inline').show();
            $el.closest('.form-group').find('.help-inline').prev().focus();
            $el.removeClass('valid-input');
            $el.addClass('invalid-input');
        } else {
            $el.removeClass('valid-input');
            $el.addClass('invalid-input');
        }
    }
    return validates;
}

function validate($el){
    var validates = true;

    $el.each(function(){
        var $this = $(this);

        $($this.attr('class').split(' ')).each(function(i, val){
            switch(val){
            case 'inputAZ':
                if(!/^[a-z ]+$/i.test($.trim($this.val()))){
                    validates = false;
                }
            break;
            case 'input09':
                if(!/^[0-9 \+\"]+$/i.test($this.val())){
                    validates = false;
                }
            break;
            case 'inputPhone':
                if(!/^(?=.*?[1-9])[0-9]+$/i.test($this.val())){
                    validates = false;
                }
            break;
            case 'input09AZ':
                if(!/^[a-z][0-9]+$/i.test($.trim($this.val()))){
                    validates = false;
                }
            break;
            case 'inputAZ09':
                if(!/^[\w \+\'\"]+$/i.test($this.val())){
                    validates = false;
                }
            break;
            case 'inputCard':
                if(!/^[0-9]{4}[\-\ ]?[0-9]{4}[\-\ ]?[0-9]{4}[\-\ ]?[0-9]{4}$/i.test($this.val())){
                    validates = false;
                }
            break;
            case 'inputMinLength3':
                if($this.val().length < 3){
                    validates = false;
                }
            break;
            case 'inputMinLength4':
                if($this.val().length < 4){
                    validates = false;
                }
            break;
            case 'inputMinLength5':
                if($this.val().length < 5){
                    validates = false;
                }
            break;
            case 'inputMinLength6':
                if($this.val().length < 6){
                    validates = false;
                }
            break;
            case 'inputMinLength7':
                if($this.val().length < 7){
                    validates = false;
                }
            break;
            case 'inputMinLength8':
                if($this.val().length < 8){
                    validates = false;
                }
            break;
            case 'inputMinLength30':
                if($this.val().length < 30){
                    validates = false;
                }
            break;
            case 'inputMaxLength500':
                if($this.val().length > 500){
                    validates = false;
                }
            break;            
            case 'inputNumMin8':
                if($this.val().length < 8 || (!/^(?=.*?[1-9])[0-9]+$/i.test($this.val()))){
                    validates = false;
                }
            break;
            case 'inputNum8':
                if($this.val().length != 8 || (!/^(?=.*?[1-9])[0-9]+$/i.test($this.val()))){
                    validates = false;
                }
            break;
            case 'inputNum10':
                if($this.val().length != 10 || (!/^(?=.*?[1-9])[0-9]+$/i.test($this.val()))){
                    validates = false;
                }
            break;
            case 'inputNum12':
                if($this.val().length != 12 || (!/^(?=.*?[1-9])[0-9]+$/i.test($this.val()))){
                    validates = false;
                }
            break;
            case 'inputNum16':
                if($this.val().length != 16 || (!/^(?=.*?[1-9])[0-9]+$/i.test($this.val()))){
                    validates = false;
                }
            break;
            case 'inputTextArea':
                if(!/^[a-zA-Z0-9?@()!,\/\-=_:.&\s]+$/.test($this.val())){
                    validates = false;
                }
            break;            
            case 'inputMMYYYY':
                var value = $this.val();
                if(!/^[0-1][0-9]\/[0-9]{4}$/i.test(value)){
                    validates = false;
                }else{
                    var matches = value.match(/^([0-9]{2})\/([0-9]{4})$/i);
                    var month = parseInt(matches[1]);
                    var year = parseInt(matches[2]);
                    var date = new Date();

                    if(month > 12 || month < 1){
                        validates = false;
                    }else{
                        if(year < date.getFullYear()){
                            validates = false;
                        }else{
                            if(date.getFullYear() == year && month <= date.getMonth() + 1){
                                validates = false;
                            }
                        }
                    }
                }
            break;
            case 'inputEmail':
                if(!/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test($this.val())){
                    validates = false;
                }
            break;
            case 'inputSelect':
                if($this.val() == ''){
                    validates = false;
                }
            break;
            case 'inputCheck':
                    if(!$this.prop('checked')){
                        validates = false;
                    }
                break;
            case 'inputCheckGroup':
                if($this.find(':checked').length === 0){
                    validates = false;
                }
            break;

            case ' ':
                if($this.val() == ''){
                    validates = false;
                }
            break;
            }
        });
    });
    return validates;
}