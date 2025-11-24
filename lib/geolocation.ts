// Location and currency utilities for geolocation-based pricing
export type Currency = 'PKR' | 'USD';
export type Country = 'Pakistan' | 'USA' | 'Other';

const EXCHANGE_RATE = 277; // 1 USD = 277 PKR (approximate, can be updated)

// Pricing tiers for different services
export const SERVICE_PRICING = {
  individual: { minUSD: 50, maxUSD: 150, minPKR: 3000, maxPKR: 8000 },
  couples: { minUSD: 75, maxUSD: 200, minPKR: 5000, maxPKR: 9000 },
  family: { minUSD: 60, maxUSD: 180, minPKR: 4000, maxPKR: 8500 },
  group: { minUSD: 40, maxUSD: 100, minPKR: 2500, maxPKR: 6000 }
};

interface LocationData {
  country: Country;
  currency: Currency;
  currencySymbol: string;
  exchangeRate: number;
}

// Mapping of country codes to our supported locations
const countryToCurrency: Record<string, LocationData> = {
  'PK': { country: 'Pakistan', currency: 'PKR', currencySymbol: '₨', exchangeRate: 1 },
  'US': { country: 'USA', currency: 'USD', currencySymbol: '$', exchangeRate: EXCHANGE_RATE },
};

/**
 * Get user's location from IP geolocation
 * Uses a free geolocation API
 */
export async function getUserLocation(): Promise<LocationData> {
  try {
    // Try using built-in Geolocation API first
    if (typeof window !== 'undefined' && navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // For demo purposes, return based on latitude/longitude
            const { latitude } = position.coords;
            // Rough approximation: latitude > 24 could be Pakistan region
            if (latitude > 24 && latitude < 37) {
              resolve(countryToCurrency['PK'] || {
                country: 'Pakistan',
                currency: 'PKR',
                currencySymbol: '₨',
                exchangeRate: 1,
              });
            } else {
              resolve(countryToCurrency['US'] || {
                country: 'USA',
                currency: 'USD',
                currencySymbol: '$',
                exchangeRate: EXCHANGE_RATE,
              });
            }
          },
          () => {
            // If permission denied, use IP-based geolocation
            getLocationFromIP().then(resolve);
          }
        );
      });
    } else {
      return getLocationFromIP();
    }
  } catch (error) {
    console.error('Error getting user location:', error);
    // Default to USD
    return countryToCurrency['US'] || {
      country: 'USA',
      currency: 'USD',
      currencySymbol: '$',
      exchangeRate: EXCHANGE_RATE,
    };
  }
}

/**
 * Get location from IP address using free API
 */
async function getLocationFromIP(): Promise<LocationData> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    const data = await response.json();
    const countryCode = data.country_code || 'US';
    
    return (
      countryToCurrency[countryCode] || countryToCurrency['US'] || {
        country: 'USA',
        currency: 'USD',
        currencySymbol: '$',
        exchangeRate: EXCHANGE_RATE,
      }
    );
  } catch (error) {
    console.error('Error getting location from IP:', error);
    // Default to USD
    return countryToCurrency['US'] || {
      country: 'USA',
      currency: 'USD',
      currencySymbol: '$',
      exchangeRate: EXCHANGE_RATE,
    };
  }
}

/**
 * Convert price from base USD to target currency
 */
export function convertPrice(usdPrice: number, currency: Currency): number {
  if (currency === 'PKR') {
    return Math.round(usdPrice * EXCHANGE_RATE);
  }
  return usdPrice;
}

/**
 * Format price with currency symbol and proper formatting
 */
export function formatPrice(
  amount: number,
  currency: Currency,
  currencySymbol: string,
  showCurrency = true
): string {
  if (currency === 'PKR') {
    const formatted = amount.toLocaleString('en-PK');
    return showCurrency ? `${currencySymbol}${formatted}` : formatted;
  } else {
    const formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return showCurrency ? `${currencySymbol}${formatted}` : formatted;
  }
}

/**
 * Get all supported locations
 */
export function getSupportedLocations(): LocationData[] {
  return Object.values(countryToCurrency);
}

/**
 * Cache location data in localStorage to avoid repeated API calls
 */
export function getCachedLocation(): LocationData | null {
  if (typeof window === 'undefined') return null;
  
  const cached = localStorage.getItem('userLocation');
  if (!cached) return null;
  
  try {
    const data = JSON.parse(cached);
    const timestamp = localStorage.getItem('userLocationTime');
    const now = Date.now();
    
    // Cache for 24 hours
    if (timestamp && now - parseInt(timestamp) < 24 * 60 * 60 * 1000) {
      return data;
    }
  } catch (error) {
    console.error('Error reading cached location:', error);
  }
  
  return null;
}

/**
 * Cache location data
 */
export function cacheLocation(location: LocationData): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('userLocation', JSON.stringify(location));
  localStorage.setItem('userLocationTime', Date.now().toString());
}

/**
 * Get location with caching
 */
export async function getLocationWithCache(): Promise<LocationData> {
  const cached = getCachedLocation();
  if (cached) return cached;
  
  const location = await getUserLocation();
  cacheLocation(location);
  return location;
}

/**
 * Get service price based on location and service type
 */
export function getServicePrice(
  serviceType: string,
  location: LocationData
): { price: number; currency: Currency } {
  const pricing = SERVICE_PRICING[serviceType as keyof typeof SERVICE_PRICING];
  
  if (!pricing) {
    // Default to individual pricing
    const defaultPricing = SERVICE_PRICING.individual;
    return {
      price: location.currency === 'PKR' ? defaultPricing.minPKR : defaultPricing.minUSD,
      currency: location.currency
    };
  }

  if (location.currency === 'PKR') {
    // Return middle price for Pakistan
    return {
      price: Math.round((pricing.minPKR + pricing.maxPKR) / 2),
      currency: 'PKR'
    };
  } else {
    // Return middle price for USA
    return {
      price: Math.round((pricing.minUSD + pricing.maxUSD) / 2),
      currency: 'USD'
    };
  }
}

/**
 * Calculate package pricing for bulk sessions
 */
export function calculatePackagePrice(
  sessionPrice: number,
  sessionCount: number,
  discountPercent: number = 0,
  currency: Currency = 'USD'
): { subtotal: number; discount: number; total: number } {
  const subtotal = sessionPrice * sessionCount;
  const discount = (subtotal * discountPercent) / 100;
  const total = subtotal - discount;

  return {
    subtotal: Math.round(subtotal),
    discount: Math.round(discount),
    total: Math.round(total)
  };
}

/**
 * Convert PKR to USD
 */
export function pricePKRToUSD(pricePKR: number): number {
  return Math.round(pricePKR / EXCHANGE_RATE);
}

/**
 * Convert USD to PKR
 */
export function priceUSDToPKR(priceUSD: number): number {
  return Math.round(priceUSD * EXCHANGE_RATE);
}

