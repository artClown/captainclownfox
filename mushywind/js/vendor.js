"use strict";

function createCookie(name, value, days) {
    if (days) {
        var date = new Date;
        date.setTime(date.getTime() + 24 * days * 60 * 60 * 1e3);
        var expires = "; expires=" + date.toGMTString()
    } else expires = "";
    document.cookie = name + "=" + value + expires + "; path=/"
}

function readCookie(name) {
    for (var nameEQ = name + "=", ca = document.cookie.split(";"), i = 0; i < ca.length; i++) {
        for (var c = ca[i];
            " " == c.charAt(0);) c = c.substring(1, c.length);
        if (0 == c.indexOf(nameEQ)) return c.substring(nameEQ.length, c.length)
    }
    return null
}

function eraseCookie(name) {
    createCookie(name, "", -1)
}

function openInNewTab(url) {
    window.open(url, "_blank").focus()
}

function showSessionTimeoutModalIn(microSeconds, timeout_extension_frame) {
    clearTimeout(timeoutRef), timeout_extension_allowed_times > 0 && (canExtend = !0), timeoutRef = setTimeout(function () {
        timeout_extension_allowed_times > 0 ? (timeout_extension_allowed_times--, $("#session-modal").modal("show"), timeoutRef = setTimeout(function () {
            $("#session-modal").is(":visible") && (canExtend = !1)
        }, timeout_extension_frame)) : window.location = timeout_exit_to
    }, microSeconds)
}
var isDevelopment = !0;
isDevelopment || (console.log = function (content) {}), $.ajaxSetup({
    headers: {
        "x-csrf-token": CSRF
    }
});
var trackEvent = function (options, e, name) {
        "undefined" != typeof TMS ? void 0 !== e.originalEvent ? TMS.trackEvent(options) : console.log("SKIP tagging, not initiated by a human", name || "") : console.log("SKIP tagging, tagging not loaded", name || "")
    },
    checkLinkedInInterval = null,
    timeoutRef = null,
    canExtend = !0;
$(".extend-session").on("click", function () {
    canExtend ? (canExtend = !1, clearTimeout(timeoutRef), $("#session-modal").modal("hide"), showSessionTimeoutModalIn(timeout_limit, timeout_extension_frame)) : window.location = timeout_exit_to
}), $(".gift__btn-select, .card--btn-select, .js--link-toggle").on("click", function () {
    "undefined" != typeof timeout_limit && "undefined" != typeof timeout_limit && showSessionTimeoutModalIn(timeout_limit, timeout_extension_frame)
}), $("[type=radio]").on("click", function () {
    "undefined" != typeof timeout_limit && "undefined" != typeof timeout_limit && showSessionTimeoutModalIn(timeout_limit, timeout_extension_frame)
});
var showFinalSubmit = function () {
    var myKadTotal = $(".mykad .uploaddoc--button:visible").length,
        epfTotal = $(".epf .uploaddoc--button:visible").length,
        less3monthsTotal = $(".less3months .uploaddoc--button:visible").length,
        payslipTotal = $(".payslip .uploaddoc--button:visible").length;
    0 !== myKadTotal || 0 !== epfTotal && 0 !== payslipTotal ? ($("#finalSubmit #next").addClass("is-disabled"), $("#finalSubmit #next").attr("aria-disabled", "true"), $("#finalSubmit #next").prop("disabled", !0)) : $(".less3months").is(":visible") ? 0 === less3monthsTotal ? ($("#finalSubmit #next").removeClass("is-disabled"), $("#finalSubmit #next").attr("aria-disabled", "false"), $("#finalSubmit #next").prop("disabled", !1)) : ($("#finalSubmit #next").addClass("is-disabled"), $("#finalSubmit #next").attr("aria-disabled", "true"), $("#finalSubmit #next").prop("disabled", !0)) : ($("#finalSubmit #next").removeClass("is-disabled"), $("#finalSubmit #next").attr("aria-disabled", "false"), $("#finalSubmit #next").prop("disabled", !1))
};
$(function () {
    $("#finalSubmit #next").on("click", function (e) {
        e.preventDefault(), sendDocumentsToDash()
    }), $("#finalSubmit button").on("click", function (e) {
        e.preventDefault(), $(this).text("Submitting ....").addClass("disabled").attr("disabled", "disabled")
    })
});
var goTOEndOfApplication = function () {
        window.location = baseUrl + "/end-of-application"
    },
    sendDocumentsToDash = function () {
        var uploads = [];
        $(".uploaddoc--result:visible").each(function (i, item) {
            var img = $(this).find("img");
            uploads.push({
                id: $(img).data("image-id"),
                name: $(img).data("image-name")
            })
        }), $.ajax({
            method: "POST",
            url: baseUrl + "/api/save-uploaded-documents/",
            dataType: "json",
            data: JSON.stringify(uploads),
            contentType: "application/json",
            content: this
        }).success(function (data) {
            goTOEndOfApplication()
        }).error(function (data, z) {
            console.log(data, z), $("#mainActionError").removeClass("hidden").find(".the-message").text("An error has occurred, please try again in a couple of seconds"), $("#finalSubmit #next").text("Submit").removeClass("disabled").attr("disabled", null)
        })
    },
    getUploadOptions = function (select) {
        var $this = $(select),
            progressContainer = $this.closest(".uploaddoc--card"),
            progressBarContainer = progressContainer.find(".uploaddoc--progress-current"),
            progressBarLabel = progressContainer.find(".uploaddoc--progress-label"),
            $parentRef = $this.closest(".uploaddoc--card"),
            imageAltValue = progressContainer.attr("data-image-title");
        return {
            dataType: "json",
            start: function () {
                progressBarLabel.text("0%"), progressBarContainer.css("width", "0%")
            },
            add: function (e, data) {
                var image = $parentRef.attr("data-img-url"),
                    src = "/images" + $parentRef.attr("data-img-url");
                void 0 === image && (src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"), $parentRef.find("img").attr("src", src), $parentRef.find(".uploaddoc--content").addClass("hidden"), $parentRef.find(".uploaddoc--progress").addClass("is--active"), $parentRef.find(".uploaddoc--progress-current").addClass("uploaddoc--progress-full"), data.submit()
            },
            dropZone: $(select),
            progress: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                progressBarContainer.css("width", progress + "%"), progress < 100 ? progressBarLabel.text(progress + "%") : (progressBarLabel.text("Processing file ... "), progressBarContainer.css("width", progress + "%"))
            },
            done: function (e, data) {
                $parentRef.find(".uploaddoc--result").removeClass("hidden"), $parentRef.next(".reuploaddoc").removeClass("hidden"), $parentRef.find(".uploaddoc--progress").removeClass("is--active"), $parentRef.find("img").attr({
                    src: data.result.image,
                    alt: imageAltValue,
                    "data-image-id": data.result.image_id,
                    "data-image-name": imageAltValue
                }), showFinalSubmit()
            },
            fail: function (e, data) {
                $parentRef.next(".reuploaddoc").removeClass("hidden"), progressBarLabel.text(_.get(data, "jqXHR.responseJSON.message") || "An error has happened, please try again.")
            },
            always: function () {
                progressBarContainer.css("width", "0%")
            }
        }
    };
