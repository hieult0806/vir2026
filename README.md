# Quan Họ | Điêu Khắc Biểu Tượng

Tác phẩm điêu khắc công cộng mang tính biểu tượng dành cho Nhà hát Dân ca Quan họ Bắc Ninh - một ứng dụng sách tương tác 3D.

## 📖 Giới Thiệu

Đây là đồ án tốt nghiệp chuyên ngành Điêu khắc, trình bày dưới dạng sách tương tác 3D với hiệu ứng lật trang sử dụng CSS 3D transforms. Dự án giới thiệu hai phương án thiết kế điêu khắc công cộng cho Nhà hát Dân ca Quan họ Bắc Ninh.

## ✨ Tính Năng

- **Lật trang 3D thực tế** - Hiệu ứng lật trang mượt mà với CSS transforms
- **Nhiều phương thức điều khiển**:
  - Nút Previous/Next
  - Phím mũi tên (← →) và phím Space
  - Click/tap trực tiếp lên trang
  - Kéo chuột hoặc vuốt (swipe)
- **Zoom linh hoạt** - Thu phóng từ 50% đến 200%
  - Nút +/-
  - Ctrl + Scroll
  - Double-click để reset về 100%
- **Thiết kế responsive** - Tối ưu cho nhiều kích thước màn hình
- **Không phụ thuộc thư viện** - Pure HTML/CSS/JavaScript

## 🏗️ Cấu Trúc Dự Án

```
vir/
├── index.html              # File HTML gốc (monolithic)
├── index_new.html          # File HTML đã refactor
├── css/
│   └── styles.css         # Toàn bộ CSS (844 dòng)
├── js/
│   ├── config.js          # Cấu hình và hằng số
│   ├── state.js           # Quản lý state
│   ├── book.js            # Logic xử lý sách
│   └── main.js            # Khởi tạo và event handlers
├── data/
│   └── pages.json         # Nội dung trang (JSON)
└── README.md              # Tài liệu này
```

## 🚀 Sử Dụng

### Chạy Trực Tiếp

1. **Mở file trong trình duyệt**:
   ```
   Mở index_new.html trong Chrome/Firefox/Safari/Edge
   ```

2. **Hoặc sử dụng local server** (khuyến nghị cho việc phát triển):
   ```bash
   # Sử dụng Python
   python -m http.server 8000

   # Sử dụng Node.js
   npx http-server

   # Sau đó mở: http://localhost:8000
   ```

### Điều Khiển

| Hành động | Phương thức |
|-----------|-------------|
| Trang tiếp | Phím `→`, `Space`, hoặc nút Next |
| Trang trước | Phím `←` hoặc nút Previous |
| Zoom in | Nút `+` hoặc `Ctrl + Scroll lên` |
| Zoom out | Nút `−` hoặc `Ctrl + Scroll xuống` |
| Reset zoom | Double-click vào sách |
| Lật trang | Click vào trang hoặc kéo trái/phải |

## 🛠️ Công Nghệ

- **HTML5** - Cấu trúc semantic với ARIA labels
- **CSS3** - 3D transforms, animations, CSS variables
- **JavaScript (ES6)** - Vanilla JS, module pattern
- **Google Fonts** - Cormorant, Libre Baskerville, Instrument Sans

## 📦 Module JavaScript

### config.js
Chứa tất cả hằng số cấu hình:
- Thời gian animation
- Ngưỡng kéo thả
- Giới hạn zoom
- Z-index values

### state.js
Quản lý trạng thái ứng dụng:
- `currentPage` - Trang hiện tại (0-7)
- `zoom` - Mức zoom (0.5-2.0)
- `isAnimating` - Khóa animation

### book.js
Logic xử lý sách:
- `flipNext()` - Lật sang trang kế
- `flipPrev()` - Lật về trang trước
- `setZoom()` - Điều chỉnh zoom
- `updateDisplay()` - Cập nhật UI

### main.js
Khởi tạo ứng dụng và đăng ký event listeners

## 📱 Responsive Design

Breakpoints:
- **Desktop**: > 1400px - 1300x850px
- **Laptop**: 1150-1400px - 1100x700px
- **Tablet**: 950-1150px - 900x580px
- **Mobile**: < 950px - 700x480px

## 🎨 Thiết Kế

### Màu Sắc
- Background: Dark gradient (2C2420 → 1A1612 → 0D0B0A)
- Paper: Cream tones (FFFEF9, F5F2ED)
- Accent: Gold (B8956A) và Red (8B2323)

### Typography
- Display: Cormorant (serif)
- Body: Libre Baskerville (serif)
- UI: Instrument Sans (sans-serif)

## 📝 Nội Dung

Sách gồm 14 trang (7 trang lật):
1. **Bìa trước** - Tiêu đề đồ án
2. **Phần I** - Giới thiệu Bắc Ninh & Quan họ
3. **UNESCO Quote** - Di sản văn hóa phi vật thể
4. **Nhà hát** - Thông tin công trình
5. **Phần II** - Quá trình thực hiện
6. **Ngôn ngữ tạo hình** - Ý tưởng thiết kế
7. **Vật liệu** - Lựa chọn thép
8. **Phương án 1** - Trải Ngang (ngoài trời)
9. **Hình ảnh PA1** - Visualizations
10. **Phương án 2** - Vươn Cao (trong nhà)
11. **Hình ảnh PA2** - Visualizations
12. **Kết luận** - Tổng kết đồ án
13. **Bìa sau** - Colophon

## 🔧 Cải Tiến So Với Bản Gốc

### Trước Refactoring
- ❌ Monolithic file (1,445 dòng)
- ❌ Nội dung hardcoded trong JS
- ❌ Magic numbers khắp nơi
- ❌ Global state không tổ chức
- ❌ Thiếu documentation
- ❌ Khó maintain và mở rộng

### Sau Refactoring
- ✅ Separation of concerns (HTML/CSS/JS/Data)
- ✅ Nội dung quản lý bằng JSON
- ✅ Hằng số tập trung trong config
- ✅ State management pattern
- ✅ JSDoc comments đầy đủ
- ✅ ARIA labels cho accessibility
- ✅ Semantic HTML5
- ✅ Dễ maintain và mở rộng

## 🌐 Trình Duyệt Hỗ Trợ

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ Cần hỗ trợ CSS 3D transforms

## 📄 License

© 2025 — Đồ Án Tốt Nghiệp Điêu Khắc

## 🤝 Đóng Góp

Dự án này là đồ án tốt nghiệp cá nhân. Mọi góp ý xin gửi về tác giả.

## 📧 Liên Hệ

Đồ án tốt nghiệp - Chuyên ngành Điêu khắc - 2025

---

**Note**: Dự án này được refactor từ bản monolithic sang kiến trúc modular để dễ bảo trì và mở rộng.
