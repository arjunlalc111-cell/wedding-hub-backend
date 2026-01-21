// admin banner management - upload/display/banner CRUD (simplified)
async function addBanner(imageUrl, link, title) {
  await fetch('/api/banners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
    body: JSON.stringify({ image: imageUrl, link, title })
  });
  alert('Banner added!');
}

async function getBanners() {
  const res = await fetch('/api/banners');
  const banners = await res.json();
  const slider = document.getElementById('slider');
  slider.innerHTML = '';
  banners.forEach(b => {
    const img = document.createElement('img');
    img.src = b.image;
    img.alt = b.title || 'Banner';
    slider.appendChild(img);
  });
}
// To call: getBanners() on page load