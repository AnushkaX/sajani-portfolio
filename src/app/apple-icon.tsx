import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#3d3354',
          color: '#f7f4fb',
          fontSize: 120,
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.04em',
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
