import React from "react";
import "./Register.css";

function Register() {
    return (
        <div className={"container"}>
            <div className={"login_label"}>
                <div className={"login_title"}>
                    <h2 className={"title"}>Đăng kí</h2>
                </div>
                <div className={"login_page"}>
                    <a><h6 className={"login_home"}>Trang chủ /</h6></a>
                    <h5 className={"login_name"}>Đăng kí</h5>
                </div>
            </div>
            <div className={"content"}>
                <div className={"form"}>
                    <h2 className={"login_heading"}>Đăng Kí</h2>
                    <div className={"login_section"}>
                        <div className={"username"}>
                            <input className={"user_input"} type={"text"} placeholder={" "}/>
                            <label className={"label_username"}>Tên người dùng</label>
                        </div>
                        <div className={"password"}>
                            <input className={"password_input"} type={"password"} placeholder={" "}/>
                            <label className={"label_password"}>Mật khẩu</label>
                        </div>
                        <div className={"confirm_password"}>
                            <input className={"confirm_password_input"} type={"password"} placeholder={" "}/>
                            <label className={"label_password"}>Xác nhận mật khẩu</label>
                        </div>
                        <div className={"username"}>
                            <input className={"user_input"} type={"text"} placeholder={" "}/>
                            <label className={"label_username"}>Email</label>
                        </div>
                        <div className={"username"}>
                            <input className={"user_input"} type={"text"} placeholder={" "}/>
                            <label className={"label_username"}>Số điện thoại</label>
                        </div>
                        <div className={"register_button"}>
                            <input type={"submit"} className={"register_button"} value={"Đăng kí"}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;