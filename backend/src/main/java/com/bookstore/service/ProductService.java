package com.bookstore.service;

import com.bookstore.model.Category;
import com.bookstore.model.Product;
import com.bookstore.repository.CategoryRepository;
import com.bookstore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả sản phẩm (phân trang)
    public Page<Product> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findByActiveTrue(pageable);
    }

    // Tìm kiếm sản phẩm theo keyword
    public Page<Product> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.searchByKeyword(keyword, pageable);
    }

    // Gợi ý sản phẩm cho thanh tìm kiếm, ưu tiên title/author và hỗ trợ tìm không dấu
    public List<Product> getSearchSuggestions(String keyword, int limit) {
        String normalizedKeyword = normalizeKeyword(keyword);
        if (normalizedKeyword.isBlank()) {
            return List.of();
        }

        List<Product> activeProducts = productRepository.findAll().stream()
                .filter(Product::isActive)
                .toList();

        LinkedHashSet<Product> suggestions = new LinkedHashSet<>();

        collectMatchingProducts(suggestions, activeProducts, normalizedKeyword, MatchMode.TITLE_STARTS_WITH, limit);
        if (suggestions.isEmpty()) {
            collectMatchingProducts(suggestions, activeProducts, normalizedKeyword, MatchMode.TITLE_WORD_STARTS_WITH, limit);
        }
        if (suggestions.isEmpty()) {
            collectMatchingProducts(suggestions, activeProducts, normalizedKeyword, MatchMode.TITLE_CONTAINS, limit);
        }

        return new ArrayList<>(suggestions).stream()
                .limit(limit)
                .toList();
    }

    // Lấy sản phẩm theo category
    public Page<Product> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findByActiveTrueAndCategoryId(categoryId, pageable);
    }

    // Lấy sản phẩm theo category name
    public Page<Product> getProductsByCategoryName(String categoryName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findByCategoryName(categoryName, pageable);
    }

    // Chi tiết sản phẩm
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + id));
    }

    // Thêm sản phẩm (Admin)
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Sửa sản phẩm (Admin)
    public Product updateProduct(Long id, Product productData) {
        Product product = getProductById(id);
        product.setTitle(productData.getTitle());
        product.setAuthor(productData.getAuthor());
        product.setPublisher(productData.getPublisher());
        product.setPublishYear(productData.getPublishYear());
        product.setCurrentPrice(productData.getCurrentPrice());
        product.setOldPrice(productData.getOldPrice());
        product.setQuantity(productData.getQuantity());
        product.setDescription(productData.getDescription());
        product.setImage(productData.getImage());
        if (productData.getCategory() != null) {
            product.setCategory(productData.getCategory());
        }
        return productRepository.save(product);
    }

    // Xóa sản phẩm (soft delete)
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setActive(false);
        productRepository.save(product);
    }

    // Lấy tất cả danh mục
    public List<Category> getAllCategories() {
        return categoryRepository.findByActiveTrue();
    }

    // Chi tiết danh mục
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với id: " + id));
    }

    // Tạo danh mục mới (Admin)
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Sửa danh mục (Admin)
    public Category updateCategory(Long id, Category categoryData) {
        Category category = getCategoryById(id);
        category.setName(categoryData.getName());
        category.setActive(categoryData.isActive());
        if (categoryData.getParentCategory() != null) {
            category.setParentCategory(categoryData.getParentCategory());
        }
        return categoryRepository.save(category);
    }

    private void collectMatchingProducts(
            LinkedHashSet<Product> suggestions,
            List<Product> products,
            String keyword,
            MatchMode matchMode,
            int limit
    ) {
        if (suggestions.size() >= limit) {
            return;
        }

        for (Product product : products) {
            if (suggestions.size() >= limit) {
                return;
            }

            if (matchesTitle(product, keyword, matchMode)) {
                suggestions.add(product);
            }
        }
    }

    private boolean matchesTitle(Product product, String keyword, MatchMode matchMode) {
        String title = normalizeKeyword(product.getTitle());
        return switch (matchMode) {
            case TITLE_STARTS_WITH -> title.startsWith(keyword);
            case TITLE_WORD_STARTS_WITH -> containsWordStartingWith(title, keyword);
            case TITLE_CONTAINS -> title.contains(keyword);
        };
    }

    private boolean containsWordStartingWith(String text, String keyword) {
        if (text.isBlank()) {
            return false;
        }

        for (String token : text.split("\\s+")) {
            if (token.startsWith(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String normalizeKeyword(String input) {
        if (input == null) {
            return "";
        }

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .replace('đ', 'd')
                .replace('Đ', 'D')
                .toLowerCase(Locale.ROOT)
                .trim();

        return normalized.replaceAll("\\s+", " ");
    }

    private enum MatchMode {
        TITLE_STARTS_WITH,
        TITLE_WORD_STARTS_WITH,
        TITLE_CONTAINS
    }
}
