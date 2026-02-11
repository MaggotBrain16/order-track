// src/App.jsx
import { Routes, Route } from "react-router-dom";
import {LoginPage} from "./presentation/pages/auth/LoginPage.jsx";
import {RegisterPage} from "./presentation/pages/auth/RegisterPage.jsx";
import {ProtectedRoute} from "./presentation/components/auth/ProtectedRoute.jsx";
import {AppLayout} from "./presentation/layouts/AppLayout.jsx";
import {DashboardPage} from "./presentation/pages/dashboard/DashboardPage.jsx";
import {OrdersPage} from "./presentation/pages/orders/OrdersPage.jsx";
import {OrderDetailsPage} from "./presentation/pages/orders/OrderDetailsPage.jsx";
import {UpdateOrderPage} from "./presentation/pages/orders/UpdateOrderPage.jsx";
import {CustomersPage} from "./presentation/pages/customers/CustomersPage.jsx";
import {BusinessManagementPage} from "./presentation/pages/business/BusinessManagementPage.jsx";


export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
                <Route path="/orders/:orderId/update" element={<UpdateOrderPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/company" element={<BusinessManagementPage />} />
            </Route>
        </Routes>
    );
}
