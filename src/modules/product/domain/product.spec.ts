import { Product } from '../domain/product.domain';

describe('Product Domain', () => {
  describe('create', () => {
    it('상품을 생성한다', () => {
      // given
      const productData = {
        id: 1,
        name: '테스트 상품',
        price: 10000,
        sellerId: 1,
        totalQuantity: 100,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      // when
      const product = Product.create(productData);

      // then
      expect(product).toBeInstanceOf(Product);
      expect(product.id).toBe(productData.id);
      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(productData.price);
      expect(product.sellerId).toBe(productData.sellerId);
      expect(product.totalQuantity).toBe(productData.totalQuantity);
      expect(product.stock).toBe(productData.stock);
    });
  });

  describe('consumeStock', () => {
    it('재고를 정상적으로 소모한다', () => {
      // given
      const product = new Product({
        id: 1,
        name: '테스트 상품',
        price: 10000,
        sellerId: 1,
        totalQuantity: 100,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      const consumeAmount = 10;

      // when
      product.consumeStock(consumeAmount);

      // then
      expect(product.stock).toBe(40);
    });

    it('재고보다 많은 수량을 소모하려고 할 때 에러를 반환한다', () => {
      // given
      const product = new Product({
        id: 1,
        name: '테스트 상품',
        price: 10000,
        sellerId: 1,
        totalQuantity: 100,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      const consumeAmount = 51;

      // when & then
      expect(() => product.consumeStock(consumeAmount)).toThrow(
        '재고가 부족합니다',
      );
    });
  });
});