$(".fileinput-button").on("keydown", function (e) {
    var key = e.which || e.keyCode;
    _.indexOf([13, 32], key) > -1 && $(this).find("input").trigger("click")
});
var handleAjaxErrors = function (data) {
        var message = (data.responseJSON || {}).message || "Please check if your Internet is working, then try again.";
        $("#mainActionError").removeClass("hidden").find(".the-message").text(message)
    },
    serializeInput = function () {
        var toSerialize = ".form--control:visible input.validate:visible, ";
        return toSerialize += ".form--control:visible input[type=hidden].validate, ", toSerialize += ".form--control:visible input[type=checkbox].validate, ", toSerialize += ".form--control:visible input[type=radio], ", toSerialize += 'input[type="radio"]:checked, ', toSerialize += 'input[name="url"]', $(toSerialize).serialize()
    },
    validateEntireForm = {};
$(function () {
    function getStateOfPostCode(postCode) {
        var state = "",
            numberStartingWith = "?";
        if ("string" == typeof postCode ? (numberStartingWith = postCode[0], postCode = parseInt(postCode)) : numberStartingWith.toString()[0], postCode > 999 && postCode < 1e5)
            if (postCode < 1e4) postCode >= 1e3 && postCode <= 2800 ? state = "Perlis" : postCode >= 5e3 && postCode <= 9810 && (state = "Kedah");
            else switch (numberStartingWith) {
                case "1":
                    postCode >= 1e4 && postCode <= 14400 ? state = "Penang" : postCode >= 14290 && postCode <= 14390 ? state = "Kedah" : postCode >= 15e3 && postCode <= 18500 && (state = "Kelantan");
                    break;
                case "2":
                    postCode >= 2e4 && postCode <= 24300 ? state = "Terengganu" : postCode >= 25e3 && postCode <= 28800 && (state = "Pahang");
                    break;
                case "3":
                    postCode >= 3e4 && postCode <= 34900 ? state = "Perak" : postCode >= 34950 && postCode <= 34950 ? state = "Kedah" : postCode >= 35e3 && postCode <= 36810 ? state = "Perak" : postCode >= 39e3 && postCode <= 39200 && (state = "Pahang");
                    break;
                case "4":
                    postCode >= 4e4 && postCode <= 48300 ? state = "Selangor" : postCode >= 49e3 && postCode <= 49e3 && (state = "Pahang");
                    break;
                case "5":
                case "6":
                    postCode >= 5e4 && postCode <= 6e4 ? state = "W P Kuala Lumpur" : postCode >= 62e3 && postCode <= 62988 ? state = "W P Putrajaya" : postCode >= 63e3 && postCode <= 68100 ? state = "Selangor" : postCode >= 69e3 && postCode <= 69e3 && (state = "Pahang");
                    break;
                case "7":
                case "8":
                case "9":
                    postCode >= 7e4 && postCode <= 73509 ? state = "N Sembilan" : postCode >= 75e3 && postCode <= 78309 ? state = "Melaka" : postCode >= 79e3 && postCode <= 86900 ? state = "Johor" : postCode >= 87e3 && postCode <= 87033 ? state = "W P Labuan" : postCode >= 88e3 && postCode <= 91309 ? state = "Sabah" : postCode >= 93e3 && postCode <= 98859 && (state = "Sarawak")
            }
        return state
    }

    function validateGroup($el) {
        var validFields = [];
        return $el.each(function () {
            var $this = $(this),
                validationMatch = function ($el) {
                    var validates = function ($el) {
                        var validates = !0,
                            className = "";
                        return $el.each(function () {
                            var $this = $(this);
                            $this.hasClass("validate-optional") && "" === $this.val() ? validates = !0 : $($this.attr("class").split(" ")).each(function (i, val) {
                                if (!1 === validates) return !0;
                                switch (val) {
                                    case "position":
                                        /^[a-z \.\,\-\/\\\@]{3,50}$/i.test($.trim($this.val())) || (validates = !1, className = "position");
                                        break;
                                    case "inputNameAlphabetMalaysian":
                                        /^[a-z \.\,\-\/\\\@\']+$/i.test($.trim($this.val())) || (validates = !1, className = "inputNameAlphabetMalaysian");
                                        break;
                                    case "inputStreet":
                                        /^[a-z0-9 \.\,\-\/\\\@\\(\)']+$/i.test($.trim($this.val())) || (validates = !1, className = "inputStreet");
                                        break;
                                    case "inputCompany":
                                        /^[a-z0-9 \.\,\-\/\\\@\'\)\(]+$/i.test($.trim($this.val())) || (validates = !1, className = "inputCompany");
                                        break;
                                    case "inputNameAlphabet":
                                        /^[a-z\ ]{1,100}$/i.test($.trim($this.val())) || (validates = !1, className = "inputNameAlphabet");
                                        break;
                                    case "inputCity":
                                        /^[a-z\ \.\,\-\/\\\@\']+$/i.test($.trim($this.val())) || (validates = !1, className = "inputCity");
                                        break;
                                    case "identityCard":
                                        /^[0-9]{12}$/i.test($this.val()) ? calculateGenderAndDOBfromIc($this) || (validates = !1, className = "identityCard") : (validates = !1, className = "identityCard");
                                        break;
                                    case "oldIdentityCard":
                                        /^([A-Z])?[0-9]{7}$/i.test($this.val()) || (validates = !1, className = "oldIdentityCard");
                                        break;
                                    case "inputMoney":
                                        /^[0-9]+(\.[0-9]+)?$/i.test($this.val()) || (validates = !1, className = "inputMoney");
                                        break;
                                    case "minSalary3k":
                                    case "minSalary6k":
                                        var salary = parseInt($this.val()),
                                            minSalary = 3e3;
                                        "minSalary6k" === val && (minSalary = 6e3), "number" == typeof salary && salary < minSalary && (validates = !1, className = val);
                                        break;
                                    case "minFinance1k":
                                        var currentFigure = parseInt($this.val());
                                        "number" == typeof currentFigure && currentFigure < 1e3 && (validates = !1, className = val);
                                        break;
                                    case "inputEmail":
                                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($this.val()) || (validates = !1, className = "inputEmail");
                                        break;
                                    case "inputCard":
                                        /^[0-9]{4}[\-\ ]?[0-9]{4}[\-\ ]?[0-9]{4}[\-\ ]?[0-9]{4}$/i.test($this.val()) || (validates = !1, className = "inputCard");
                                        break;
                                    case "phone09":
                                        /^\+?[0-9]{6,12}$/i.test($this.val()) || (validates = !1, className = "phone09");
                                        break;
                                    case "phoneCountry":
                                        /^\+6[0|5][1-9][0-9]{6,11}$/i.test($this.val()) || (validates = !1, className = "phoneCountry");
                                        break;
                                    case "phoneFullFormat":
                                        /^\+[1-9][0-9][1-9][0-9]{6,11}$/i.test($this.val()) || (validates = !1, className = "phoneFullFormat");
                                        break;
                                    case "input09":
                                        /^[0-9]+$/i.test($this.val()) || (validates = !1, className = "input09");
                                        break;
                                    case "anything":
                                        "" === $this.val() && (validates = !1, className = "anything");
                                        break;
                                    case "fileTaxesMustNotBeSame":
                                        $('input[name="tax_1"]').val() === $('input[name="tax_2"]').val() && (validates = !1, className = "fileTaxesMustNotBeSame");
                                        break;
                                    case "postCode09":
                                        /^[0-9]{4,5}$/i.test($this.val()) || (validates = !1, className = "postCode09");
                                        break;
                                    case "postCodeIsValid":
                                        _.isEmpty(getStateOfPostCode($this.val())) && (validates = !1, className = "postCodeIsValid");
                                        break;
                                    case "inputSelect":
                                        "" !== $this.val() && "0" !== $this.val() || (validates = !1, className = "inputSelect");
                                        break;
                                    case "age":
                                        /^[0-9]{1,3}$/i.test($this.val()) || (validates = !1, className = "age");
                                        break;
                                    case "inputAZ":
                                        /^[a-z\ ]+$/i.test($.trim($this.val())) || (validates = !1, className = "inputAZ");
                                        break;
                                    case "inputAZ09":
                                        /^[a-z0-9]+$/i.test($.trim($this.val())) || (validates = !1, className = "inputAZ09");
                                        break;
                                    case "input09":
                                        /^[0-9]+$/i.test($.trim($this.val())) || (validates = !1, className = "input09");
                                        break;
                                    case "inputAZTextarea":
                                        /^[\w\W]+$/i.test($.trim($this.val())) || (validates = !1, className = "inputAZTextarea");
                                        break;
                                    case "inputDOB":
                                        /^[0-9]{2}[\-]?[0-9]{2}[\-]?[0-9]{4}$/i.test($this.val()) || (validates = !1, className = "inputDOB");
                                        break;
                                    case "inputCheck":
                                        $this.prop("checked") || (validates = !1, className = "inputCheck");
                                        break;
                                    case "checkTncLink":
                                        $this.siblings("label").children(".checkbox-link").hasClass("clicked") || (validates = !1, className = "checkTncLink")
                                }
                            })
                        }), [validates, className]
                    }($el);
                    validates[0] ? $el.closest(".form--control").removeClass("with--error").find(".message--error").addClass("hidden") : $el.closest(".form--control").addClass("with--error").find(".message--error").removeClass("hidden");
                    return validates
                }($this);
            ! function (currentClass, $currentInput) {
                var $errorBox = $currentInput.closest(".form--control").find(".message--error span"),
                    currentMessage = "";
                currentMessage = "" === currentClass ? "Please enter a valid value" : $currentInput.data("error-message")[currentClass], $errorBox.text(currentMessage)
            }(validationMatch[1], $this), validFields.push(validationMatch[0])
        }), "undefined" != typeof timeout_limit && "undefined" != typeof timeout_limit && showSessionTimeoutModalIn(timeout_limit, timeout_extension_frame), validFields.filter(function (item) {
            return item
        }).length === validFields.length
    }

    function toggleCheckbox($this, isChecked, e, cb) {
        var $checkbox = $this.closest(".checkbox-label-container").find('input[type="hidden"]');
        isChecked ? $checkbox.val("") : ($checkbox.val("ticked"), trackEvent({
            event_name: "toggle checkbox",
            event_action: "tick",
            event_category: "terms",
            event_content: $(this).text()
        }, e)), validateGroup($checkbox), $this.toggleClass("is--checked"), "function" == typeof cb && cb()
    }
    var closeSelectElemet = function ($parentRef, $select) {
            $parentRef.find(".psuedoselect").addClass("hidden"), $select.removeClass("is--active"), $select.attr("aria-expanded", "false")
        },
        closeAllSelectElemet = function () {
            $(".psuedoselect").addClass("hidden"), $(".js--reveal-dropdown").removeClass("is--active"), $(".js--reveal-dropdown").attr("aria-expanded", "false")
        },
        setAriaSelected = function ($parentRef, currentValue) {
            $parentRef.find('[aria-selected="true"]').attr("aria-selected", "false").removeClass("item--focus"), $parentRef.find('[data-value="' + currentValue + '"]').attr("aria-selected", "true").addClass("item--focus")
        };
    $(".js--reveal-dropdown").on("click", function (e) {
        e.preventDefault();
        var $this = $(this),
            $parentRef = $this.closest(".psuedoselect--wrapper"),
            $dropdown = $parentRef.find(".psuedoselect");
        $this.hasClass("is--active") ? (closeAllSelectElemet(), closeSelectElemet($parentRef, $this)) : (closeAllSelectElemet(), ! function ($revealer) {
            var windowHeight = $(window).height(),
                scrollDistance = $(window).scrollTop(),
                divOffsetTop = $revealer.offset().top,
                elementHeight = $revealer.outerHeight(),
                isDistanceEnough = !0;
            return Math.abs(divOffsetTop - (scrollDistance + windowHeight)) - elementHeight < 100 && (isDistanceEnough = !1), isDistanceEnough
        }($this) ? $dropdown.addClass("psuedoselect--top") : $dropdown.removeClass("psuedoselect--top"), $this.hasClass("disabled") || ($dropdown.removeClass("hidden"), $this.addClass("is--active"), $this.attr("aria-expanded", "true"), $dropdown.find('li[aria-selected="true"]').trigger("focus")))
    });
    var KeyCodes_RETURN = 13,
        KeyCodes_ESC = 27,
        KeyCodes_SPACE = 32,
        KeyCodes_PAGE_UP = 33,
        KeyCodes_PAGE_DOWN = 34,
        KeyCodes_UP = 38,
        KeyCodes_DOWN = 40;
    $(".psuedoselect-options").on("keydown", function (e) {
        var key = e.which || e.keyCode,
            currentlySelectedItem = $(this).find(".item--focus");
        switch (key) {
            case KeyCodes_PAGE_UP:
            case KeyCodes_UP:
                if (0 === currentlySelectedItem.prev().length) return e.preventDefault(), !1;
                currentlySelectedItem.removeClass("item--focus").prev().trigger("focus").addClass("item--focus"), $(this).attr("aria-activedescendant", currentlySelectedItem.text());
                break;
            case KeyCodes_PAGE_DOWN:
            case KeyCodes_DOWN:
                if (0 === currentlySelectedItem.next().length) return e.preventDefault(), !1;
                currentlySelectedItem.removeClass("item--focus").next().trigger("focus").addClass("item--focus"), $(this).attr("aria-activedescendant", currentlySelectedItem.text());
                break;
            case KeyCodes_SPACE:
            case KeyCodes_RETURN:
                e.preventDefault(), currentlySelectedItem.trigger("click");
                break;
            case KeyCodes_ESC:
                closeAllSelectElemet();
                break;
            default:
                return !1
        }
    }), $(".psuedoselect-option").on("click", function (e) {
        e.preventDefault();
        var $this = $(this),
            $parentRef = $this.closest(".psuedoselect--wrapper"),
            $select = $parentRef.find(".input--select"),
            $input = $parentRef.find("input"),
            value = $this.attr("data-value");
        $select.find("span").text($this.text()), $input.val(value).trigger("change"), closeSelectElemet($parentRef, $select), setAriaSelected($parentRef, value), $select.trigger("focus"), trackEvent({
            event_name: "select dropdown",
            event_action: "dropdown",
            event_category: "content",
            event_content: $(this).text()
        }, e)
    }), $(".js--dropdown-toggle li").on("click", function (e) {
        var $this = $(this),
            currentValue = $this.attr("data-dropdown-toggle-value"),
            toggleId = $this.closest(".psuedoselect--content").attr("data-toggle-dropdown-id");
        $('.js-select-toggle-content[data-toggle-id="' + toggleId + '"]').addClass("hidden"), void 0 !== currentValue && $('.js-select-toggle-content[data-toggle-id="' + toggleId + '"][data-toggle-value="' + currentValue + '"]').removeClass("hidden")
    }), $(".js--dropdown-toggle li.option--default-value").each(function () {
        console.log($(this).text()), $(this).trigger("click")
    }), $(".psuedoselect-option.option--default-value").each(function (i, item) {
        var $this = $(item),
            $parentRef = $this.closest(".psuedoselect--wrapper"),
            $select = $parentRef.find(".input--select"),
            $input = $parentRef.find("input"),
            value = $this.attr("data-value");
        $select.find("span").text($this.text()), $input.val(value).trigger("change"), closeSelectElemet($parentRef, $select), setAriaSelected($parentRef, value)
    }), $(".psuedoselect--wrapper").click(function (e) {
        e.stopPropagation()
    }), $(document).click(function () {
        closeAllSelectElemet()
    }), $(".reuploaddoc").on("click", function (e) {
        e.preventDefault();
        var $this = $(this),
            $parentRef = $this.prev(".uploaddoc--card");
        $parentRef.find(".uploaddoc--result"), $parentRef.find(".uploaddoc--result").addClass("hidden"), $parentRef.find(".uploaddoc--result img").attr({
            src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            alt: ""
        }), $parentRef.find(".uploaddoc--result img").removeAttr("data-image-id data-image-name"), $parentRef.find(".uploaddoc--content").removeClass("hidden"), $parentRef.find(".uploaddoc--progress-current").removeClass("uploaddoc--progress-full"), $parentRef.find(".uploaddoc--progress").removeClass("is--active"), $this.addClass("hidden"), trackEvent({
            event_name: "button click",
            event_action: "clear attachment",
            event_category: "content",
            event_content: "upload " + $parentRef.find(".uploaddoc--label").text()
        }, e), showFinalSubmit()
    }), $(".js--radio-toggle").on("change", function (e) {
        var $this = $(this),
            currentId = $this.attr("data-toggle-radio-id"),
            currentValue = String($this.val());
        $("input[name=" + $this.attr("name") + "]").attr("aria-checked", !1), $this.attr("aria-checked", !0), $(".js--radio-toggle-content[data-toggle-id=" + currentId + "]").addClass("hidden"), $(".js--radio-toggle-content[data-toggle-id=" + currentId + "][data-toggle-value=" + currentValue + "]").removeClass("hidden"), trackEvent({
            event_name: "toggle radio",
            event_action: "radio",
            event_category: "content",
            event_content: $(this).closest(".form--control").find(".label-top").text()
        }, e)
    }), $(".js--radio-toggle:checked").trigger("change"), $(".js--link-toggle").on("click", function (e) {
        e.preventDefault();
        var $this = $(this),
            currentId = $this.attr("data-toggle-link-id"),
            toAdd = $(this).find(".values:visible").hasClass("add");
        $(".js--link-toggle-content[data-toggle-id=" + currentId + "]").addClass("hidden");
        var title = "";
        toAdd ? (title = $(this).find(".values:visible").text(), $(this).find(".values:visible").addClass("hidden"), $(this).find(".values.remove").removeClass("hidden"), $(".js--link-toggle-content[data-toggle-id=" + currentId + '][data-toggle-value="add"]').removeClass("hidden"), $(this).find(".lnk__icon--black").removeClass("icon-add").addClass("icon-minimize"), $this.attr("aria-expanded", "true")) : ($(this).find(".values:visible").addClass("hidden"), $(this).find(".values.add").removeClass("hidden"), title = $(this).find(".values:visible").text(), $(".js--link-toggle-content[data-toggle-id=" + currentId + '][data-toggle-value="remove"]').removeClass("hidden"), $(this).find(".lnk__icon--black").removeClass("icon-minimize").addClass("icon-add"), $this.attr("aria-expanded", "false")), trackEvent({
            event_name: "toggle click",
            event_action: "accordion",
            event_category: "content",
            event_content: title
        }, e)
    }), $(".js--link-toggle").each(function (i, item) {
        $(this).hasClass("add") && $(this).trigger("click")
    });
    var hideTheRest = function ($this) {
        $this.removeClass("with--valid"), $this.removeClass("with--warning"), $this.removeClass("with--error"), $this.find(".message--error, .message--valid, .message--warning").addClass("hidden")
    };
    $(".js--reveal").on("click", function (e) {
        e.preventDefault();
        ! function (action) {
            $(".form--control").each(function (index, item) {
                var $this = $(item);
                hideTheRest($this), $this.addClass("with--" + action), $this.find(".message--" + action).removeClass("hidden")
            })
        }($(this).attr("data-action"))
    }), $(".js--hide--all").on("click", function (e) {
        e.preventDefault(), $(".form--control").each(function (index, item) {
            var $this = $(item);
            hideTheRest($this), $this.addClass("with--" + action), $this.find(".message--" + action).removeClass("hidden")
        })
    }), $(".js--show-more-card-select").on("click", function (e) {
        e.preventDefault(), e.stopPropagation();
        var $this = $(this),
            $parentRef = ($this.closest("li"), $this.closest("ul")),
            $textBox = $this.find(".lnk__text"),
            $icon = $this.find(".lnk__icon");
        $parentRef.hasClass("is--open") ? ($parentRef.find(".mobile--show-toggle").addClass("hide--sm"), $parentRef.removeClass("is--open"), $textBox.text($this.attr("data-initial-text")), $icon.removeClass("icon-chevron-up").addClass("icon-chevron-down"), $this.attr("aria-expanded", "false"), $parentRef.find(".mobile--show-toggle").trigger("focus")) : ($parentRef.find(".mobile--show-toggle").removeClass("hide--sm"), $parentRef.addClass("is--open"), $textBox.text($this.attr("data-open-text")), $icon.addClass("icon-chevron-up").removeClass("icon-chevron-down"), $this.attr("aria-expanded", "true"), $parentRef.find(".mobile--show-toggle:first").trigger("focus"))
    });
    var displayPercentageBar = function ($element) {
        $element.css("width", function ($bar) {
            var $this = $bar;
            return Number($this.attr("data-current-page")) / Number($this.attr("data-total-page")) * 100
        }($element) + "%")
    };
    displayPercentageBar($(".progress--bar-current")), displayPercentageBar($(".progress--bar-latest"));
    "yes" === function (sParam) {
        for (var sURLVariables = window.location.search.substring(1).split("&"), i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split("=");
            if (sParameterName[0] == sParam) return sParameterName[1]
        }
    }("fromReview") ? $(".action--return-to-review").removeClass("hidden"): $(".action").removeClass("hidden"), $(".js--insert-dob input[type=text]").on("keyup", function (e) {
        var $parentRef = $(this).closest(".js--insert-dob"),
            currentDate = $parentRef.find(".input-dob-date").val(),
            currentMonth = $parentRef.find(".input-dob-month").val(),
            currentYear = $parentRef.find(".input-dob-year").val();
        $parentRef.find("input[type=hidden]").val(currentDate + "-" + currentMonth + "-" + currentYear).trigger("change")
    });
    var calculateGenderAndDOBfromIc = function (_this) {
        var icMatches = _this.val().match(/^([0-9]{2})([0-9]{2})([0-9]{2})[\-\ ]?[0-9]{2}[\-\ ]?[0-9]{3}([0-9])$/i);
        if (icMatches) {
            var yearOfBirth = icMatches[1],
                monthOfBirth = icMatches[2],
                dayOfBirth = icMatches[3],
                gender = icMatches[4] % 2 == 0 ? "gender_female" : "gender_male",
                dateOfBirth = new Date("19" + yearOfBirth + "-" + monthOfBirth + "-" + dayOfBirth);
            return !isNaN(dateOfBirth.getTime()) && ($('label[for="' + gender + '"]').trigger("click"), "gender_male" === gender ? $('li.psuedoselect-option[data-value="Mr"]').trigger("click") : $('li.psuedoselect-option[data-value="Ms"]').trigger("click"), parseInt(yearOfBirth) < 79 ? $("#oldIcContainer").removeClass("hidden") : $("#oldIcContainer").addClass("hidden"), !0)
        }
        return !1
    };
    validateEntireForm = function () {
        var inputsToValidate = $(".form--control:visible input.validate:visible, .form--control:visible input[type=hidden].validate, .form--control:visible input[type=checkbox].validate"),
            isANonstandardInputError = ($(this), !1),
            valid = validateGroup(inputsToValidate);
        return $(".card-content").hasClass("box--not-check") ? (valid = !1, isANonstandardInputError = !0, $(".card__box-error").removeClass("hidden")) : $(".card__box-error").addClass("hidden"), $(".gift-carousel").hasClass("box--not-check") ? (valid = !1, isANonstandardInputError = !0, $(".gift__carousel-error").removeClass("hidden")) : $(".gift__carousel-error").addClass("hidden"), !!valid || (function (isStandardInputError) {
            var standardInput = ".with--error:visible:first";
            isStandardInputError && (standardInput = ".box--not-check:first"), setTimeout(function () {
                $("html, body").animate({
                    scrollTop: $(standardInput).offset().top - ($(".header--wrapper").height() + 30)
                }, 1e3)
            }, 400)
        }(isANonstandardInputError), !1)
    }, $(".form--control-text input.validate").on("keyup", function (e) {
        validateGroup($(this))
    }), $(".form--control-text input.postCode09").each(function () {
        var $this = $(this);
        $this.on("keyup", function (e) {
            var state = getStateOfPostCode($this.val());
            $this.closest(".form--section").find("input[name$=state]").val(state)
        })
    }), $(".js--input-phone-number").each(function () {
        var $this = $(this);
        $this.on("keyup", function () {
            var fullNumber = $this.closest(".form--section").find('button[aria-owns="phoneCodes"] span').text() + $this.val();
            $this.closest(".form--section").find(".input-full-number").val(fullNumber), validateGroup($(".input-full-number"))
        })
    }), $(".js--dropdown-phone-number li").each(function () {
        var $this = $(this);
        $this.on("click", function () {
            var fullNumber = $this.data("value") + $this.closest(".form--section").find("input.js--input-phone-number").val();
            $this.closest(".form--section").find(".input-full-number").val(fullNumber), validateGroup($(".input-full-number"))
        })
    }), $(".form--control-dropdown input.validate, .form--control-dob input.validate, .form--control-checkbox input.validate").on("change", function (e) {
        validateGroup($(this))
    }), $("#popup-mykad-upload-box").on("click", function (e) {
        trackEvent({
            event_name: "button click",
            event_action: "popup",
            event_category: "content",
            event_content: "open scan mykad popup"
        }, e)
    }), $(".btn-linkedin").on("click", function (e) {
        e.preventDefault(), openInNewTab(baseUrl + "/auth/linkedin");
        var maxLinkedinCalls = 36;
        $("#linkedInButtonWrapper").addClass("hidden"), $("#linkedInButtonLoading").removeClass("hidden"), checkLinkedInInterval = setInterval(function () {
            $("#doneWithLinkedIn").addClass("hidden"), maxLinkedinCalls > 0 ? ($.ajax({
                async: !0,
                url: baseUrl + "/api/get-auth-linkedin-details",
                method: "GET"
            }).success(function (data) {
                clearInterval(checkLinkedInInterval);
                try {
                    var companyName = data.companyName;
                    $("input[name=company_name]").val(companyName).trigger("keyup"), $('input[name="employment"]').closest(".psuedoselect--wrapper").find('.psuedoselect-options li[data-value="Private Sector Employees"]').trigger("click")
                } catch (e) {
                    console.log(e)
                }
                console.log(data);
                try {
                    $('input[name="work_years_of_service"]').closest(".psuedoselect--wrapper").find(".psuedoselect-options li[data-value=" + data.years.toString() + "]").trigger("click"), $('input[name="work_months_of_service"]').closest(".psuedoselect--wrapper").find(".psuedoselect-options li[data-value=" + data.months.toString() + "]").trigger("click")
                } catch (e) {
                    console.log(e)
                }
                $("#linkedInBox").addClass("hidden"), trackEvent({
                    event_name: "button click",
                    event_action: "button click",
                    event_category: "content",
                    event_content: "Allow Access"
                }, e, "linkedin")
            }).fail(function (data) {}), maxLinkedinCalls--) : ($("#linkedInButtonWrapper").removeClass("hidden"), $("#linkedInButtonLoading").addClass("hidden"))
        }, 5e3), trackEvent({
            event_name: "button click",
            event_action: "button click",
            event_category: "content",
            event_content: "LinkedIn Sign in"
        }, e)
    }), $(".checkbox-label_checkbox").on("keypress", function (e) {
        var $this = $(this),
            isChecked = $this.hasClass("is--checked");
        13 !== e.keycode && 176 !== e.keycode || toggleCheckbox($this, isChecked, e)
    }), $(".checkbox-label-container").on("click", function (e) {
        var $this = $(this),
            $checkbox = $this.find(".checkbox-label_checkbox");
        toggleCheckbox($checkbox, $checkbox.hasClass("is--checked"), e, function () {
            $('input[name="checkbox-consent"]').hasClass("is--checked") ? ($(".checkbox__tnc").removeClass("checkbox--hidden"), createCookie("checkbox_consent", !0, 1)) : createCookie("checkbox_consent", !1, 1), $this.find('input[name="checkbox-tnc"]').hasClass("is--checked") && !$this.find(".checkbox-link").hasClass("clicked") && ($this.find('input[name="checkbox-tnc"]').removeClass("is--checked"), $this.find('input[type="hidden"]').val(""))
        })
    }), $(".checkbox-label-container .checkbox-link").on("click", function (e) {
        var $checkboxField = $(this).parents().siblings('input[type="hidden"]');
        return $('input[name="checkbox-tnc"]').removeClass("is--checked"), $(this).addClass("clicked"), $checkboxField.val(""), validateGroup($checkboxField), createCookie("checkbox_visit_link", !0, 1), !0
    }), $(".checkbox-label-container a").on("click", function (e) {
        e.stopPropagation()
    }), $('.checkbox-label-container input.validate[value="ticked"]').each(function (i, item) {
        $(this).trigger("click")
    }), $("#back").on("click", function (e) {
        trackEvent({
            event_name: "button click",
            event_action: "button click",
            event_category: "content",
            event_content: "Back"
        }, e)
    }), $("#next").on("click", function (e) {
        trackEvent({
            event_name: "button click",
            event_action: "button click",
            event_category: "content",
            event_content: "Continue"
        }, e)
    }), $(".psuedoselect--wrapper:visible").each(function (index, val) {
        var $this = $(this),
            currentValue = $this.find('input[type="hidden"]').val();
        "" !== currentValue && $this.find('.psuedoselect-option[data-value="' + currentValue + '"]').attr("aria-selected", "true")
    }), $(".uploaddoc--button").on("click", function (e) {
        console.log({
            event_name: $(this).attr("aria-label"),
            event_action: "button click",
            event_category: "content",
            event_content: "attach/capture"
        }), trackEvent({
            event_name: $(this).attr("aria-label"),
            event_action: "button click",
            event_category: "content",
            event_content: "attach/capture"
        }, e)
    }), $(".card--btn-select").on("click", function (e) {
        var $this = $(this);
        $(".card-box").removeClass("box-active"), $(".card-box .card--btn-select").text("Select Card"), $(".card-box input[type=radio]").prop("checked", !1), $(".card__box-error").addClass("hidden");
        var cardBox = $this.closest(".card-box");
        cardBox.addClass("box-active"), cardBox.find(".card--btn-select").text("Selected"), cardBox.find("input[type=radio]").prop("checked", !0), $this.parents(".section--wrapper").removeClass("box--not-check"), $this.parents(".section--wrapper").addClass("card--checked"), void 0 !== e.originalEvent && ($(".gift-carousel").hasClass("gift--checked") ? $("html,body").animate({
            scrollTop: $this.parents(".section--wrapper").next().offset().top - 70
        }, "slow") : $("html,body").animate({
            scrollTop: $this.parents(".section--wrapper").prev().offset().top - 70
        }, "slow")), trackEvent({
            event_name: "button click",
            event_action: "button click",
            event_category: "content",
            event_content: "select card"
        }, e)
    }), $(".gift__btn-select").on("click", function (e) {
        var $this = $(this);
        $(".gift__carousel-slider").removeClass("gift--active"), $(".gift__carousel-slider .gift__btn-select").text("Select this gift"), $(".gift__carousel-slider input[type=radio]").prop("checked", !1), $(".gift__carousel-error").addClass("hidden");
        var carouselSlider = $this.closest(".gift__carousel-slider");
        carouselSlider.addClass("gift--active"), carouselSlider.find(".gift__btn-select").text("Selected"), carouselSlider.find("input[type=radio]").prop("checked", !0), $this.parents(".section--wrapper").removeClass("box--not-check"), $this.parents(".section--wrapper").addClass("gift--checked");
        var cardBoxActive = $(".card-box.box-active"),
            cardBox = $(".card-box"),
            applicableCard = carouselSlider.data("applicable").split(","),
            $cardBoxTitle = $("#cardsTitleCopy");
        cardBox.each(function () {
            $.inArray($(this).data("box"), applicableCard) < 0 ? $(this).addClass("hidden") : $(this).removeClass("hidden")
        }), applicableCard.length > 1 ? $cardBoxTitle.text("Which card do you want to apply?") : $cardBoxTitle.text("Your card selection"), cardBoxActive.hasClass("hidden") && ($(".card-content").removeClass("card--checked"), $(".card-content").addClass("box--not-check"), $(".card-box").removeClass("box-active"), $(".card-box .card--btn-select").text("Select Card"), $(".card-box input[type=radio]").prop("checked", !1), $(".card__box-error").addClass("hidden")), void 0 !== e.originalEvent && ($(".card-content").hasClass("card--checked") ? $("html,body").animate({
            scrollTop: $(".personal-detail").offset().top - 70
        }, "slow") : $("html,body").animate({
            scrollTop: $this.parents(".section--wrapper").next().offset().top - 70
        }, "slow")), trackEvent({
            event_name: "button click",
            event_action: "button click",
            event_category: "content",
            event_content: "select gift"
        }, e)
    }), 1 === $(".gift__carousel-slider").length && $(".gift__carousel-slider").find(".gift__btn-select").click(), $(".gift__carousel-sliders").slick({
        infinite: !0,
        dots: !0,
        rows: 0,
        prevArrow: $(".btn__arrow-prev"),
        nextArrow: $(".btn__arrow-next")
    });
    var hash = window.location.hash.substr(1).toLowerCase();
    if (window.location.hash) {
        $(".gift__carousel-slider").each(function () {
            var $this = $(this);
            if (hash === $this.data("name")) {
                var indexOfThis = $this.not(".slick-cloned").data("slick-index");
                $(".gift__carousel-sliders").slick("slickGoTo", indexOfThis), $this.not(".slick-cloned").find(".gift__btn-select").click()
            }
        });
        var indexOfSlider = $(".gift__carousel-slider.slick-active").closest("div").data("slick-index");
        $(".gift__carousel-sliders").slick("slickGoTo", indexOfSlider)
    }
    "undefined" != typeof timeout_limit && "undefined" != typeof timeout_limit && showSessionTimeoutModalIn(timeout_limit, timeout_extension_frame), $(".modal__gift-card-col").each(function () {
        4 === $(this).siblings().andSelf().length && $(this).find(".modal__gift-card-title").addClass("mh-card-title")
    }), $(".mh-card-title").matchHeight({
        byRow: !1
    }), $(".modal__gift-card-subtitle").each(function () {
        $(this).find(".subtitle-note").length > 0 && $(this).parents(".modal__gift-card-col").siblings().andSelf().find(".modal__gift-card-subtitle").addClass("mh-card-subtitle")
    }), $(".mh-card-subtitle").matchHeight({
        byRow: !1
    })
});