import { Controller, Get, Param, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CacheTTL } from '@nestjs/cache-manager';

export enum Unit {
  uk = 'uk',
  us = 'us',
  metric = 'metric',
}

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @CacheTTL(30)
  @Get('/:location')
  async getWeather(
    @Param('location') location: string,
    @Query('type') type: string,
    @Query('unitGroup') unit: Unit = Unit.uk,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.weatherService.getWeather(
      location,
      type,
      unit,
      startDate,
      endDate,
    );
  }
}
