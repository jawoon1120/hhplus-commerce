import { CustomException } from './base.exception';

export class NotFoundException extends CustomException {
  constructor(message: string) {
    super(message, 404);
  }
}
