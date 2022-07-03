import { Lists } from ".keystone/types";
import { User } from "./user.schema";
import { Cart } from "./cart.schema";
import { Order } from "./order.schema";
import { Payment } from "./payment.schema";
import { Category } from "./category.schema";
import { ProductReview } from "./productReview.schema";
import { Product } from "./product.schema";
import { SourceClient } from "./SourceClient.schema";
import { Subscription } from "./subscription.schema";
import { UserSubscription } from "./userSubscription.schema";
import { Service } from "./service.schema";
import { UserService } from "./userService.schema";
import { Page } from "./page";
import { Tag } from "./tag";

export const lists: Lists = {
  Cart,
  Category,
  Order,
  Payment,
  Product,
  ProductReview,
  User,
  SourceClient,
  Subscription,
  UserSubscription,
  Service,
  UserService,
  Page,
  Tag,
};
