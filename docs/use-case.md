```plantuml
@startuml use-case
left to right direction

actor Customer as "고객"

package "Commerce"{
  usecase balanceCharge as "잔액충전"
  usecase qeuryCharge as "잔액조회"
  usecase issueFirstServedCoupon as "선착순쿠폰발급"
  usecase queryOwnCoupon as "보유쿠폰조회"
  usecase queryProduct as "상품조회"
  usecase orderProduct as "상품주문"
  usecase payProduct as "상품결제"
  usecase queryTopRankedProduct as "상위상품조회"
  
  payProduct ..> orderProduct : include
  orderProduct ..> queryProduct : include
  queryTopRankedProduct ..> queryProduct : extend
}

Customer --> balanceCharge
Customer --> qeuryCharge
Customer --> queryProduct
Customer --> orderProduct
Customer --> issueFirstServedCoupon
Customer --> queryOwnCoupon
Customer --> payProduct
Customer --> queryTopRankedProduct
@enduml
```
