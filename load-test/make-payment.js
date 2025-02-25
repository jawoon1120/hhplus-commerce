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

// VU별 시작 orderId 설정
const getOrderIdRange = (vuId) => {
  const startOrderId = 10002000 + (vuId - 1) * 100; // VU 1은 11부터, VU 2는 21부터...
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

  let res = http.post('http://localhost:4000/payment', body, params); // Update with your API endpoint

  check(res, {
    'status is 201': (r) => r.status === 201,
  });
  sleep(1);
}
