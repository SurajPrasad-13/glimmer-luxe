import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
  eager?: boolean;
};

export function LazyImage({
  className,
  wrapperClassName,
  eager = false,
  onLoad,
  onError,
  alt = "",
  ...props
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={cn(
        "relative block overflow-hidden isolate",
        wrapperClassName,
      )}
      aria-hidden={false}
    >
      {!loaded && !failed && (
        <span
          className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        {...props}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
        onError={(e) => { setFailed(true); setLoaded(true); onError?.(e); }}
        className={cn(
          "transition-opacity duration-700 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </span>
  );
}
