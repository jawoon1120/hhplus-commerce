### Use Case

![](./images/use-case-v2.png)

### 도메인
usecase 중에서 묶을 수 있는 명사를 기준으로 도메인 추출 시도

- 잔액 : balance
- 쿠폰 : coupon
- 상품 : product
- 주문 : order
- 결제 : payment

<br/>

### 시퀀스다이어그램
- 선착순 쿠폰 발급  
![](./images/issue-coupon.png)
- 보유 쿠폰 목록 조회
![](./images/query-own-coupon.png)
- 잔액 충전
![](./images/charge-balance.png)
- 잔액 조회
![](./images/query-balance.png)
- 주문 & 결제
![](./images/order-and-payment.png)
- 상품 조회
![](./images/query-product.png)
- 상위 상품 조회
![](./images/query-popular-product.png)

