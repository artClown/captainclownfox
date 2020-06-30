"use strict";
var imageWatcher = new IntersectionObserver(function (entries, imgWatcher) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            var rowImage = entry.target,
                srcImage = rowImage.getAttribute('data-src');
            rowImage.src = srcImage;
            imgWatcher.unobserve(rowImage);
        }
    });
});

var qfObs = new IntersectionObserver(function (entries) {
    var qF = document.querySelector('#quick-fill');
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            // var rowImage = entry.target,
            //     srcImage = rowImage.getAttribute('data-src');
            // rowImage.src = srcImage;
            qF.style.display = 'none';
        } else {
            qF.style.display = 'block';
        }
    });
});

var qfPosMod = new IntersectionObserver(function(entries) {
    var qF = document.querySelector('#quick-fill');
    var footerHeight = document.getElementById('footer-wrapper').offsetHeight;
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            
                qF.style.bottom = footerHeight - 1 + 'px';
            
        } else {
            qF.style.bottom = 0;
        }
    });
}, options);

var frm = (document.querySelector('#form-wrapper'));
var imgArr = (document.querySelectorAll('img.row-load'));
var ftr = (document.querySelector('#footer-wrapper'));

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

var options = {
    root: null,
    rootMargin: '0px',
    threshold: [0.0, 0.75]
};

qfObs.observe(frm);
qfPosMod.observe(ftr, options);
imgArr.forEach(function (v) {
    imageWatcher.observe(v);
});