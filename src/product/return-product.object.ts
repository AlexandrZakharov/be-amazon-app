import { Prisma } from "@prisma/client";
import { returnUserObject } from "../user/return-user.object";
import { returnReviewObject } from "../review/return-review.object";
import { returnCategoryObject } from "../category/return-category.object";

export const returnProductObject: Prisma.ProductSelect = {
  images: true,
  description: true,
  id: true,
  name: true,
  price: true,
  createdAt: true,
  slug: true,
};

export const returnProductObjectFullset: Prisma.ProductSelect = {
  ...returnProductObject,
  reviews: {
    select: returnReviewObject,
  },
  category: {
    select: returnCategoryObject,
  },
};
