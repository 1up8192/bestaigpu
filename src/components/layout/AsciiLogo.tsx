import Image from 'next/image'

export function AsciiLogo() {
  return (
    <div aria-label="BEST AI GPU" role="img">
      <Image
        alt=""
        aria-hidden="true"
        className="mb-7 h-auto w-full max-w-[420px]"
        height={512}
        src="/logo512.png"
        width={512}
      />
    </div>
  )
}
