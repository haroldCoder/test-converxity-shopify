type Props = {
  message: string;
};

export const EmptyState = ({ message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          strokeWidth={1.5}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9.75h16.5m-16.5 4.5h16.5M9 3.75h6M9 20.25h6"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
};