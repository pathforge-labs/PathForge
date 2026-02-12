import Image from "next/image";

interface TestimonialAvatarProps {
  name: string;
  image?: string;
  gradient: string;
  size?: number;
}

/**
 * Premium testimonial avatar with photo support + gradient-initial fallback.
 * When `image` is set, renders an optimised circular photo with subtle ring.
 * Otherwise, renders a gradient circle with the person's initial.
 */
export function TestimonialAvatar({
  name,
  image,
  gradient,
  size = 40,
}: TestimonialAvatarProps) {
  if (image) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-full ring-2 ring-white/10 ring-offset-1 ring-offset-background"
        style={{ width: size, height: size }}
      >
        <Image
          src={image}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-semibold text-white shadow-sm ${gradient}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </div>
  );
}
