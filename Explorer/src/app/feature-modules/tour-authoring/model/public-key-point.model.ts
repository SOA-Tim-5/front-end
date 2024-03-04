export interface PublicKeyPoint {
    id?: number;
    name: string;
    description: string;
    longitude: number;
    latitude: number;
    imagePath: string;
    order: number;
    locationAddress?: string;
}
