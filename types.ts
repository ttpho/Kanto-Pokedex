export interface Pokemon {
    name: string;
    index: string;
    imageUrl: string;
    types: string[];
}

export enum ImageSize {
    SIZE_1K = '1K',
    SIZE_2K = '2K',
    SIZE_4K = '4K'
}