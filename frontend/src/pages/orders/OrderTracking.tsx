import React from "react";
import { Navigate } from "react-router-dom";

function OrderTracking() {
    return <Navigate to="/profile?tab=tracking" replace />;
}

export default OrderTracking;
