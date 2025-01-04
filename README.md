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


### API 목록
- 발급 가능 쿠폰 조회 API
- 선착순 쿠폰 발행 API
- 발행된 내 쿠폰 조회 API
- 잔액 충전 API
- 잔액 조회 API
- 주문 API
- 결제 API
- 상위 상품 조회 API
- 상품 조회 API

### ERD
![](./images/dbdiagram-erd.png)


### 마일스톤

![](./images/milestone.png)
