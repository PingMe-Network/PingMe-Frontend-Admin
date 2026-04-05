import axiosReelClient from "@/lib/axiosReelClient";
import type {
  Reel,
  ReelFeedResponse,
  CreateReelRequest,
  UpdateReelRequest,
  CreateCommentRequest,
  ReelComment,
  ReelCommentResponse,
  ReactionType,
  ReelDetailResponse,
  SaveResponse,
  SearchHistoryResponse,
  AdminReelResponse,
  AdminReelDetail,
  HideReelResponse,
} from "@/types/reels";
import type { ApiResponse } from "@/types/base/apiResponse";

export const reelsApi = {
  // Fetch reel feed with pagination
  getReelFeed: async (page = 0, size = 10) => {
    const response = await axiosReelClient.get<ApiResponse<ReelFeedResponse>>(
      `/reel-service/reels/feed?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  // Get reel details by ID
  getReelById: async (reelId: number) => {
    const response = await axiosReelClient.get<ApiResponse<ReelDetailResponse>>(
      `/reel-service/admin/reels/${reelId}`
    );
    return response.data.data;
  },

  // Create new reel
  createReel: async (data: CreateReelRequest) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        caption: data.caption,
        hashtags: data.hashtags,
      })
    );
    formData.append("video", data.video);

    const response = await axiosReelClient.post<ApiResponse<Reel>>(
      "/reel-service/reels",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.data;
  },

  // Update reel
  updateReel: async (reelId: number, data: UpdateReelRequest) => {
    const formData = new FormData();

    // Add caption and hashtags as JSON in "data" field
    const jsonData: { caption: string; hashtags?: string[] } = {
      caption: data.caption,
    };
    if (data.hashtags) {
      jsonData.hashtags = data.hashtags;
    }
    formData.append("data", JSON.stringify(jsonData));

    // Only add video if it's provided (optional update)
    if (data.video) {
      formData.append("video", data.video);
    }

    const response = await axiosReelClient.put<ApiResponse<Reel>>(
      `/reel-service/reels/${reelId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.data;
  },

  // Delete reel
  deleteReel: async (reelId: number) => {
    const response = await axiosReelClient.delete<ApiResponse<void>>(
      `/reel-service/reels/${reelId}`
    );
    return response.data;
  },

  // Toggle like
  toggleLike: async (reelId: number) => {
    const response = await axiosReelClient.post<ApiResponse<Reel>>(
      `/reel-service/reels/${reelId}/likes/toggle`
    );
    return response.data.data;
  },

  // Get comments for reel
  getComments: async (reelId: number, page = 0, size = 20) => {
    const response = await axiosReelClient.get<ApiResponse<ReelCommentResponse>>(
      `/reel-service/comments/${reelId}?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  // Create comment
  createComment: async (reelId: number, data: CreateCommentRequest) => {
    const response = await axiosReelClient.post<ApiResponse<ReelComment>>(
      `/reel-service/comments/${reelId}`,
      data
    );
    return response.data.data;
  },

  // Delete comment
  deleteComment: async (commentId: number) => {
    const response = await axiosReelClient.delete<ApiResponse<void>>(
      `/reel-service/comments/${commentId}`
    );
    return response.data;
  },

  // Update comment
  updateComment: async (commentId: number, content: string) => {
    const response = await axiosReelClient.put<ApiResponse<ReelComment>>(
      `/reel-service/comments/${commentId}`,
      { content }
    );
    return response.data.data;
  },

  // Search reels
  searchReels: async (query: string, page = 0, size = 10) => {
    const response = await axiosReelClient.get<ApiResponse<ReelFeedResponse>>(
      `/reel-service/reels/search?query=${query}&page=${page}&size=${size}`
    );
    return response.data.data;
  },

  // Increment view count
  incrementViewCount: async (reelId: number) => {
    const response = await axiosReelClient.post<ApiResponse<Reel>>(
      `/reel-service/reels/${reelId}/views`
    );
    return response.data.data;
  },

  // Add comment reaction
  addCommentReaction: async (commentId: number, reactionType: ReactionType) => {
    const response = await axiosReelClient.post<ApiResponse<ReelComment>>(
      `/reel-service/comments/${commentId}/reactions?type=${reactionType}`
    );
    return response.data.data;
  },

  // Remove comment reaction
  removeCommentReaction: async (commentId: number) => {
    const response = await axiosReelClient.delete<ApiResponse<ReelComment>>(
      `/reel-service/comments/${commentId}/reactions`
    );
    return response.data.data;
  },

  // Pin comment
  pinComment: async (commentId: number) => {
    const response = await axiosReelClient.post<ApiResponse<ReelComment>>(
      `/reel-service/comments/${commentId}/pin`
    );
    return response.data.data;
  },

  // Unpin comment
  unpinComment: async (commentId: number) => {
    const response = await axiosReelClient.post<ApiResponse<ReelComment>>(
      `/reel-service/comments/${commentId}/unpin`
    );
    return response.data.data;
  },

  // Get replies for a comment
  getCommentReplies: async (commentId: number, page = 0, size = 10) => {
    const response = await axiosReelClient.get<ApiResponse<ReelCommentResponse>>(
      `/reel-service/comments/${commentId}/replies?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  // Toggle save
  toggleSave: async (reelId: number) => {
    const response = await axiosReelClient.post<ApiResponse<SaveResponse>>(
      `/reel-service/reels/${reelId}/saves/toggle`
    );
    return response.data.data;
  },

  getUserLikedReels: async (page = 0, size = 20) => {
    const response = await axiosReelClient.get<ApiResponse<ReelFeedResponse>>(
      `/reel-service/reels/me/likes?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  getUserSavedReels: async (page = 0, size = 20) => {
    const response = await axiosReelClient.get<ApiResponse<ReelFeedResponse>>(
      `/reel-service/reels/me/saved?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  getUserViewedReels: async (page = 0, size = 20) => {
    const response = await axiosReelClient.get<ApiResponse<ReelFeedResponse>>(
      `/reel-service/reels/me/views?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  // Get my created reels
  getMyCreatedReels: async (page = 0, size = 10) => {
    const response = await axiosReelClient.get<ApiResponse<ReelFeedResponse>>(
      `/reel-service/reels/me/created?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  // Get search history
  getSearchHistory: async (page = 0, size = 20) => {
    const response = await axiosReelClient.get<ApiResponse<SearchHistoryResponse>>(
      `/reel-service/reels/me/search-history?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  // Delete search history item
  deleteSearchHistory: async (id: number) => {
    const response = await axiosReelClient.delete<ApiResponse<void>>(
      `/reel-service/reels/me/search-history/${id}`
    );
    return response.data;
  },

  // Delete all search history
  deleteAllSearchHistory: async () => {
    const response = await axiosReelClient.delete<ApiResponse<void>>(
      `/reel-service/reels/me/search-history`
    );
    return response.data;
  },

  // Admin: Get all reels with pagination and filter
  getAdminReels: async (
    page = 0,
    size = 10,
    caption?: string,
    userId?: number,
    minViews?: number,
    maxViews?: number,
    from?: string,
    to?: string
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (caption && caption.trim()) {
      params.append("caption", caption.trim());
    }

    if (userId) {
      params.append("userId", userId.toString());
    }

    if (minViews !== undefined && minViews >= 0) {
      params.append("minViews", minViews.toString());
    }

    if (maxViews !== undefined && maxViews >= 0) {
      params.append("maxViews", maxViews.toString());
    }

    if (from && from.trim()) {
      params.append("from", from.trim());
    }

    if (to && to.trim()) {
      params.append("to", to.trim());
    }

    const response = await axiosReelClient.get<ApiResponse<AdminReelResponse>>(
      `/reel-service/admin/reels?${params.toString()}`
    );
    return response.data.data;
  },

  // Admin: Get reel detail by ID
  getAdminReelDetail: async (reelId: number) => {
    const response = await axiosReelClient.get<ApiResponse<AdminReelDetail>>(
      `/reel-service/admin/reels/${reelId}`
    );
    return response.data.data;
  },

  // Admin: Hard delete reel
  hardDeleteAdminReel: async (reelId: number) => {
    const response = await axiosReelClient.delete<ApiResponse<void>>(
      `/reel-service/admin/reels/${reelId}/hard`
    );
    return response.data;
  },

  // Admin: Hide reel (change status to HIDDEN)
  hideAdminReel: async (reelId: number, reason?: string) => {
    const response = await axiosReelClient.patch<ApiResponse<HideReelResponse>>(
      `/reel-service/admin/reels/${reelId}/hide`,
      { reason }
    );
    return response.data.data;
  },

  // Admin: Unhide reel (change status to ACTIVE)
  unhideAdminReel: async (reelId: number) => {
    const response = await axiosReelClient.patch<ApiResponse<HideReelResponse>>(
      `/reel-service/admin/reels/${reelId}/unhide`
    );
    return response.data.data;
  },


  //LƯU Ý: API DƯỚI ĐÂY "CÓ VẺ" LÀ VÔ DỤNG
  // Get user reels
  getUserReels: async (userId: number, page = 0, size = 10) => {
    const response = await axiosReelClient.get<ApiResponse<ReelFeedResponse>>(
      `/reels/user/${userId}?page=${page}&size=${size}`
    );
    return response.data.data;
  },
};
