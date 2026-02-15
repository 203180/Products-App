package stefan.interway.demo.repository;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import stefan.interway.demo.domain.entity.Product;
import stefan.interway.demo.domain.enums.ProductCategory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ProductSpecs {
    public static Specification<Product> build(
            String q,
            String category,
            Double minPrice,
            Double maxPrice,
            Integer minStock,
            Integer maxStock
    ) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();

            if (q != null && !q.isBlank()) {
                String like = "%" + q.toLowerCase() + "%";
                p.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like),
                        cb.like(cb.lower(root.get("category").as(String.class)), like)                ));
            }

            if (category != null && !category.isBlank()) {
                List<ProductCategory> matched = matchCategories(category);

                if (matched.isEmpty()) {
                    p.add(cb.disjunction());
                } else {
                    p.add(root.get("category").in(matched));
                }
            }

            if (minPrice != null) p.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            if (maxPrice != null) p.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));

            if (minStock != null) p.add(cb.greaterThanOrEqualTo(root.get("quantityInStock"), minStock));
            if (maxStock != null) p.add(cb.lessThanOrEqualTo(root.get("quantityInStock"), maxStock));

            return cb.and(p.toArray(new Predicate[0]));
        };
    }

    private static List<ProductCategory> matchCategories(String input) {
        if (input == null || input.isBlank()) return List.of();

        String q = input.trim().toUpperCase();

        return Arrays.stream(ProductCategory.values())
                .filter(c -> c.name().contains(q))
                .toList();
    }
}
