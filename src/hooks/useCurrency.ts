// hooks/useSimpleCurrency.ts
import { useEffect, useState } from 'react';

export function useSimpleCurrency() {
  const [currency, setCurrency] = useState<'BDT' | 'GBP'>('BDT');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detectLocation() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const isBangladesh = data.country_code === 'BD';
        setCurrency(isBangladesh ? 'BDT' : 'GBP');
      } catch (error) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isProbablyBD = timezone === 'Asia/Dhaka';
        setCurrency(isProbablyBD ? 'BDT' : 'GBP');
      } finally {
        setLoading(false);
      }
    }
    
    detectLocation();
  }, []);

  return { 
    currency, 
    loading, 
    symbol: currency === 'BDT' ? '৳' : '£' 
  };
}