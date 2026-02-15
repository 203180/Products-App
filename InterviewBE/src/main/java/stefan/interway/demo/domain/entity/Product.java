package stefan.interway.demo.domain.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import stefan.interway.demo.domain.enums.ProductCategory;


@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer quantityInStock;

    @Enumerated(value = EnumType.STRING)
    private ProductCategory category;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "image")
    private byte[] image;
}
