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
}

export default QueryBuilder;