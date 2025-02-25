// loadtest.js
import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 }, // 정상 부하
        { duration: '5m', target: 200 }, // 스트레스 부하
        { duration: '2m', target: 300 }, // 피크 부하
        { duration: '2m', target: 0 }, // 정리
      ],
    },
  },
};
function generateRandomOrder() {
  const productsCount = Math.floor(Math.random() * 2) + 1; // 1 또는 2개의 상품
  const products = [];

  for (let i = 0; i < productsCount; i++) {
    products.push({
      productId: Math.floor(Math.random() * 10000000) + 1, // 1 ~ 10000000
      quantity: Math.floor(Math.random() * 5) + 1, // 1 ~ 5
    });
  }

  return {
    customerId: Math.floor(Math.random() * 1000000) + 1, // 1 ~ 1000000
    products: products,
  };
}
export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(generateRandomOrder());

  let res = http.post('http://localhost:4000/order', body, params); // Update with your API endpoint

  check(res, {
    'status is 201': (r) => r.status === 201,
  });
  sleep(1);
}
