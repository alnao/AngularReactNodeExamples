export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextUrl: string | null;
  previousUrl: string | null;
}

export interface LoadingState {
  loading: boolean;
  loadingDetail: boolean;
  error: string | null;
}

export interface FilterState {
  searchTerm: string;
  selectedType: string | null;
  showFavoritesOnly: boolean;
}

export const createInitialPaginationState = (): PaginationState => ({
  currentPage: 1,
  itemsPerPage: 20,
  totalItems: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  nextUrl: null,
  previousUrl: null
});

export const createInitialLoadingState = (): LoadingState => ({
  loading: false,
  loadingDetail: false,
  error: null
});

export const createInitialFilterState = (): FilterState => ({
  searchTerm: '',
  selectedType: null,
  showFavoritesOnly: false
});
