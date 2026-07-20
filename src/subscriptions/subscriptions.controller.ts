import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create_subscription.dto';
import { LogSubscriptionDto } from './dto/log_subscription.dto';
import { UpdateSubscriptDto } from './dto/update_subscript.dto';
import { SubscriptionService } from './subscriptions.service';

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

  @Get('unsubscribe')
  async unsubscribe(@Query('email') email: string) {
    return this.subscriptionService.unsubscribe(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('log')
  async logSubscription(@Body() logSubscriptionDto: LogSubscriptionDto) {
    const { name, email } = logSubscriptionDto;
    await this.subscriptionService.logSubscriptionToFile(name, email);
    return { message: 'Подписка успешно залогирована' };
  }
}
