import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import RoleSelection from "./pages/role-selection.jsx"
import ReceptionistSelection from "./pages/receptionist-selection"
import ReceptionistInventoryQuantity from "./pages/receptionist-inventory-quantity"
import ReceptionistLocatePackage from "./pages/receptionist-locate-package"
import AdminSelection from './pages/admin-selection.jsx';
import AdminManage from './pages/admin-manage.jsx';
import AdminPrint from './pages/admin-print.jsx';
import ReceptionistWorkFlow from './pages/receptionist-work-flow.jsx';



function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/Admin/Print" element={<AdminPrint/>} />
        <Route path="/Admin/Manage" element={<AdminManage/>} />
        <Route path="/Admin" element={<AdminSelection/>} />
        <Route path="/Receptionist" element={<ReceptionistSelection />} />
        <Route path="/Receptionist/InventoryQuantity" element={<ReceptionistInventoryQuantity />} />
        <Route path="/Receptionist/LocatePackage" element={<ReceptionistLocatePackage />} />
        <Route path="/Receptionist/Scanner" element={<ReceptionistWorkFlow />} />
      </Routes>
    </div>
  );
}

export default App;
