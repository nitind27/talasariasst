import AdminLayout from "./AdminLayout";

export const metadata = {
  title: "Admin | Talasari",
};

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}