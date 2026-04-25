type Props = {
  title: string;
  value: string;
};

export const MetricCard = ({ title, value }: Props) => {
  return (
    <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm p-5 flex flex-col gap-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
      <strong className="text-2xl font-bold text-gray-900">{value}</strong>
    </div>
  );
};