import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useChartTheme = () => {
  const { theme } = useTheme();
  const [chartTheme, setChartTheme] = useState({
    textColor: '#000',
    lineColor: '#ccc',
    primaryColor: 'blue',
    gradientStart: 'rgba(0,0,255,0.5)',
    gradientEnd: 'rgba(0,0,255,0)',
    pieColors: ['#3b82f6', '#14b8a6', '#f97316', '#ec4899', '#8b5cf6'],
  });

  useEffect(() => {
    // A small delay to ensure CSS variables are applied to the DOM
    const timer = setTimeout(() => {
      const rootStyle = getComputedStyle(document.documentElement);
      const primaryHsl = rootStyle.getPropertyValue('--primary').trim();
      const foregroundHsl = rootStyle.getPropertyValue('--foreground').trim();
      const borderHsl = rootStyle.getPropertyValue('--border').trim();

      // Convert space-separated HSL values to comma-separated for canvas compatibility
      const primaryHslComma = primaryHsl.replace(/ /g, ',');
      const foregroundHslComma = foregroundHsl.replace(/ /g, ',');
      const borderHslComma = borderHsl.replace(/ /g, ',');

      const pieColors = [
        `hsl(${primaryHslComma})`,
        '#14b8a6', // teal-500
        '#f97316', // orange-500
        '#ec4899', // pink-500
        '#8b5cf6', // violet-500
      ];

      setChartTheme({
        textColor: `hsl(${foregroundHslComma})`,
        lineColor: `hsl(${borderHslComma})`,
        primaryColor: `hsl(${primaryHslComma})`,
        gradientStart: `hsla(${primaryHslComma}, 0.5)`,
        gradientEnd: `hsla(${primaryHslComma}, 0)`,
        pieColors: pieColors,
      });
    }, 10);

    return () => clearTimeout(timer);
  }, [theme]);

  return chartTheme;
};
