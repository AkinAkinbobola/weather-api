import { configDotenv } from 'dotenv';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Unit } from './weather.controller';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

configDotenv();

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

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
      if (startDate && endDate) {
        this.endpoint = `${this.baseUrl}/${location}/${startDate}/${endDate}?unitGroup=${unit}&include=${type}&key=${process.env.API_KEY}&contentType=json`;
      } else {
        this.endpoint = `${this.baseUrl}/${location}?unitGroup=${unit}&include=${type}&key=${process.env.API_KEY}&contentType=json`;
      }
      const data = this.httpService
        .get(this.endpoint)
        .pipe(map((response) => response.data));
      if (!data) throw new BadRequestException();
      return data;
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
