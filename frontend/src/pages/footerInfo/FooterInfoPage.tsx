import React, { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaChevronRight, FaHeadset, FaMapMarkerAlt, FaShieldAlt, FaTruck } from "react-icons/fa";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import AboutImage from "../../images/LabelImages/about.jpg";
import StoreLocationsImage from "../../images/store locations.jpg";
import "./FooterInfoPage.css";

type InfoContent = {
    title: string;
    subtitle: string;
    badge: string;
    image: string;
    facts: string[];
    sections: { heading: string; content: string[] }[];
};

const footerInfoMap: Record<string, InfoContent> = {
    "how-to-buy": {
        title: "Hướng Dẫn Mua Hàng",
        subtitle: "Quy trình mua sắm tại BookStore được xây dựng rõ ràng, thuận tiện và minh bạch nhằm mang đến trải nghiệm đặt hàng chuyên nghiệp trên mọi thiết bị.",
        badge: "Hướng dẫn",
        image: AboutImage,
        facts: ["Tra cứu sách nhanh chóng", "Kiểm tra giỏ hàng minh bạch", "Thanh toán an toàn, theo dõi thuận tiện"],
        sections: [
            {
                heading: "Bước 1. Chọn sản phẩm",
                content: [
                    "Quý khách có thể tra cứu sách theo danh mục, tên sách, tác giả hoặc nhà xuất bản để nhanh chóng tiếp cận sản phẩm phù hợp với nhu cầu.",
                    "Tại trang chi tiết sản phẩm, hệ thống hiển thị đầy đủ thông tin mô tả, giá bán, số lượng hiện có cùng các gợi ý liên quan để hỗ trợ quyết định mua sắm."
                ]
            },
            {
                heading: "Bước 2. Thêm vào giỏ và kiểm tra thông tin",
                content: [
                    "Sau khi lựa chọn số lượng phù hợp, quý khách chỉ cần thêm sản phẩm vào giỏ hàng để tiếp tục quá trình đặt mua.",
                    "Tại trang giỏ hàng, quý khách có thể điều chỉnh số lượng, loại bỏ sản phẩm không còn nhu cầu và rà soát tổng giá trị đơn hàng trước khi thanh toán."
                ]
            },
            {
                heading: "Bước 3. Thanh toán và xác nhận",
                content: [
                    "Quý khách vui lòng điền đầy đủ thông tin nhận hàng, lựa chọn phương thức thanh toán phù hợp và xác nhận đơn hàng theo hướng dẫn của hệ thống.",
                    "Ngay sau khi đặt hàng thành công, lịch sử đơn hàng sẽ được lưu lại trong tài khoản để thuận tiện cho việc tra cứu và theo dõi."
                ]
            }
        ]
    },
    faq: {
        title: "Câu Hỏi Thường Gặp",
        subtitle: "Trang thông tin này tổng hợp các vấn đề thường được khách hàng quan tâm trong quá trình mua sắm, thanh toán và nhận hàng tại BookStore.",
        badge: "Giải đáp",
        image: AboutImage,
        facts: ["Nội dung cô đọng", "Giải thích rõ ràng", "Phù hợp cho khách hàng mới"],
        sections: [
            {
                heading: "Tôi có cần tài khoản để mua hàng không?",
                content: [
                    "BookStore khuyến nghị quý khách tạo tài khoản để lưu trữ địa chỉ nhận hàng, theo dõi lịch sử mua sắm và tiếp cận các ưu đãi dành riêng cho thành viên.",
                    "Quá trình đăng ký được thực hiện nhanh gọn và chỉ yêu cầu một địa chỉ email hợp lệ."
                ]
            },
            {
                heading: "Tôi có thể huỷ đơn hàng không?",
                content: [
                    "Quý khách có thể liên hệ bộ phận chăm sóc khách hàng trong thời gian sớm nhất nếu đơn hàng chưa được xử lý đóng gói hoặc bàn giao vận chuyển.",
                    "Đối với các đơn đã chuyển sang đơn vị vận chuyển, việc hủy đơn sẽ được xem xét theo trạng thái thực tế của đơn hàng."
                ]
            },
            {
                heading: "Làm sao để kiểm tra đơn hàng?",
                content: [
                    "Sau khi đăng nhập, quý khách có thể truy cập mục đơn hàng để theo dõi trạng thái xử lý và toàn bộ lịch sử giao dịch đã phát sinh.",
                    "Trong trường hợp cần hỗ trợ bổ sung, vui lòng cung cấp mã đơn hàng để đội ngũ chăm sóc khách hàng kiểm tra nhanh và chính xác hơn."
                ]
            }
        ]
    },
    "store-locations": {
        title: "Hệ Thống Cửa Hàng",
        subtitle: "BookStore vận hành theo mô hình kinh doanh trực tuyến kết hợp điểm hỗ trợ, nhằm bảo đảm sự thuận tiện và thống nhất trong quá trình phục vụ khách hàng.",
        badge: "Cửa hàng",
        image: StoreLocationsImage,
        facts: ["Hỗ trợ trực tuyến toàn quốc", "Điểm tiếp nhận tại TP.HCM", "Tư vấn qua điện thoại và email"],
        sections: [
            {
                heading: "Trụ sở và điểm hỗ trợ",
                content: [
                    "Khu vực hỗ trợ chính hiện được đặt tại Đại học Nông Lâm TP.HCM, phường Linh Trung, TP. Thủ Đức.",
                    "Đây là đầu mối tiếp nhận yêu cầu hỗ trợ, phối hợp xử lý đơn hàng và phản hồi các vấn đề phát sinh trong quá trình mua sắm."
                ]
            },
            {
                heading: "Kênh hỗ trợ liên hệ",
                content: [
                    "Điện thoại: 0793684680",
                    "Email: 201030277@st.hcmuaf.edu.vn"
                ]
            },
            {
                heading: "Khuyến nghị trước khi đến trực tiếp",
                content: [
                    "Quý khách nên liên hệ trước để được xác nhận thời gian hỗ trợ phù hợp, giúp hạn chế thời gian chờ đợi không cần thiết.",
                    "Đối với phần lớn nhu cầu thông thường, BookStore ưu tiên hỗ trợ qua kênh trực tuyến để bảo đảm tốc độ xử lý và sự thuận tiện."
                ]
            }
        ]
    },
    "return-policy": {
        title: "Chính Sách Đổi Trả",
        subtitle: "BookStore chú trọng bảo vệ quyền lợi khách hàng thông qua quy trình tiếp nhận và xử lý đổi trả rõ ràng, công bằng và minh bạch.",
        badge: "Đổi trả",
        image: AboutImage,
        facts: ["Áp dụng với sản phẩm có lỗi", "Tiếp nhận đúng quy trình", "Xử lý minh bạch theo từng trường hợp"],
        sections: [
            {
                heading: "Trường hợp được hỗ trợ",
                content: [
                    "BookStore hỗ trợ đối với các trường hợp sách bị lỗi in ấn, thiếu trang, giao nhầm sản phẩm hoặc hư hỏng trong quá trình đóng gói, vận chuyển.",
                    "Quý khách nên kiểm tra tình trạng đơn hàng ngay khi nhận để phản hồi kịp thời và được hỗ trợ nhanh chóng."
                ]
            },
            {
                heading: "Điều kiện đổi trả",
                content: [
                    "Sản phẩm cần được giữ ở tình trạng phù hợp, đồng thời còn đầy đủ thông tin đơn hàng và bằng chứng xác thực nếu phát sinh lỗi.",
                    "Trong một số trường hợp, BookStore có thể đề nghị quý khách cung cấp thêm hình ảnh hoặc video để phục vụ quá trình xác minh."
                ]
            },
            {
                heading: "Thời gian xử lý",
                content: [
                    "Sau khi hoàn tất việc xác minh, đội ngũ hỗ trợ sẽ thông báo phương án đổi, hoàn hoặc điều chỉnh phù hợp với tình huống thực tế.",
                    "Thời gian xử lý cụ thể phụ thuộc vào tình trạng hàng hóa, hồ sơ cung cấp và tiến độ phối hợp với đơn vị vận chuyển."
                ]
            }
        ]
    },
    "payment-policy": {
        title: "Chính Sách Thanh Toán",
        subtitle: "BookStore cung cấp các phương thức thanh toán phù hợp nhằm bảo đảm sự thuận tiện, an toàn và minh bạch cho khách hàng trong suốt quá trình giao dịch.",
        badge: "Thanh toán",
        image: AboutImage,
        facts: ["Hỗ trợ nhiều phương thức", "Đối soát rõ ràng", "Ưu tiên an toàn giao dịch"],
        sections: [
            {
                heading: "Phương thức hỗ trợ",
                content: [
                    "Quý khách có thể lựa chọn các phương thức thanh toán được hệ thống hiển thị tại bước xác nhận đơn hàng.",
                    "Tùy theo đặc điểm đơn hàng và điều kiện vận hành tại từng thời điểm, danh sách phương thức khả dụng có thể được điều chỉnh."
                ]
            },
            {
                heading: "Xác nhận giao dịch",
                content: [
                    "Khi giao dịch được thực hiện thành công, hệ thống sẽ ghi nhận trạng thái thanh toán tương ứng trên đơn hàng của quý khách.",
                    "Đối với hình thức chuyển khoản, quý khách vui lòng nhập chính xác nội dung thanh toán để việc đối soát được tiến hành nhanh chóng hơn."
                ]
            },
            {
                heading: "Lưu ý an toàn",
                content: [
                    "BookStore không yêu cầu khách hàng cung cấp mật khẩu tài khoản ngân hàng, mã OTP hoặc thông tin bảo mật ngoài các kênh chính thức.",
                    "Nếu phát hiện dấu hiệu bất thường trong quá trình thanh toán, quý khách vui lòng liên hệ ngay bộ phận hỗ trợ để được kiểm tra kịp thời."
                ]
            }
        ]
    },
    shipment: {
        title: "Chính Sách Vận Chuyển",
        subtitle: "Các thông tin liên quan đến vận chuyển được công bố rõ ràng nhằm giúp khách hàng chủ động theo dõi tiến trình giao nhận của đơn hàng.",
        badge: "Vận chuyển",
        image: StoreLocationsImage,
        facts: ["Phân tuyến theo khu vực", "Cập nhật trạng thái đơn hàng", "Phối hợp với đơn vị vận chuyển"],
        sections: [
            {
                heading: "Phạm vi giao hàng",
                content: [
                    "BookStore hỗ trợ giao hàng đến nhiều khu vực, trong đó thời gian nhận hàng có thể thay đổi tùy theo địa chỉ cụ thể của người nhận.",
                    "Các khu vực nội thành thường có tốc độ xử lý và giao nhận nhanh hơn so với các khu vực ngoại thành hoặc liên tỉnh."
                ]
            },
            {
                heading: "Chi phí vận chuyển",
                content: [
                    "Chi phí vận chuyển sẽ được hiển thị minh bạch tại bước thanh toán trước khi quý khách xác nhận đơn hàng.",
                    "Một số chương trình ưu đãi có thể áp dụng chính sách giảm hoặc miễn phí vận chuyển tùy theo điều kiện cụ thể."
                ]
            },
            {
                heading: "Theo dõi giao hàng",
                content: [
                    "Quý khách có thể theo dõi tình trạng giao hàng trong tài khoản cá nhân hoặc liên hệ bộ phận hỗ trợ khi cần cập nhật thêm thông tin.",
                    "Toàn bộ dữ liệu giao nhận được lưu trữ nhằm phục vụ việc đối chiếu và xử lý khi phát sinh vấn đề."
                ]
            }
        ]
    },
    "delivery-information": {
        title: "Thông Tin Giao Hàng",
        subtitle: "BookStore tối ưu quy trình giao nhận nhằm bảo đảm đơn hàng được chuyển đến khách hàng nhanh chóng, chính xác và an toàn.",
        badge: "Giao hàng",
        image: StoreLocationsImage,
        facts: ["Xử lý đơn theo quy trình", "Xác minh địa chỉ rõ ràng", "Ưu tiên giao đúng hẹn"],
        sections: [
            {
                heading: "Thời gian chuẩn bị đơn",
                content: [
                    "Mỗi đơn hàng sẽ được xác nhận, kiểm tra tồn kho và chuẩn bị trong thời gian sớm nhất theo quy trình vận hành của hệ thống.",
                    "Trong các giai đoạn cao điểm, thời gian xử lý có thể kéo dài hơn do số lượng đơn phát sinh tăng mạnh."
                ]
            },
            {
                heading: "Địa chỉ và người nhận",
                content: [
                    "Quý khách vui lòng cung cấp chính xác họ tên, số điện thoại và địa chỉ nhận hàng để hạn chế tối đa các phát sinh chậm trễ.",
                    "Nếu cần điều chỉnh thông tin giao nhận, quý khách nên liên hệ sớm trước thời điểm đơn hàng được bàn giao cho đơn vị vận chuyển."
                ]
            },
            {
                heading: "Hỗ trợ khi giao không thành công",
                content: [
                    "Trong trường hợp giao hàng không thành công, đội ngũ hỗ trợ sẽ phối hợp với đơn vị vận chuyển để sắp xếp phương án xử lý phù hợp.",
                    "Quý khách nên duy trì liên lạc trong suốt thời gian giao nhận để quá trình nhận hàng diễn ra thuận lợi hơn."
                ]
            }
        ]
    },
    "privacy-policy": {
        title: "Chính Sách Bảo Mật",
        subtitle: "BookStore tôn trọng quyền riêng tư và cam kết bảo vệ dữ liệu cá nhân của khách hàng trong toàn bộ quá trình sử dụng dịch vụ.",
        badge: "Bảo mật",
        image: AboutImage,
        facts: ["Bảo vệ dữ liệu cá nhân", "Sử dụng đúng mục đích", "Hạn chế chia sẻ không cần thiết"],
        sections: [
            {
                heading: "Thông tin được thu thập",
                content: [
                    "BookStore có thể thu thập các dữ liệu cần thiết như họ tên, email, số điện thoại, địa chỉ giao hàng và lịch sử mua sắm.",
                    "Các thông tin này được sử dụng nhằm phục vụ việc xử lý đơn hàng, hỗ trợ khách hàng và cải thiện chất lượng trải nghiệm trên hệ thống."
                ]
            },
            {
                heading: "Mục đích sử dụng",
                content: [
                    "Dữ liệu cá nhân được sử dụng cho các mục đích chính đáng như xác nhận đơn hàng, liên hệ giao nhận, hỗ trợ kỹ thuật và gửi thông báo liên quan đến tài khoản.",
                    "BookStore không sử dụng thông tin khách hàng ngoài các mục đích vận hành hợp lý, minh bạch và cần thiết."
                ]
            },
            {
                heading: "Cam kết bảo vệ",
                content: [
                    "BookStore áp dụng các biện pháp kỹ thuật và quản trị phù hợp nhằm hạn chế nguy cơ truy cập trái phép vào dữ liệu cá nhân.",
                    "Quý khách cũng nên chủ động bảo mật tài khoản của mình và không chia sẻ thông tin đăng nhập cho bất kỳ bên thứ ba nào."
                ]
            }
        ]
    },
    discount: {
        title: "Chính Sách Khuyến Mãi",
        subtitle: "Các chương trình ưu đãi tại BookStore luôn được công bố minh bạch, kèm theo điều kiện áp dụng rõ ràng và nhất quán.",
        badge: "Khuyến mãi",
        image: AboutImage,
        facts: ["Ưu đãi theo chiến dịch", "Điều kiện áp dụng minh bạch", "Thông tin cập nhật thường xuyên"],
        sections: [
            {
                heading: "Hình thức ưu đãi",
                content: [
                    "BookStore có thể triển khai các hình thức ưu đãi như giảm giá trực tiếp, mã khuyến mãi, ưu đãi thành viên hoặc hỗ trợ phí vận chuyển.",
                    "Mỗi chương trình sẽ đi kèm thời gian áp dụng, phạm vi sản phẩm và điều kiện sử dụng riêng biệt."
                ]
            },
            {
                heading: "Điều kiện áp dụng",
                content: [
                    "Quý khách cần kiểm tra kỹ thời hạn sử dụng, giá trị đơn tối thiểu và phạm vi sản phẩm được phép áp dụng ưu đãi.",
                    "Tùy theo từng chương trình, một đơn hàng có thể bị giới hạn về số lượng hoặc loại hình khuyến mãi được sử dụng."
                ]
            },
            {
                heading: "Lưu ý khi sử dụng",
                content: [
                    "BookStore có quyền từ chối các trường hợp lạm dụng chương trình ưu đãi hoặc sử dụng sai điều kiện được công bố.",
                    "Mọi thông tin khuyến mãi hợp lệ đều được cập nhật trực tiếp trên hệ thống để khách hàng thuận tiện tra cứu."
                ]
            }
        ]
    },
    "customer-service": {
        title: "Chăm Sóc Khách Hàng",
        subtitle: "BookStore cam kết đồng hành cùng khách hàng bằng dịch vụ hỗ trợ tận tâm, phản hồi rõ ràng và xử lý đúng trọng tâm trong suốt quá trình mua sắm.",
        badge: "Hỗ trợ",
        image: AboutImage,
        facts: ["Hỗ trợ trước và sau mua", "Tiếp nhận qua điện thoại, email", "Ưu tiên phản hồi rõ ràng"],
        sections: [
            {
                heading: "Nội dung hỗ trợ",
                content: [
                    "BookStore tiếp nhận các yêu cầu liên quan đến tài khoản, đơn hàng, thanh toán, giao nhận, đổi trả và các lỗi phát sinh trên hệ thống.",
                    "Để quá trình hỗ trợ diễn ra nhanh chóng, quý khách nên cung cấp đầy đủ email, số điện thoại hoặc mã đơn hàng liên quan."
                ]
            },
            {
                heading: "Kênh tiếp nhận",
                content: [
                    "Điện thoại: 0793684680",
                    "Email: 201030277@st.hcmuaf.edu.vn"
                ]
            },
            {
                heading: "Cam kết phục vụ",
                content: [
                    "Đội ngũ hỗ trợ của BookStore sẽ nỗ lực phản hồi trong thời gian sớm nhất, dựa trên mức độ ưu tiên của từng trường hợp cụ thể.",
                    "Chúng tôi hướng đến trải nghiệm phục vụ chuyên nghiệp, rõ ràng và có trách nhiệm trong mọi tình huống phát sinh."
                ]
            }
        ]
    },
    "terms-conditions": {
        title: "Điều Khoản Và Điều Kiện",
        subtitle: "Việc sử dụng website BookStore đồng nghĩa với việc khách hàng đã đọc, hiểu và đồng ý với các nguyên tắc vận hành cơ bản của hệ thống.",
        badge: "Điều khoản",
        image: AboutImage,
        facts: ["Sử dụng đúng mục đích", "Tuân thủ quy định hệ thống", "Chủ động bảo vệ tài khoản"],
        sections: [
            {
                heading: "Quy định sử dụng",
                content: [
                    "Người dùng có trách nhiệm cung cấp thông tin chính xác khi đăng ký tài khoản, đặt hàng và sử dụng các chức năng trên website.",
                    "Mọi hành vi gây ảnh hưởng tiêu cực đến hệ thống hoặc xâm phạm quyền lợi của người dùng khác đều không được chấp nhận."
                ]
            },
            {
                heading: "Tài khoản người dùng",
                content: [
                    "Quý khách có trách nhiệm tự bảo mật thông tin đăng nhập và thông báo ngay cho BookStore khi phát hiện dấu hiệu bất thường.",
                    "BookStore có thể tạm khóa tài khoản hoặc từ chối cung cấp dịch vụ nếu phát hiện hành vi vi phạm chính sách hệ thống."
                ]
            },
            {
                heading: "Giới hạn trách nhiệm",
                content: [
                    "BookStore luôn nỗ lực bảo đảm thông tin sản phẩm, giá bán và trạng thái vận hành được cập nhật đầy đủ, chính xác.",
                    "Trong trường hợp phát sinh lỗi kỹ thuật ngoài ý muốn, hệ thống sẽ ưu tiên thông báo và xử lý theo hướng bảo vệ quyền lợi hợp lý của khách hàng."
                ]
            }
        ]
    }
};

