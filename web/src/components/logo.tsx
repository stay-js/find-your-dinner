import Image from 'next/image';

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="select-none">
      <Image
        alt="Logo"
        className="block dark:hidden"
        height={size}
        src="/logo_black.png"
        width={size}
      />

      <Image
        alt="Logo"
        className="hidden dark:block"
        height={size}
        src="/logo_white.png"
        width={size}
      />
    </div>
  );
}
