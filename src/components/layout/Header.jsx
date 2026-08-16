import { Store, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const role = user?.role;

    const roleLabel = {
        ADMIN: "System Administrator",
        STORE_OWNER: "Store Owner",
        USER: "Normal User",
    };

    // Dashboard route according to role
    const dashboardPath =
        role === "ADMIN"
            ? "/admin"
            : role === "STORE_OWNER"
                ? "/owner"
                : "/user";

    const isDashboardActive =
        location.pathname === dashboardPath ||
        location.pathname.startsWith(`${dashboardPath}/`);

    const isStoresActive =
        location.pathname === "/stores" ||
        location.pathname.startsWith("/stores/");

    const isAccountActive =
        location.pathname === "/account" ||
        location.pathname.startsWith("/account/");

    return (
        <header className="border-b border-[#e5e1d8] bg-[#faf9f5]">
            <div className="mx-auto flex h-[68px] max-w-[1055px] items-center justify-between px-6">

                {/* Logo */}
                <div
                    className="flex cursor-pointer items-center gap-3"
                    onClick={() => navigate(dashboardPath)}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2a033]">
                        <Store size={21} strokeWidth={2.2} />
                    </div>

                    <span className="text-[21px] font-semibold tracking-tight text-[#17263a]">
                        Storefront
                    </span>
                </div>

                {/* Navigation */}
                <nav className="ml-7 flex flex-1 items-center gap-1">

                    {/* Dashboard */}
                    <button
                        type="button"
                        onClick={() => navigate(dashboardPath)}
                        className={`rounded-xl px-4 py-2 text-[15px] transition ${
                            isDashboardActive
                                ? "bg-[#f0eee7] font-medium text-[#17263a]"
                                : "text-[#687284] hover:bg-[#f0eee7] hover:text-[#17263a]"
                        }`}
                    >
                        Dashboard
                    </button>

                    {/* Stores */}
                    <button
                        type="button"
                        onClick={() => navigate("/stores")}
                        className={`rounded-xl px-4 py-2 text-[15px] transition ${
                            isStoresActive
                                ? "bg-[#f0eee7] font-medium text-[#17263a]"
                                : "text-[#687284] hover:bg-[#f0eee7] hover:text-[#17263a]"
                        }`}
                    >
                        Stores
                    </button>

                    {/* Account */}
                    <button
                        type="button"
                        onClick={() => navigate("/account")}
                        className={`rounded-xl px-4 py-2 text-[15px] transition ${
                            isAccountActive
                                ? "bg-[#f0eee7] font-medium text-[#17263a]"
                                : "text-[#687284] hover:bg-[#f0eee7] hover:text-[#17263a]"
                        }`}
                    >
                        Account
                    </button>

                </nav>

                {/* User Info + Logout */}
                <div className="flex items-center gap-4">

                    <div className="text-right">
                        <p className="text-[15px] font-medium text-[#17263a]">
                            {user?.name || "User"}
                        </p>

                        <p className="text-[13px] text-[#737b88]">
                            {roleLabel[role] || role || "User"}
                        </p>
                    </div>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-xl border border-[#ddd9d0] bg-white px-4 py-2 text-[14px] font-medium text-[#17263a] shadow-sm transition hover:bg-[#f5f3ee]"
                    >
                        <LogOut size={17} />
                        Log out
                    </button>

                </div>
            </div>
        </header>
    );
};

export default Header;