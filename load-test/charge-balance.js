// loadtest.js
import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  scenarios: {
    // burst_test: {
    //   executor: 'shared-iterations',
    //   vus: 100,
    //   iterations: 100,
    //   maxDuration: '1s',
    // },
    constant_load: {
      executor: 'constant-vus',
      vus: 20,
      duration: '10s',
    },
  },
};

export default function () {
  let res = http.post('http://localhost:3000/users/1/balances', {
    customerId: 1,
    amount: 100,
  }); // Update with your API endpoint
  check(res, {
    'status is 201': (r) => r.status === 201,
  });
  sleep(1);
}
