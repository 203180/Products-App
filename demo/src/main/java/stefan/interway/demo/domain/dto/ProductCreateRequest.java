package stefan.interway.demo.domain.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import stefan.interway.demo.domain.enums.ProductCategory;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    @Min(0)
    private Double price;

    @NotNull
    @Min(0)
    private Integer quantityInStock;

    private ProductCategory category;

    private String imageBase64;
}
