export default function Dashboard() {

  
  const stats = [
    {
      title: "TOTAL ORDERS",
      value: "0",
      color: "bg-blue-500",
      icon: "📄",
    },
    {
      title: "TOTAL USERS",
      value: "137",
      color: "bg-teal-500",
      icon: "👥",
    },
    {
      title: "TOTAL EARNINGS",
      value: "₹0",
      color: "bg-cyan-500",
      icon: "💰",
    },
    {
      title: "TOTAL PRODUCTS",
      value: "20",
      color: "bg-purple-500",
      icon: "📦",
    },
  ];

  return (

    <div className="flex flex-col bg-gray-100 min-h-screen p-4 md:p-8">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">
        Welcome! Admin
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`${item.color} text-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex justify-between items-center`}
          >
            <div>
              <div className="text-3xl font-bold ">{item.value}</div>
              <div className="text-sm uppercase tracking-widest">
                {item.title}
              </div>
            </div>
            <div className="text-4xl opacity-30">{item.icon}</div>
          </div>
        ))}
      </div>
    </div>

  );
}
