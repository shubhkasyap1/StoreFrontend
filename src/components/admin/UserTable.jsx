import { ArrowUp, ArrowUpDown } from "lucide-react";

const UserTable = ({ users = [] }) => {
    const getRoleLabel = (role) => {
        switch (role) {
            case "ADMIN":
                return "System Administrator";

            case "STORE_OWNER":
                return "Store Owner";

            case "USER":
                return "Normal User";

            default:
                return role;
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-[#dfdcd4] bg-white">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[#dfdcd4]">
                            <th className="px-3 py-3 text-left text-[15px] font-medium text-[#53627a]">
                                <div className="flex items-center gap-1">
                                    Name
                                    <ArrowUp size={15} />
                                </div>
                            </th>

                            <th className="px-3 py-3 text-left text-[15px] font-medium text-[#53627a]">
                                <div className="flex items-center gap-1">
                                    Email
                                    <ArrowUpDown size={15} />
                                </div>
                            </th>

                            <th className="px-3 py-3 text-left text-[15px] font-medium text-[#53627a]">
                                <div className="flex items-center gap-1">
                                    Address
                                    <ArrowUpDown size={15} />
                                </div>
                            </th>

                            <th className="px-3 py-3 text-left text-[15px] font-medium text-[#53627a]">
                                <div className="flex items-center gap-1">
                                    Role
                                    <ArrowUpDown size={15} />
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-4 py-8 text-center text-[#737b88]"
                                >
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-[#e5e1d9] last:border-b-0"
                                >
                                    <td className="px-3 py-3 text-[15px] font-medium text-[#17263a]">
                                        {user.name}
                                    </td>

                                    <td className="px-3 py-3 text-[15px] text-[#5f7189]">
                                        {user.email}
                                    </td>

                                    <td className="px-3 py-3 text-[15px] text-[#5f7189]">
                                        {user.address || "-"}
                                    </td>

                                    <td className="px-3 py-3 text-[15px] text-[#17263a]">
                                        {getRoleLabel(user.role)}
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

export default UserTable;