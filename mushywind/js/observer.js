const imageWatcher = new IntersectionObserver((entries) => {
    const qF = document.querySelector('#quickFill');
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            const rowImage = entry.target;
            console.log("lazy loading", rowImage);
            rowImage.src = rowImage.dataset.src;
            qF.style.display = 'none';
        }
        else {
            qF.style.display = 'block';
        }
    });
});

const imgArr = (document.querySelector('#form'));
imageWatcher.observe(imgArr);
