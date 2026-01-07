import { Controller } from '@nestjs/common';
import { SeriesMetadataService } from './series-metadata.service';

@Controller()
export class SeriesMetadataController {
  constructor(private readonly seriesMetadataService: SeriesMetadataService) {}
}
