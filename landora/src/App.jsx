/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Home Components
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import AboutUs from './Components/Home/AboutUs';
import Contact from './Components/Home/ContactUs';
import Register from './Components/Login/Register';
import UserProfile from './Components/pages/UserProfile';
import PrivacyPolicy from './Components/pages/PrivacyPolicy';
import TermsOfUse from './Components/pages/TermsOfUse';

// Admin Components
import AdminDashboard from './Components/Admin/AdminDashboard';
import Dashboard from './Components/Admin/Dashboard';
import UserDetails from './Components/Admin/UserManagement/UserDetails';
import AddUser from './Components/Admin/UserManagement/AddUser';
import UpdateUser from './Components/Admin/UserManagement/UpdateUser';


import { AuthProvider } from './Components/Auth/AuthContext';  // Import AuthProvider
import MakePayment from './Components/pages/MakePayment';

//Sales Components
import SalesDashboard from './Components/Admin/SalesManagement/SalesList';
import FinancialTransactions from './Components/Admin/SalesManagement/FinancialTransactions';
import PaymentsAndReceipts from './Components/Admin/SalesManagement/PaymentsAndReceipts';
import TransactionStatus from './Components/Admin/SalesManagement/TransactionStatus';
import ContractsAndAgreements from './Components/Admin/SalesManagement/ContractsAndAgreements';
import Sales from './Components/Admin/SalesManagement/SalesView';

//Maintenance Components
import MaintenanceList from './Components/Admin/MaintananceManagement/MaintananceList';
import Requests from './Components/Admin/MaintananceManagement/Requests';
import VendorManagement from './Components/Admin/MaintananceManagement/Vendor';
import Cost from './Components/Admin/MaintananceManagement/Cost';
import Schedules from './Components/Admin/MaintananceManagement/Schedules';

//Property Components
import PropertyList from './Components/Admin/PropertyManagement/PropertyList';
import PropertyDetails from './Components/Admin/PropertyManagement/PropertyDetails';

//Extra Features
import EFpage from './Components/ExtraFeature/EFpage';

function App() {
  return (
    <AuthProvider>  {/* Wrap the entire app with AuthProvider */}
      <Router>
        <Routes>
          {/* Home Page as the default route */}
          <Route path="/" element={<Home />} />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/signup' element={<Register />} />
          <Route path='/userprofile' element={<UserProfile />} />
          <Route path='/efpage' element={<EFpage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/userprofile/:userId" element={<UserProfile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/makepayment/:id" element={<MakePayment />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termsofuse" element={<TermsOfUse />} />
          
          <Route path="/sales-management" element={<SalesDashboard />} >
            <Route path="SalesList" element={<Sales />} />
            <Route path="FinancialTransactions" element={<FinancialTransactions />} />
            <Route path="PaymentsAndReceipts" element={<PaymentsAndReceipts />} />
            <Route path="TransactionStatus" element={<TransactionStatus />} />
            <Route path="ContractsAndAgreements" element={<ContractsAndAgreements />} />    
          </Route>

          <Route path="/maintanance-management" element={<MaintenanceList />} >
            <Route path="Requests" element={<Requests />} />
            <Route path="Vendor" element={<VendorManagement />} />
            <Route path="Costs" element={<Cost />} />
            <Route path="Schedules" element={<Schedules />} />
          </Route>

          <Route path="/property-management" element={<PropertyList />} >
            <Route path="list" element={<PropertyDetails />} />
            <Route path="Vendor" element={<VendorManagement />} />
            <Route path="Costs" element={<Cost />} />
            <Route path="Schedules" element={<Schedules />} />
            
          </Route>


          {/* Admin Dashboard Routes */}
          <Route path="/admindashboard" element={<AdminDashboard />}>
            <Route path="dashboard" element={<Dashboard />} />
            {/* User Management */}

            <Route path="user-management" element={<UserDetails />} />
            <Route path="adduser" element={<AddUser />} />
            <Route path="update-user/:id" element={<UpdateUser />} />

          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div>
      <h2>404 - Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default App;





















