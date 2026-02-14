import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { PropertyData } from "@/components/dashboard/EditPropertyModal";
import { Transaction } from "@/pages/dashboard/tenant/TenantTransactions";
import { Complaint } from "@/components/tenant/AddComplaintModal";
import { useNavigate } from "react-router-dom";
// import { ProfileData } from "@/pages/Profile";

type DataContextType = {
  properties: PropertyData[];
  setProperties?: React.Dispatch<React.SetStateAction<PropertyData[]>>;
  transactions: Transaction[];
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
  complaints: Complaint[];
  setComplaints?: React.Dispatch<React.SetStateAction<Complaint[]>>;
  // profile?: ProfileData[] | null;
  // setProfile?: React.Dispatch<React.SetStateAction<ProfileData[] | null>>;
  loading: boolean;
};

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  // const [profile, setProfile] = useState<ProfileData[] | null>(null);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const results = await Promise.allSettled([
        axios.get("http://localhost:5000/api/properties/get_all_prop_by_user", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/payment/getbyId/${role}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(
          `http://localhost:5000/api/complain/getComplainByuserId/${role}`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      ]);

      // Properties
      if (results[0].status === "fulfilled") {
        setProperties(results[0].value.data?.prop || []);
      } else {
        console.error("Properties failed:", results[0].reason);
      }

      // Transactions
      if (results[1].status === "fulfilled") {
        setTransactions(results[1].value.data?.pay || []);
      } else {
        console.error("Transactions failed:", results[1].reason);
      }

      // Complaints
      if (results[2].status === "fulfilled") {
        setComplaints(results[2].value.data?.comp || []);
      } else {
        console.error("Complaints failed:", results[2].reason);
      }

      setLoading(false);
    };

    fetchAllData();
  }, [token]);

  return (
    <DataContext.Provider
      value={{
        properties,
        setProperties,
        transactions,
        setTransactions,
        complaints,
        setComplaints,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
