import mongoose, { FilterQuery, Query } from 'mongoose';
import { Post } from '../modules/Post/post.model';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm as string;

    if (searchTerm) {
      const searchTerms = searchTerm.split(/\s+/);
      const searchQuery = searchTerms.map(term => ({
        $or: searchableFields.map(
          (field) => ({
            [field]: { $regex: term, $options: 'i' }
          } as FilterQuery<T>)
        )
      }));

      this.modelQuery = this.modelQuery.find({ $and: searchQuery });
    }

    return this;
  }

  sort() {
    let sortBy = '-createdAt';

    if (this.query?.sortBy) {
      sortBy = this.query.sortBy as string;
    }

    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['searchTerm', 'page', 'limit', 'sortBy', 'fields'];
  
    excludeFields.forEach((e) => delete queryObj[e]);
  
    if (queryObj.category) {
      queryObj.category = { $regex: new RegExp(queryObj.category as string, 'i') };
    }
  
    if (queryObj.tag) {
      queryObj.tag = { $regex: new RegExp(queryObj.tag as string, 'i') };
    }
  
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>).sort("-upvotes");
  
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
}

export default QueryBuilder;