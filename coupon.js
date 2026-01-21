// Coupon system: Check & apply coupon in booking/cart
async function applyCoupon(code) {
  const res = await fetch('/api/coupons/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const result = await res.json();
  if(result.success) {
    document.getElementById('discountValue').innerText = result.discount + '% Discount Applied!';
  } else {
    alert('Invalid coupon code');
  }
}