function FooterInfoPage() {
    const { slug } = useParams<{ slug: string }>();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [slug]);

    if (!slug || !footerInfoMap[slug]) {
        return <Navigate to="/" replace />;
    }

    const page = footerInfoMap[slug];
    const iconMap = [FaCheckCircle, FaShieldAlt, FaTruck, FaHeadset, FaMapMarkerAlt];

    return (
        <div className="footer-info-page">
            <Header />

            <section className="footer-info-hero">
                <div className="footer-info-hero-overlay">
                    <span className="footer-info-badge">{page.badge}</span>
                    <h1 className="footer-info-title">{page.title}</h1>
                    <p className="footer-info-subtitle">{page.subtitle}</p>
                    <div className="footer-info-breadcrumbs">
                        <Link to="/" className="footer-info-breadcrumb-link">Trang chủ</Link>
                        <FaChevronRight className="footer-info-breadcrumb-icon" />
                        <span>Thông tin và chính sách</span>
                        <FaChevronRight className="footer-info-breadcrumb-icon" />
                        <span>{page.title}</span>
                    </div>
                </div>
            </section>

            <section className="footer-info-content container">
                <div className="footer-info-intro-card">
                    <div className="footer-info-image-wrap">
                        <img src={page.image} alt={page.title} className="footer-info-image" />
                    </div>

                    <div className="footer-info-summary">
                        <h2>Thông tin trọng tâm</h2>
                        <p>
                            BookStore xây dựng hệ thống trang thông tin và chính sách nhằm hỗ trợ khách hàng
                            tra cứu thuận tiện, mua sắm minh bạch và yên tâm hơn trong toàn bộ quá trình sử dụng dịch vụ.
                        </p>

                        <div className="footer-info-facts">
                            {page.facts.map((fact, index) => {
                                const Icon = iconMap[index % iconMap.length];
                                return (
                                    <div className="footer-info-fact" key={fact}>
                                        <span className="footer-info-fact-icon">
                                            <Icon />
                                        </span>
                                        <span>{fact}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="footer-info-sections">
                    {page.sections.map((section) => (
                        <article className="footer-info-section-card" key={section.heading}>
                            <h3>{section.heading}</h3>
                            {section.content.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </article>
                    ))}
                </div>
            </section>

            <section className="footer-info-cta">
                <div className="footer-info-cta-inner container">
                    <div>
                        <h3>Cần hỗ trợ thêm về {page.title.toLowerCase()}?</h3>
                        <p>Đội ngũ BookStore luôn sẵn sàng đồng hành và hỗ trợ quý khách trước, trong và sau quá trình mua sắm.</p>
                    </div>
                    <div className="footer-info-cta-actions">
                        <Link to="/register" className="footer-info-cta-primary">
                            Tạo tài khoản <FaArrowRight />
                        </Link>
                        <Link to="/about" className="footer-info-cta-secondary">
                            Tìm hiểu về BookStore
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default FooterInfoPage;
