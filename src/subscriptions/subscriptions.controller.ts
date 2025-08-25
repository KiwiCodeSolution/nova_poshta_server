import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { SubscriptionService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create_subscription.dto';
import { LogSubscriptionDto } from './dto/log_subscription.dto';
import { UpdateSubscriptDto } from './dto/update_subscript.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  @Put()
  async update(@Body() updateSubscriptionDto: UpdateSubscriptDto) {
    return this.subscriptionService.updateSubscription(updateSubscriptionDto);
  }

  @Post('confirm')
  async confirm(@Body() body: { email: string }) {
    const { email } = body;
    return this.subscriptionService.confirmSubscription(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('log')
  async logSubscription(@Body() logSubscriptionDto: LogSubscriptionDto) {
    const { name, email } = logSubscriptionDto;
    await this.subscriptionService.logSubscriptionToFile(name, email);
    return { message: 'Подписка успешно залогирована' };
  }
}
