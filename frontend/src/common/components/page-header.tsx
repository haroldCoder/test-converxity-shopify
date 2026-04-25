type Props = {
  title: string;
  subtitle?: string;
};

export const PageHeader = ({ title, subtitle }: Props) => {
  return (
    <div className="pb-4 mb-6 border-b border-[#e1e3e5]">
      <h1 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
};