import { CustomException } from './base.exception';

export class BadRequestException extends CustomException {
  constructor(message: string) {
    super(message, 400);
  }
}
