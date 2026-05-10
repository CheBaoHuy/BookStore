import axios from "axios";

const BASE_URL = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/';
const TOKEN = '3b12eeb4-23da-11ef-bd7e-e680cd8a9749';
const SHOP_ID = 568003;

const addressApiService = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "token": TOKEN,
    },
});

export const shippingApiService = axios.create({
    baseURL: 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
    headers: {
        "Content-Type": "application/json",
        "token": TOKEN,
        "ShopId": SHOP_ID.toString(),
    },
});

export const fetchData = async (endpoint: any, params = {}) => {
    try {
        const response = await addressApiService.get(endpoint, { params });
        return response.data.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchDataShipping = async (fromDistrictId: any, fromWardCode: any) => {
    const requestBody = {
        from_district_id: fromDistrictId,
        from_ward_code: fromWardCode,
        service_id: 0,
        service_type_id: 2,
        to_district_id: 3695,
        to_ward_code: '90775',
        height: 50,
        length: 20,
        weight: 200,
        width: 20,
        insurance_value: 10000,
        cod_failed_amount: 2000,
        coupon: null,
    };

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Token': TOKEN,
            'ShopId': SHOP_ID.toString(),
        },
        body: JSON.stringify(requestBody),
    };

    try {
        const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', requestOptions);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};
