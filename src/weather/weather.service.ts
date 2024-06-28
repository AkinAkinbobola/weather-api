import { configDotenv } from 'dotenv';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Unit } from './weather.controller';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

configDotenv();

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  private baseUrl =
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

  private endpoint = '';

  async getWeather(
    location: string,
    type: string,
    unit: Unit,
    startDate?: string,
    endDate?: string,
  ) {
    try {
      const cachedData = await this.cacheService.get(location);
      if (cachedData) {
        return cachedData;
      }
      if (startDate && endDate) {
        this.endpoint = `${this.baseUrl}/${location}/${startDate}/${endDate}?unitGroup=${unit}&include=${type}&key=${process.env.API_KEY}&contentType=json`;
      } else {
        this.endpoint = `${this.baseUrl}/${location}?unitGroup=${unit}&include=${type}&key=${process.env.API_KEY}&contentType=json`;
      }
      const response = await this.httpService.axiosRef.get(this.endpoint);
      const data = await response.data;
      await this.cacheService.set(location, data);
      return data;
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
