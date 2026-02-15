package stefan.interway.demo.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import stefan.interway.demo.domain.dto.ProductCreateRequest;
import stefan.interway.demo.domain.dto.ProductResponse;
import stefan.interway.demo.domain.dto.ProductUpdateRequest;
import stefan.interway.demo.domain.entity.Product;
import stefan.interway.demo.domain.enums.ProductCategory;
import stefan.interway.demo.exception.NotFoundException;
import stefan.interway.demo.mapper.ProductMapper;
import stefan.interway.demo.repository.ProductRepository;
import stefan.interway.demo.repository.ProductSpecs;
import stefan.interway.demo.service.ProductService;

import java.util.Arrays;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    @Override
    public Page<ProductResponse> getProducts(
            Pageable pageable,
            String q,
            String category,
            Double minPrice,
            Double maxPrice,
            Integer minStock,
            Integer maxStock
    ) {
        Specification<Product> spec = ProductSpecs.build(q, category, minPrice, maxPrice, minStock, maxStock);
        return productRepository.findAll(spec, pageable).map(ProductMapper::toResponse);
    }

    @Override
    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found: " + id));
        return ProductMapper.toResponse(product);
    }

    @Override
    public ProductResponse create(ProductCreateRequest request) {
        Product product = ProductMapper.toEntity(request);
        productRepository.save(product);
        return ProductMapper.toResponse(product);
    }

    @Override
    public ProductResponse update(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found: " + id));
        ProductMapper.applyUpdate(product, request);
        productRepository.save(product);
        return ProductMapper.toResponse(product);
    }

    @Override
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new NotFoundException("Product not found:" + id);
        }
        productRepository.deleteById(id);
    }
}
