const imageWatcher = new IntersectionObserver((entries, imgWatcher) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            const rowImage = entry.target;
            rowImage.src = rowImage.dataset.src;
            imgWatcher.unobserve(rowImage);
        }
    });
});


const qfObs = new IntersectionObserver((entries) => {
    const qF = document.querySelector('#quickFill');
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            const rowImage = entry.target;
            rowImage.src = rowImage.dataset.src;
            qF.style.display = 'none';
        }
        else {
            qF.style.display = 'block';
        }
    });
});


const frm = (document.querySelector('#form'));
const imgArr = (document.querySelectorAll('img.row-load'));


qfObs.observe(frm);
imgArr.forEach((v) => {
    imageWatcher.observe(v);
});