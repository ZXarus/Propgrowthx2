type Stats = {
  total: number;
  available: number;
  sold: number;
  rented: number;
};

const DashboardHome: React.FC<{ stats: Stats }> = ({ stats }) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Properties" value={stats.total} />
        <StatCard title="Available" value={stats.available} />
        <StatCard title="Sold" value={stats.sold} />
        <StatCard title="Rented" value={stats.rented} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: any) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default DashboardHome;