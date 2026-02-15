package stefan.interway.demo.mapper;

import stefan.interway.demo.domain.dto.ProductCreateRequest;
import stefan.interway.demo.domain.dto.ProductResponse;
import stefan.interway.demo.domain.dto.ProductUpdateRequest;
import stefan.interway.demo.domain.entity.Product;

import java.util.Base64;

public class ProductMapper {

    private ProductMapper() {

    }

    public static ProductResponse toResponse(Product product) {
        String base64Image = null;

        if (product.getImage() != null) {
            base64Image = Base64.getEncoder().encodeToString(product.getImage());
        }

        ProductResponse r = new ProductResponse();
        r.setId(product.getId());
        r.setName(product.getName());
        r.setDescription(product.getDescription());
        r.setPrice(product.getPrice());
        r.setQuantityInStock(product.getQuantityInStock());
        r.setCategory(product.getCategory());
        r.setImageBase64(base64Image);
        return r;
    }

    public static Product toEntity(ProductCreateRequest request) {
        Product p = new Product();
        p.setName(request.getName());
        p.setDescription(request.getDescription());
        p.setPrice(request.getPrice());
        p.setQuantityInStock(request.getQuantityInStock());
        p.setCategory(request.getCategory());
        if (request.getImageBase64() != null) {
            p.setImage(Base64.getDecoder().decode(request.getImageBase64()));
        }
        return p;
    }

    public static void applyUpdate(Product product, ProductUpdateRequest request) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantityInStock(request.getQuantityInStock());
        product.setCategory(request.getCategory());
        if (request.getImageBase64() != null) {
            product.setImage(Base64.getDecoder().decode(request.getImageBase64()));
        }
    }}
