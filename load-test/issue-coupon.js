import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  scenarios: {
    peak_test: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: 500,
      maxVUs: 1000,
      stages: [
        { duration: '1m', target: 10 }, // 워밍업
        { duration: '2m', target: 50 }, // 정상 부하
        { duration: '1m', target: 500 }, // 급격한 피크
        { duration: '2m', target: 50 }, // 정상 부하로 복귀
        { duration: '1m', target: 0 }, // 정리
      ],
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

  let res = http.post('http://localhost:4000/coupons', body, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
  });

  sleep(1);
}
