"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            const searchTerms = searchTerm.split(/\s+/);
            const searchQuery = searchTerms.map(term => ({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: term, $options: 'i' }
                }))
            }));
            this.modelQuery = this.modelQuery.find({ $and: searchQuery });
        }
        return this;
    }
    sort() {
        var _a;
        let sortBy = '-createdAt';
        if ((_a = this.query) === null || _a === void 0 ? void 0 : _a.sortBy) {
            sortBy = this.query.sortBy;
        }
        this.modelQuery = this.modelQuery.sort(sortBy);
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = ['searchTerm', 'page', 'limit', 'sortBy', 'fields'];
        excludeFields.forEach((e) => delete queryObj[e]);
        if (queryObj.category) {
            queryObj.category = { $regex: new RegExp(queryObj.category, 'i') };
        }
        if (queryObj.tag) {
            queryObj.tag = { $regex: new RegExp(queryObj.tag, 'i') };
        }
        this.modelQuery = this.modelQuery.find(queryObj).sort("-upvotes");
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
exports.default = QueryBuilder;
