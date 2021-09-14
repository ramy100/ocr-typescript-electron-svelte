export type image = { path: string; pageNum: number };
export class ImageManager {
  readonly initialImagesCount: number = 0;

  constructor(private images: image[]) {}

  shift() {
    return this.images.shift();
  }
}
