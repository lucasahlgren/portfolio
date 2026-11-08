export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null;
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 whitespace-nowrap">
          <span>{item}</span>
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="group relative flex overflow-hidden border-y [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-5 text-2xl font-medium tracking-tight text-muted-foreground sm:text-3xl">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
