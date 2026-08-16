import { ChevronDown } from "lucide-react";

const UserFilters = ({
    name,
    setName,
    email,
    setEmail,
    address,
    setAddress,
    role,
    setRole,
}) => {
    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

            <input
                type="text"
                placeholder="Filter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl border border-[#dedbd3] bg-white px-4 text-[15px] text-[#17263a] outline-none placeholder:text-[#63738a] focus:border-[#9ba5b2]"
            />

            <input
                type="text"
                placeholder="Filter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border border-[#dedbd3] bg-white px-4 text-[15px] text-[#17263a] outline-none placeholder:text-[#63738a] focus:border-[#9ba5b2]"
            />

            <input
                type="text"
                placeholder="Filter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11 rounded-xl border border-[#dedbd3] bg-white px-4 text-[15px] text-[#17263a] outline-none placeholder:text-[#63738a] focus:border-[#9ba5b2]"
            />

            <div className="relative">
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#dedbd3] bg-white px-4 pr-10 text-[15px] text-[#17263a] outline-none focus:border-[#9ba5b2]"
                >
                    <option value="">All roles</option>
                    <option value="system_admin">System Administrator</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="user">Normal User</option>
                </select>

                <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#737b88]"
                />
            </div>
        </div>
    );
};

export default UserFilters;