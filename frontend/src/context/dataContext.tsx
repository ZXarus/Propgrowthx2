import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { PropertyData } from "@/components/dashboard/EditPropertyModal";
import { Transaction } from "@/pages/dashboard/tenant/TenantTransactions";
import { Complaint } from "@/components/tenant/AddComplaintModal";
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

  useEffect(() => {
    const fetchAllData = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const [propsRes, transRes, complaintsRes] = await Promise.all([
          axios.get(
            "http://localhost:5000/api/properties/get_all_prop_by_user",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
          axios.get("http://localhost:5000/api/payment/getbyId", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `http://localhost:5000/api/complain/getComplainByuserId/${role}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ]);

        setProperties(propsRes.data || []);
        setTransactions(transRes.data || []);
        setComplaints(complaintsRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
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
