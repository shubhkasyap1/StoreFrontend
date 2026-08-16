import { ArrowUp, ArrowUpDown, Star } from "lucide-react";

const StoreTable = ({ stores = [] }) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-[#dfdcd4] bg-white">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[#dfdcd4]">
                            <th className="px-3 py-3 text-left text-[15px] font-medium text-[#53627a]">
                                <div className="flex items-center gap-1">
                                    Store
                                    <ArrowUp size={15} />
                                </div>
                            </th>

                            <th className="px-3 py-3 text-left text-[15px] font-medium text-[#53627a]">
                                Email
                            </th>

                            <th className="px-3 py-3 text-left text-[15px] font-medium text-[#53627a]">
                                <div className="flex items-center gap-1">
                                    Address
                                    <ArrowUpDown size={15} />
                                </div>
                            </th>

                            <th className="px-3 py-3 text-left text-[15px] font-medium text-[#53627a]">
                                Owner
                            </th>

                            <th className="px-3 py-3 text-left text-[15px] font-medium text-[#53627a]">
                                Rating
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {stores.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-4 py-8 text-center text-[#737b88]"
                                >
                                    No stores found
                                </td>
                            </tr>
                        ) : (
                            stores.map((store) => (
                                <tr
                                    key={store.id}
                                    className="border-b border-[#e5e1d9] last:border-b-0"
                                >
                                    <td className="px-3 py-3 text-[15px] font-medium text-[#17263a]">
                                        {store.name}
                                    </td>

                                    <td className="px-3 py-3 text-[15px] text-[#5f7189]">
                                        {store.email}
                                    </td>

                                    <td className="px-3 py-3 text-[15px] text-[#5f7189]">
                                        {store.address}
                                    </td>

                                    <td className="px-3 py-3 text-[15px] text-[#17263a]">
                                        {store.owner?.name || "-"}
                                    </td>

                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-2">
                                            <Star
                                                size={16}
                                                className="fill-current text-[#f2a033]"
                                            />

                                            <span className="text-[15px] font-medium text-[#17263a]">
                                                {store.averageRating ?? 0}
                                            </span>

                                            <span className="text-[13px] text-[#737b88]">
                                                ({store.totalRatings ?? 0})
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreTable;