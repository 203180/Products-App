package stefan.interway.demo.domain.dto;

import lombok.*;
import stefan.interway.demo.domain.enums.ProductCategory;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer quantityInStock;
    private ProductCategory category;
    private String imageBase64;
}
