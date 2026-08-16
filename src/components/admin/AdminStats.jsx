const AdminStats = ({ stats }) => {
    const cards = [
        {
            label: "TOTAL USERS",
            value: stats?.users?.total ?? 0,
        },
        {
            label: "TOTAL STORES",
            value: stats?.stores?.total ?? 0,
        },
        {
            label: "TOTAL RATINGS",
            value: stats?.ratings?.total ?? 0,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-2xl border border-[#e2dfd7] bg-white px-6 py-6"
                >
                    <p className="text-[13px] font-medium tracking-wide text-[#64748b]">
                        {card.label}
                    </p>

                    <p className="mt-2 text-[36px] font-semibold leading-none text-[#17263a]">
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default AdminStats;