export type PlaceProviderId = "google" | "yelp" | "mock";

export interface PlaceResult {
  id: string;
  name: string;
  address: string;
  category: string;
  websiteUrl?: string;
  phoneNumber?: string;
  rating?: number;
  provider: PlaceProviderId;
}

export interface SearchPlacesRequest {
  query: string;
  location: string;
  limit?: number;
}

export interface IPlacesProviderAdapter {
  id: PlaceProviderId;
  search(request: SearchPlacesRequest): Promise<PlaceResult[]>;
  getDetails(placeId: string): Promise<PlaceResult | null>;
}
