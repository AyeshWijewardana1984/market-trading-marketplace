import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (val) {
          return val === null || val < this.price;
        },
        message: 'Discount price must be less than the regular price',
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true,
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image URL'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Product must have at least one image',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    ratings: {
      average: {
        type: Number,
        default: 5.0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
      index: true, // Used to query "Trending Items"
    },
    isDailyDeal: {
      type: Boolean,
      default: false,
      index: true, // Used to query "Daily Deals"
    },
    dealEndTime: {
      type: Date,
      default: null, // Exact timestamp for the live countdown timer
    },
    vendor: {
      type: String,
      default: 'Market Global Direct',
    },
    colors: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to calculate active discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.discountPrice && this.price > 0) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Text index for keyword searching across product name and description
productSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model('Product', productSchema);
