import { SlidesModel } from '@data/slides';

export class SlideService {
  public static async getSlides(size?: number) {
    const limit = size ? (size < 10 ? size : 10) : 1;
    const slides = await SlidesModel.find().limit(limit);
    return slides;
  }
}
