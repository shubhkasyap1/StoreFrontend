import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/layout/Header";
import AdminStats from "../../components/admin/AdminStats";
import AdminTabs from "../../components/admin/AdminTabs";
import UserFilters from "../../components/admin/UserFilters";
import UserTable from "../../components/admin/UserTable";
import StoreTable from "../../components/admin/StoreTable";
import CreateUserModal from "../../components/admin/CreateUserModal";
import CreateStoreModal from "../../components/admin/CreateStoreModal";

import { useAuth } from "../../context/AuthContext";
import {
    getAdminDashboard,
    getAdminUsers,
} from "../../services/adminApi";

import { getStores } from "../../services/storeApi";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState("users");
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");

    /*
     * Load dashboard statistics
     */
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getAdminDashboard();

                setStats(response.data);
            } catch (err) {
                console.error(
                    "Dashboard error:",
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    /*
     * Load users
     */
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await getAdminUsers({
                    page: 1,
                    limit: 100,
                });

                setUsers(response.data?.users || []);
            } catch (err) {
                console.error(
                    "Users error:",
                    err.response?.data || err.message
                );
            }
        };

        loadUsers();
    }, []);

    /*
     * Load stores
     */
    useEffect(() => {
        const loadStores = async () => {
            try {
                const response = await getStores();

                setStores(response.data?.stores || []);
            } catch (err) {
                console.error(
                    "Stores error:",
                    err.response?.data || err.message
                );
            }
        };

        loadStores();
    }, []);

    /*
     * Frontend filtering.
     *
     * Backend currently provides one `search`
     * parameter, so separate UI filters are applied
     * to the fetched users here.
     */
    const filteredUsers = useMemo(() => {
        return users.filter((item) => {
            const matchesName = item.name
                ?.toLowerCase()
                .includes(name.toLowerCase());

            const matchesEmail = item.email
                ?.toLowerCase()
                .includes(email.toLowerCase());

            const matchesAddress = item.address
                ?.toLowerCase()
                .includes(address.toLowerCase());

            const matchesRole =
                role === "" || item.role === role;

            return (
                matchesName &&
                matchesEmail &&
                matchesAddress &&
                matchesRole
            );
        });
    }, [users, name, email, address, role]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf9f5]">
                <Header />

                <main className="mx-auto max-w-[1055px] px-6 py-16">
                    <div className="flex items-center justify-center">
                        <p className="text-[#657084]">
                            Loading dashboard...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f5]">

            <Header />

            <main className="mx-auto max-w-[1055px] px-6 pb-12 pt-10">

                {/* Heading */}
                <div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-[#17263a]">
                        Administrator dashboard
                    </h1>

                    <p className="mt-1 text-[15px] text-[#657084]">
                        Platform totals, users and stores.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Stats */}
                <div className="mt-10">
                    <AdminStats stats={stats} />
                </div>

                {/* Tabs + Add User */}
                {/* Tabs + Action */}
                <div className="mt-9 flex items-center justify-between">
                    <AdminTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    {activeTab === "users" && (
                        <button
                            onClick={() =>
                                setShowCreateUserModal(true)
                            }
                            className="rounded-xl bg-[#213b59] px-5 py-2.5 text-[15px] font-medium text-white shadow-sm transition hover:bg-[#192f48]"
                        >
                            Add user
                        </button>
                    )}

                    {activeTab === "stores" && (
                        <button
                            onClick={() =>
                                setShowCreateStoreModal(true)
                            }
                            className="rounded-xl bg-[#213b59] px-5 py-2.5 text-[15px] font-medium text-white shadow-sm transition hover:bg-[#192f48]"
                        >
                            Add store
                        </button>
                    )}
                </div>

                {/* Users */}
                {activeTab === "users" && (
                    <section className="mt-4">

                        <UserFilters
                            name={name}
                            setName={setName}
                            email={email}
                            setEmail={setEmail}
                            address={address}
                            setAddress={setAddress}
                            role={role}
                            setRole={setRole}
                        />

                        <div className="mt-3">
                            <UserTable users={filteredUsers} />
                        </div>

                    </section>
                )}

                {/* Stores */}
                {activeTab === "stores" && (
                    <section className="mt-4">
                        <StoreTable stores={stores} />
                    </section>
                )}
            </main>



            <CreateUserModal
                isOpen={showCreateUserModal}
                onClose={() => setShowCreateUserModal(false)}
                onUserCreated={(newUser) => {
                    if (!newUser) {
                        return;
                    }

                    setUsers((prev) => [
                        newUser,
                        ...prev,
                    ]);

                    setStats((prev) => ({
                        ...prev,
                        users: {
                            ...prev.users,
                            total:
                                (prev?.users?.total || 0) + 1,
                        },
                    }));
                }}
            />

            <CreateStoreModal
                isOpen={showCreateStoreModal}
                onClose={() =>
                    setShowCreateStoreModal(false)
                }
                onStoreCreated={(newStore) => {
                    if (!newStore) {
                        return;
                    }

                    setStores((prev) => [
                        newStore,
                        ...prev,
                    ]);

                    setStats((prev) => ({
                        ...prev,
                        stores: {
                            ...prev.stores,
                            total:
                                (prev?.stores?.total || 0) + 1,
                        },
                    }));
                }}
            />
        </div>
    );
};



export default AdminDashboard;