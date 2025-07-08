// Smart Image Compressor JS (Full Code with Quality Logic)
document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('image-upload');
    const previewContainer = document.querySelector('.preview-container');
    const previewImage = document.getElementById('preview-image');
    const originalSizeElement = document.getElementById('original-size');
    const resolutionElement = document.createElement('p');
    resolutionElement.className = 'file-info';
    previewContainer.appendChild(resolutionElement);

    const targetSizeInput = document.getElementById('target-size');
    const compressBtn = document.getElementById('compress-btn');
    const resultSection = document.querySelector('.result-section');
    const originalSizeResult = document.getElementById('original-size-result');
    const compressedSizeResult = document.getElementById('compressed-size-result');
    const downloadBtn = document.getElementById('download-btn');

    let originalFile = null;
    let compressedBlob = null;
    let outputFormat = null;

    imageUpload.addEventListener('change', handleImageUpload);
    targetSizeInput.addEventListener('input', () => {
        compressBtn.disabled = !(originalFile && targetSizeInput.value);
    });
    compressBtn.addEventListener('click', compressImage);
    downloadBtn.addEventListener('click', downloadCompressedImage);

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid JPG, JPEG, or PNG image.');
            return;
        }

        originalFile = file;
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewContainer.classList.remove('hidden');

            const sizeInKB = (file.size / 1024).toFixed(2);
            originalSizeElement.textContent = `${sizeInKB} KB`;

            const img = new Image();
            img.onload = function () {
                resolutionElement.textContent = `Resolution: ${img.width} × ${img.height} px`;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    async function compressImage() {
        if (!originalFile || !targetSizeInput.value) return;

        const targetSizeKB = parseFloat(targetSizeInput.value);
        if (isNaN(targetSizeKB) || targetSizeKB <= 0) {
            alert('Please enter a valid target size in KB.');
            return;
        }

        compressBtn.disabled = true;
        compressBtn.textContent = 'Compressing...';

        try {
            const img = await loadImage(originalFile);
            let width = img.width;
            let height = img.height;
            outputFormat = originalFile.type === 'image/png' ? 'image/jpeg' : originalFile.type;

            let quality = getInitialQuality(targetSizeKB);
            let resultBlob = null;
            let iterations = 0;
            const maxIterations = 25;

            while (iterations < maxIterations) {
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(width);
                canvas.height = Math.round(height);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                resultBlob = await blobFromCanvas(canvas, outputFormat, quality);
                const sizeKB = resultBlob.size / 1024;

                if (sizeKB <= targetSizeKB || quality <= 0.15) break;

                // If still too large, reduce quality or resolution
                if (sizeKB > targetSizeKB) {
                    if (quality > 0.2) {
                        quality -= 0.05;
                    } else {
                        width *= 0.95;
                        height *= 0.95;
                    }
                }

                iterations++;
            }

            finishCompression(resultBlob);
        } catch (err) {
            console.error(err);
            alert('Compression failed.');
        }

        compressBtn.textContent = 'Compress Now';
        compressBtn.disabled = false;
    }

    function getInitialQuality(sizeKB) {
        if (sizeKB >= 50) return 0.9;
        if (sizeKB >= 30) return 0.75;
        if (sizeKB >= 15) return 0.5;
        return 0.3;
    }

    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    function blobFromCanvas(canvas, type, quality) {
        return new Promise(resolve => {
            canvas.toBlob(blob => {
                resolve(blob);
            }, type, quality);
        });
    }

    function finishCompression(blob) {
        compressedBlob = blob;
        const originalSizeKB = (originalFile.size / 1024).toFixed(2);
        const compressedSizeKB = (blob.size / 1024).toFixed(2);

        originalSizeResult.textContent = `${originalSizeKB} KB`;
        compressedSizeResult.textContent = `${compressedSizeKB} KB`;

        resultSection.classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    function downloadCompressedImage() {
        if (!compressedBlob) return;
        const url = URL.createObjectURL(compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        const originalName = originalFile.name.replace(/\.[^/.]+$/, '');
        const extension = outputFormat.split('/')[1];
        a.download = `${originalName}_compressed.${extension}`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
});
// Update copyright year automatically
document.getElementById('current-year').textContent = new Date().getFullYear();
// पेज लोड होने पर SEO टैग्स अपडेट करें
document.addEventListener('DOMContentLoaded', function() {
    // टाइटल अपडेट करें
    document.title = "Smart Image Compressor - Free Online Tool | Reduce Image Size";
    
    // मेटा डिस्क्रिप्शन जोड़ें/अपडेट करें
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.name = "description";
    metaDesc.content = "Compress JPG, PNG images online without quality loss. Free tool to reduce photo size for websites and social media.";
    document.head.appendChild(metaDesc);
    
    // कैनोनिकल लिंक जोड़ें
    const canonicalLink = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonicalLink.rel = "canonical";
    canonicalLink.href = window.location.href.split('?')[0]; // URL पैरामीटर्स हटाकर
    document.head.appendChild(canonicalLink);
});

// लेजी लोडिंग इमेजेस के लिए
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => observer.observe(img));
}

window.addEventListener('load', lazyLoadImages);
// Google Analytics इवेंट ट्रैकिंग
function trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// उदाहरण: जब कोई इमेज कंप्रेस करे
document.getElementById('compress-btn').addEventListener('click', function() {
    trackEvent('compress', 'image_processing', 'jpg_compression');
}); // सोशल शेयरिंग मेटा टैग्स अपडेट करें
function updateSocialMeta(title, description, imageUrl) {
    // Facebook/Open Graph
    document.querySelector('meta[property="og:title"]').content = title;
    document.querySelector('meta[property="og:description"]').content = description;
    document.querySelector('meta[property="og:image"]').content = imageUrl;
    
    // Twitter
    document.querySelector('meta[name="twitter:title"]').content = title;
    document.querySelector('meta[name="twitter:description"]').content = description;
    document.querySelector('meta[name="twitter:image"]').content = imageUrl;
}