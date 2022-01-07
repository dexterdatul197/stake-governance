/* eslint-disable max-len */
import React from 'react';

interface Props {
  size?: 'md' | 'lg';
  svgFill?: string;
  pathFill?: string;
}

const ChnLogoSVG: React.FC<Props> = ({ size = 'md', svgFill = 'none', pathFill = 'white' }) => {
  const returnSize = (size: string) => {
    switch (size) {
      case 'lg':
        return {
          height: '24',
          width: '24',
          viewBox: '0 0 24 24'
        };
      case 'md':
        return {
          height: '14',
          width: '14',
          viewBox: '0 0 24 24'
        };
      default:
        break;
    }
  };

  return (
    <>
      <svg
        width="69"
        height="69"
        viewBox="0 0 69 69"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...returnSize(size)}
      >
        <path
          d="M34.4588 68.9176C53.4898 68.9176 68.9176 53.4898 68.9176 34.4588C68.9176 15.4277 53.4898 0 34.4588 0C15.4277 0 0 15.4277 0 34.4588C0 53.4898 15.4277 68.9176 34.4588 68.9176Z"
          fill="black"
        />
        <path
          d="M28.4409 15.3334L14.4265 23.4122V39.5699L19.5376 42.5377L23.6595 40.147L18.5484 37.1792V25.8029L28.4409 20.1147L38.3333 25.8029V37.1792L33.2222 40.147L37.3441 42.5377L42.4552 39.5699V23.4122L28.4409 15.3334Z"
          fill="white"
        />
        <path
          d="M40.5593 53.5843L54.5736 45.5055V29.3477L49.4625 26.38L45.3406 28.7707L50.4517 31.7384V43.1148L40.5593 48.8029L30.6668 43.1148V31.7384L35.7779 28.7707L31.656 26.38L26.5449 29.3477V45.5055L40.5593 53.5843Z"
          fill="white"
        />
      </svg>
    </>
  );
};

export default ChnLogoSVG;
