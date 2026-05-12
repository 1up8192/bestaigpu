const logo = [
  '██████╗ ███████╗███████╗████████╗',
  '██╔══██╗██╔════╝██╔════╝╚══██╔══╝',
  '██████╔╝█████╗  ███████╗   ██║',
  '██╔══██╗██╔══╝  ╚════██║   ██║',
  '██████╔╝███████╗███████║   ██║',
  '╚═════╝ ╚══════╝╚══════╝   ╚═╝',
  '',
  ' █████╗ ██╗     ██████╗ ██████╗ ██╗   ██╗',
  '██╔══██╗██║    ██╔════╝ ██╔══██╗██║   ██║',
  '███████║██║    ██║  ███╗██████╔╝██║   ██║',
  '██╔══██║██║    ██║   ██║██╔═══╝ ██║   ██║',
  '██║  ██║██║    ╚██████╔╝██║     ╚██████╔╝',
  '╚═╝  ╚═╝╚═╝     ╚═════╝ ╚═╝      ╚═════╝',
].join('\n')

const logoClassName =
  'mb-7 overflow-hidden bg-gradient-to-b from-[var(--color-logo-hi)] via-[var(--color-logo-mid)] to-[var(--color-logo-fade)] bg-clip-text font-normal text-transparent leading-[1.02] drop-shadow-[0_0_18px_rgba(255,106,0,0.14)] [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation_Mono","Courier_New",monospace] [font-synthesis:none] [font-variant-ligatures:none]'

export function AsciiLogo() {
  return (
    <div aria-label="BEST AI GPU" role="img">
      <pre
        aria-hidden="true"
        className={`${logoClassName} [font-size:min(14px,calc((100vw-1.5rem)/46))] sm:[font-size:min(14px,calc((100vw-3rem)/46))]`}
      >
        {logo}
      </pre>
    </div>
  )
}
