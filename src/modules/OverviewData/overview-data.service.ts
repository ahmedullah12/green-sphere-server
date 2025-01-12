import { Group } from '../Group/group.model';
import { Payment } from '../PaymentsCollection/payment-collection.model';
import { Post } from '../Post/post.model';
import { User } from '../User/user.model';

const getAdminOverviewData = async () => {
  const userCounts = await User.countDocuments();
  const postsCounts = await Post.countDocuments();
  const groupCounts = await Group.countDocuments();
  const paymentCounts = await Payment.countDocuments();

  const recentPosts = await Post.find({}).sort({ createdAt: -1 }).limit(5);

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);

  const postsAggregation = await Post.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ]);

  const paymentsAggregation = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ]);

  const months = Array(12)
    .fill(null)
    .map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        monthIndex: date.getMonth() + 1,
      };
    });

  const postsChartData = months.map(({ month, year, monthIndex }) => {
    const postsData = postsAggregation.find(
      (item) => item._id.year === year && item._id.month === monthIndex,
    );
    return {
      month,
      count: postsData?.count || 0,
    };
  });

  const paymentsChartData = months.map(({ month, year, monthIndex }) => {
    const paymentsData = paymentsAggregation.find(
      (item) => item._id.year === year && item._id.month === monthIndex,
    );
    return {
      month,
      count: paymentsData?.count || 0,
    };
  });

  return {
    counts: {
      userCounts,
      paymentCounts,
      postsCounts,
      groupCounts,
    },
    recentPosts,
    chartsData: {
      postsChartData,
      paymentsChartData,
    },
  };
};

export const OverviewServices = {
  getAdminOverviewData,
};
