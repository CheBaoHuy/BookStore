import React, { useState } from 'react';
import { Modal, Box, Typography, Rating, TextField } from '@mui/material';
import './PopupRating.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "../../config/api";
import { AddressDto } from "../../models";

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
    token?: string | null;
    onSuccess?: () => void;
}

const PopupRating: React.FC<PopupRatingProps> = ({ open, handleClose, detail, user, token, onSuccess }) => {
    const [stars, setStars] = useState<number | null>(0);
    const [reviewContent, setReviewContent] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);


    if (!detail) {
        return null;
    }

    const handleSubmit = async () => {
        const success = await postReview();
        if (success) {
            handleClose();
        }
    };

    const postReview = async () => {
        if (!stars || stars < 1) {
            toast.error('Vui lòng chọn số sao đánh giá!');
            return false;
        }

        const postData = {
            orderDetailsId: detail.id,
            productId: detail.product.id,
            stars: stars,
            content: reviewContent
        };
        try {
            setSubmitting(true);
            const response = await axios.post('/reviews', postData, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            setReviewContent('')
            setStars(0)
            console.log("success")
            toast.success('Đánh giá thành công!');
            console.log(response);
            onSuccess?.();
            return true;
        } catch (error) {
            toast.error('Đánh giá thất bại!');
            console.error(error);
            return false;
        } finally {
            setSubmitting(false);
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
                        onChange={(event: React.SyntheticEvent, newValue: number | null) => setStars(newValue)}
                        sx={{ mt: -0.5 }}
                    />
                </div>

                <TextField
                    label="Nội dung đánh giá"
                    multiline
                    rows={4}
                    value={reviewContent}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReviewContent(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <div className={'review-button-send'}>
                    <button className={"rate_button"} onClick={handleClose} >
                        Hủy
                    </button>
                    <button className={"rate_button"} onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
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
