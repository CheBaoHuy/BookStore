import React, { useState } from 'react';
import { Modal, Box, Typography, Rating, TextField } from '@mui/material';
import './PopupRating.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {AddressDto, RateDto} from "../../models";

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '3px',
    boxShadow: 10,
    p: 4,
};

// const styleBtn = {
//     bgcolor: 'var(--color-black)',
//     p: 1,
//     mr: 2,
//     '&:hover': {
//         bgcolor: '#fff',
//         color: '#000'
//     }
// };
interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    avatar: string;
    username: string;
    address: AddressDto[];
}

interface PopupRatingProps {
    open: boolean;
    handleClose: () => void;
    detail: {
        id: number;
        product: {
            id: number;
            name: string;
        };
        quantity: number;
    } | null;
    user: User;
}

const PopupRating: React.FC<PopupRatingProps> = ({ open, handleClose, detail, user }) => {
    const [stars, setStars] = useState<number | null>(0);
    const [reviewContent, setReviewContent] = useState<string>('');


    if (!detail) {
        return null;
    }

    const handleSubmit = () => {
        postReview();
        handleClose();
    };

    const postReview = async () => {
        const postData = {
            userId: user.id,
            orderDetailsId: detail.id,
            productId: detail.product.id,
            stars: stars,
            content: reviewContent
        };
        try {
            const response = await axios.post<RateDto>('http://localhost:8080/api/v1/review/createRate', postData)
            setReviewContent('')
            setStars(0)
            console.log("success")
            toast.success('Đánh giá thành công!');
            console.log(response);
        } catch (error) {
            toast.error('Đánh giá thất bại!');
            console.error(error);
        }
    }

    return (

        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Đánh giá sản phẩm
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    {detail.product.name}
                </Typography>
                <div className={'stars-container'}>
                    <p className={'stars-title'}>Chất lượng sản phẩm: </p>
                    <Rating
                        name="product-rating"
                        size={'large'}
                        value={stars}
                        onChange={(event, newValue) => setStars(newValue)}
                        sx={{ mt: -0.5 }}
                    />
                </div>

                <TextField
                    label="Nội dung đánh giá"
                    multiline
                    rows={4}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <div className={'review-button-send'}>
                    <button className={"rate_button"} onClick={handleClose} >
                        Hủy
                    </button>
                    <button className={"rate_button"} onClick={handleSubmit}>
                        Gửi đánh giá
                    </button>

                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </Box>

        </Modal>


    );
};

export default PopupRating;
