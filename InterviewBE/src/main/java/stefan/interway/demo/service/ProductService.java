package stefan.interway.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import stefan.interway.demo.domain.dto.ProductCreateRequest;
import stefan.interway.demo.domain.dto.ProductResponse;
import stefan.interway.demo.domain.dto.ProductUpdateRequest;
import stefan.interway.demo.domain.enums.ProductCategory;

import java.util.List;

public interface ProductService {
    Page<ProductResponse> getProducts(
            Pageable pageable,
            String q,
            String category,
            Double minPrice,
            Double maxPrice,
            Integer minStock,
            Integer maxStock
    );    ProductResponse getById(Long id);
    ProductResponse create(ProductCreateRequest request);
    ProductResponse update(Long id, ProductUpdateRequest request);
    void delete(Long id);
}
