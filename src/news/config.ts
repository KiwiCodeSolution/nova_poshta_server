import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get baseUrl(): string {
    return process.env.BASE_URL || 'http://localhost:5000';
  }
  get frontendBaseUrl(): string {
    return process.env.FRONTEND_BASE_URL || 'http://localhost:3000'; // Фронтенд
  }
}
