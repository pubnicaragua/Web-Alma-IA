type SearchParams = {
  [key: string]: string | string[] | undefined;
} | URLSearchParams;

export function getSearchParam(
  searchParams: SearchParams | null | undefined,
  key: string
): string | null {
  if (!searchParams) return null;
  
  // Si es un URLSearchParams
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get(key);
  }
  
  // Si es un objeto con un método get
  if (typeof (searchParams as any).get === 'function') {
    return (searchParams as any).get(key);
  }
  
  // Si es un objeto plano
  const value = (searchParams as any)[key];
  if (Array.isArray(value)) {
    return value[0] || null;
  }
  
  return value || null;
}

export function hasSearchParam(
  searchParams: SearchParams | null | undefined,
  key: string
): boolean {
  if (!searchParams) return false;
  
  // Si es un URLSearchParams
  if (searchParams instanceof URLSearchParams) {
    return searchParams.has(key);
  }
  
  // Si es un objeto con un método has
  if (typeof (searchParams as any).has === 'function') {
    return (searchParams as any).has(key);
  }
  
  // Si es un objeto plano
  return key in searchParams;
}
