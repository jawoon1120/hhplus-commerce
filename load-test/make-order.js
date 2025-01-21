// loadtest.js
import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  scenarios: {
    constant_load: {
      executor: 'constant-vus',
      vus: 10,
      duration: '10s',
    },
  },
};

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    customerId: 1,
    products: [
      {
        productId: 1,
        quantity: 1,
      },
      {
        productId: 2,
        quantity: 1,
      },
    ],
  });

  let res = http.post('http://localhost:3000/order', body, params); // Update with your API endpoint

  check(res, {
    'status is 201': (r) => r.status === 201,
  });
  sleep(1);
}
