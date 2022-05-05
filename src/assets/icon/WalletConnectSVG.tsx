import React from 'react';

interface Props {
  size?: 'xl' | 'lg' | 'md' | 'sm';
}
const WalletConnectSVG: React.FC<Props> = ({ size = 'md' }: Props) => {
  const returnSize = (size: string) => {
    switch (size) {
      case 'xl':
        return {
          height: '36',
          width: '36'
        };
      case 'lg':
        return {
          height: '20',
          width: '20'
        };
      case 'md':
        return {
          height: '16',
          width: '16'
        };
      case 'sm':
        return {
          height: '12',
          width: '12'
        };

      default:
        break;
    }
  };
  return (
    <svg
      {...returnSize(size)}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <circle cx="20" cy="20" r="20" fill="url(#pattern0)" />
      <defs>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_161_299" transform="scale(0.025)" />
        </pattern>
        <image
          id="image0_161_299"
          width="40"
          height="40"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAV1SURBVHgBzVlbbBVVFF177i2BQhV6KQX6SCqPPihSoMEIRMVATCpEE4l+aEAxKPKIRvkifBjjl8gHan1EiEQ+NARDjOEhGI1QjJryKoW2WGykvLxtASltoe2d7TozbaGl7Z25pY/V3Jk5Z/acs87eZ++zz6kgRlTW6OxWC3lqI8eykAUbDymQ1va62hKUqqJaLZwO2jgxOUmOIgaIH+GdOzWQtwir7QieFsVMFSRJ9DbIG2Fej9mCokgIH+aKNMMjPBEsLtb4hAysp5bW8osk9A1hW/E5buOj7FSpiyYclWDFVS1ABBsoORc+Nd4j1LkeRgAbMhOlCLESJLm11NrH6EeIYMXUkHzV4/vuKlVVztbSDIIXWRyJfgSV2cDL15ljsUZEFF4IltfqZ3yxCgMIavILavKePq2uFWdr9WWOaBkGGAxJL1XU6pqu9Z00WBHW+aR8CPfLGfxDGVcLssbJ/vaKDg2W/KNjWHoXg0fOQBj011dV6fD2ig6CcfFYx9sCDDLoJQuaR+Lt9rJDsFg1jpN0FbqZk4MAi3+rzarlFoiEOrxDu07A0EHK9Cew2jw4BEluHoYYAkE8Ze5SxqyELPeQZTJ84iaX/OOXgLKw4vdqG9ea3PoxI4BH0y1kMpWYNREYNQyx4KIEsFjKw7qCetwqPr33/HXF3rOKX6sUDT3kJobYYxmCgkxB+oO+g0Ok1cbKoFiYCp/kzoSB93+xHQ0aPEAiGYmC0SPchowmq64pbtwG9lYoDnEQGxdYyBnnq5tA0MKUIP063W/ka4kAt1rd57zxgkWTBdnJ4pgWbQRLrygOnlOc4r2JstSGbzDkTJGKGi0lwWnwiT+qmS7/p1ia23tk2lVqI2204JHUGOK/oESYGNwUDxmLIXSBhJ7rgVCEwz12URFg9JpBrQak74QZm68HKdYaTbCSee/mItsxa02D7ZBMumtIxoQ7jtv4qdLNlhbS5MvyLAyPuyNT02DIKfbRsUYNU7y3MIDJIUSFxcX5fDQhQyzYprgDJLHtaKRjTjW1AD+y0wN/qSNnfuZ5P+VutbgyRnbbURsHK+1ObUYDh3temOLs5vOz0YRPM9ZtP6bgnHXKD9OMS7ItfF9mo+xfdUwciqepyeH6LTgmzqbXPkOZH8ptlFxxv8tibFw+k5M+2cOcFHwT5GcVXqZvDhteNUfwwaEILtcDp0jqcn3EMZ1BCuPcC7niEP2OprxwQ1FKmSs3I6hrdGUmJACvs42MMd4chk1dkPI6XcFE+0t4TBSMo+w6rfj5nLYN0tXKm/MsTExwZS5xAFuO2Cintttz+CcnCZZOE6R6DNiUsrlNfc3MwZMw+1aPMB0sn2k55jPIpalfzb9DzsA8m7rp410Zo/3lsyzP5Aw4sDC5nXC+4Ej30KUL4ANmFTHzak6KIBjoXqaVAf1Phh4zX32vx4o9XMsXu9mMYB98wnQ4N71ncgbmnZGJJVng5v6Iw81cdqoGZtSBeQnGYWggXB9Car5Ii6PB50UipFoIQDH4sHnwVGjImUKH58YnYhNJ/oZBBrefh2834pP2cgfBNJGmSCs2Y5ARF8DG3DS52l7uFPtykmU3XfstjqIRAwzOrUZacOWkLodJ9wRnbpq3sHYHBhiWOZ8JydZ76rsT/jaROyrmBM7BTj/D9MEwt33KWHcX1xW9hnYug69wGdyG/jttMFFjXeZYKexJoNf1N8uc2zXjcR71FuF+hiB1vPVIxMKS3sgZeNJM2Q0NWS08GlG8gb4Hc3Ne/Wl9Mzblp0hUZ/RlOh7bD4ur41m1Yj6Ls30eoh+n1vaVJKHQWRg8Iua5xQQjn53O4ASfxl8aO8/t9G8I4G+GrHIO4gx7OcmUrBgx4H9xdAeRaTfIVwAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
};
export default WalletConnectSVG;
