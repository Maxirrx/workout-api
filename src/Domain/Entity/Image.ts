export class Image {
  id: number;
  url: string;

  constructor(id: number, url: string) {
    this.id = id;
    this.url = url;
  }
}

export function makeImageFaker(image?: Partial<Image>): Image {
  return new Image(image?.id ?? 1, image?.url ?? "https://fixtures.example.test/picture.png");
}
