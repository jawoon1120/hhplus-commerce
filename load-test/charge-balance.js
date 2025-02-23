// loadtest.js
import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  scenarios: {
    constant_load: {
      executor: 'constant-vus',
      vus: 20,
      duration: '10s',
    },
  },
};

// VU별 시작 customerId 설정
const getCustomerIdRange = (vuId) => {
  const startCustomerId = 1 + (vuId - 1) * 10; // VU 1은 10000011부터, VU 2는 10000021부터...
  return startCustomerId;
};

let vuCustomerIds = new Map();

export default function () {
  if (!vuCustomerIds.has(__VU)) {
    vuCustomerIds.set(__VU, getCustomerIdRange(__VU));
  }

  let currentCustomerId = vuCustomerIds.get(__VU);
  vuCustomerIds.set(__VU, currentCustomerId + 1);

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    customerId: currentCustomerId,
    amount: 100,
  });
  console.log(currentCustomerId);
  let res = http.post(
    `http://localhost:3000/users/${currentCustomerId}/balances`,
    body,
    params,
  );
  check(res, {
    'status is 201': (r) => r.status === 201,
  });
  sleep(1);
}
