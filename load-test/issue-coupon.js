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
    customerId: 1, // 테스트할 사용자 ID
    couponId: 1, // 테스트할 쿠폰 ID
  });

  let res = http.post('http://localhost:3000/coupons', body, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
  });

  sleep(1);
}
