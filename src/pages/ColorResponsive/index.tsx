import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../helpers/classNames';

const colors: string[] = [
  'bg-gray-600',
  'bg-red-600',
  'bg-orange-600',
  'bg-amber-600',
  'bg-green-600',
  'bg-cyan-600',
  'bg-blue-600',
  'bg-blue-600',
  'bg-fuchsia-600',
  'bg-pink-600',
  'bg-rose-600',
];
const breakpoints: number[] = [
  500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500,
];

export const ColorResponsive = () => {
  const [color, setColor] = useState('');
  const debounce = useRef(0);

  useEffect(() => {
    const alteraCor = () => {
      const width = window.innerWidth;
      const index = breakpoints.findIndex((breakpoint) => width < breakpoint);
      const breakpointIndex = index === -1 ? 0 : index;
      setColor(colors[breakpointIndex]);
    };

    alteraCor();

    window.addEventListener('resize', () => {
      clearTimeout(debounce.current);
      debounce.current = window.setTimeout(alteraCor, 500);
    });

    return () => {
      window.removeEventListener('resize', () => {
        clearTimeout(debounce.current);
        debounce.current = window.setTimeout(alteraCor, 500);
      });
    };
  }, []);

  console.log('==== re-render');
  return (
    <div
      className={classNames(
        color,
        'flex items-center justify-center w-screen h-screen bg-'
      )}
    >
      <p className='text-5xl text-white md:text-7xl lg:text-9xl'>
        {color.replace('bg-', '').replace('-600', '')}
      </p>
    </div>
  );
};
