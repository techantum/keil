/** Simple line-art chicken mark for the Why KEIL promise card */
export function ChickenLineIcon({
  className = "h-20 w-20",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M72 34c8.5 0 15.5 5.5 17.5 13.5 1.2 4.5-.2 9.2-3.5 12.2l5.2 3.8c2.8 2 3.5 5.8 1.6 8.7-2.2 3.4-6.8 4.4-10.2 2.2l-4.2-2.7c-4.2 6.8-11.5 11.2-19.9 11.2H48c-12.7 0-23-10.3-23-23 0-11.5 8.5-21 19.6-22.6C49.2 29.4 57.5 26 66 26c2.1 0 4.1.3 6 1z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="78" cy="42" r="3.2" fill="currentColor" />
      <path
        d="M52 68c5.5 2.5 12 2.5 17.5 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M44 78h28M48 86h20"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M54 94v12M66 94v12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M88 52c4 1 7.5-1 9-4.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
