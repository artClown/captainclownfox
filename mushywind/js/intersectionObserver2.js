"use strict";
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
}

var options = {
    root: null,
    rootMargin: '0px',
    threshold: [0.25, 0.5, 0.75, 1]
};

var observe = function observe(entries, observer) {
    entries.forEach(function (entry) {
        var qF = document.querySelector('#quick-fill');
        if (hasClass(entry.target, 'row-load')) {
            var rowImage = entry.target,
                srcImage = rowImage.getAttribute('data-src');
            if (entry.isIntersecting) {
                rowImage.src = srcImage;
                observer.unobserve(rowImage);
            }
        }

        if (entry.target.id === 'form') {
            if (entry.isIntersecting) {
                qF.style.display = 'none';
            } else {
                qF.style.display = 'block';
            }
        }

        if (entry.target.id === 'footer-wrapper') {
            if (entry.isIntersecting) {
                qF.style.display = 'none';
            }
            else {
                qF.style.display = 'block';
            }
        }
    });
};

var observer = new IntersectionObserver(observe);
var frm = (document.querySelector('#form'));
var imgArr = (document.querySelectorAll('img.row-load'));
var ftr = (document.querySelector('#footer-wrapper'));
imgArr.forEach(function (v) {
    observer.observe(v);
})
observer.observe(frm);
observer.observe(ftr);