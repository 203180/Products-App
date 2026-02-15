import { categories } from '../../core/data/productCategories';

export const getCategoryLabel = (
  category?: ProductCategory | null
): string => {
  if (!category) return '';
  return categories.find(c => c.value === category)?.label ?? '';
};
