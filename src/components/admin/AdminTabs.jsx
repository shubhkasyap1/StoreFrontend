const AdminTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="inline-flex rounded-xl bg-[#f0eee8] p-1">
            <button
                onClick={() => setActiveTab("users")}
                className={`rounded-lg px-4 py-2 text-[14px] font-medium transition ${
                    activeTab === "users"
                        ? "bg-white text-[#17304d] shadow-sm"
                        : "text-[#657084]"
                }`}
            >
                Users
            </button>

            <button
                onClick={() => setActiveTab("stores")}
                className={`rounded-lg px-4 py-2 text-[14px] font-medium transition ${
                    activeTab === "stores"
                        ? "bg-white text-[#17304d] shadow-sm"
                        : "text-[#657084]"
                }`}
            >
                Stores
            </button>
        </div>
    );
};

export default AdminTabs;