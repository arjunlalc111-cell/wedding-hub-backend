// Report vendor/vendor-abuse system
async function reportVendor(vendorId, reason) {
  await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', Authorization:'Bearer '+localStorage.getItem('token') },
    body: JSON.stringify({ vendorId, reason })
  });
  alert('Reported! Thank you for your feedback.');
}