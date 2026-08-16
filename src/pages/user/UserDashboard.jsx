import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import StoreTable from "../../components/stores/StoreTable";
import { getStores } from "../../services/storeApi";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nameSearch, setNameSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");

  const fetchStores = async () => {
    try {
      setLoading(true);

      const response = await getStores();

      console.log("STORES RESPONSE:", response);

      const storesData =
        Array.isArray(response)
          ? response
          : Array.isArray(response?.stores)
            ? response.stores
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response?.data?.stores)
                ? response.data.stores
                : [];

      setStores(storesData);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = Array.isArray(stores)
    ? stores.filter((store) => {
      const name = store.name?.toLowerCase() || "";
      const address = store.address?.toLowerCase() || "";

      return (
        name.includes(nameSearch.toLowerCase()) &&
        address.includes(addressSearch.toLowerCase())
      );
    })
    : [];

  return (
    <>
      <Header />

      <main className="mx-auto max-w-[1350px] px-6 pb-16 pt-10">
        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Registered stores
          </h1>

          <p className="mt-1 text-slate-600">
            Search stores and submit or modify your rating from 1 to 5.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <input
              type="text"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              placeholder="Search by name"
              className="h-11 w-full rounded-xl border border-[#ddd9d1] bg-white px-4 text-slate-800 shadow-sm outline-none placeholder:text-[#61728a] focus:border-slate-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              placeholder="Search by address"
              className="h-11 w-full rounded-xl border border-[#ddd9d1] bg-white px-4 text-slate-800 shadow-sm outline-none placeholder:text-[#61728a] focus:border-slate-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>
        </div>

        {/* Stores */}
        <div className="mt-7">
          <StoreTable
            stores={filteredStores}
            loading={loading}
            onRatingUpdated={fetchStores}
          />
        </div>
      </main>
    </>
  );
};

export default UserDashboard;