// loadtest.js
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
// VU별 시작 orderId 설정
const getOrderIdRange = (vuId) => {
  const startOrderId = 322 + (vuId - 1) * 10; // VU 1은 11부터, VU 2는 21부터...
  return startOrderId;
};

let vuOrderIds = new Map();

export default function () {
  if (!vuOrderIds.has(__VU)) {
    vuOrderIds.set(__VU, getOrderIdRange(__VU));
  }

  let currentOrderId = vuOrderIds.get(__VU);
  vuOrderIds.set(__VU, currentOrderId + 1);

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    orderId: currentOrderId,
    customerId: 1,
  });

  let res = http.post('http://localhost:3000/payment', body, params); // Update with your API endpoint

  check(res, {
    'status is 201': (r) => r.status === 201,
  });
  sleep(1);
}
