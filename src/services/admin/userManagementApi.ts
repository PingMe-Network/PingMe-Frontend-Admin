import axiosClient from "@/lib/axiosClient";
import type {
  ApiResponse,
  PageResponse,
  PaginationParams,
} from "@/types/base/apiResponse";
import type {
  AccountStatusType,
  UserSummaryResponse,
  AccountFilterType,
} from "@/types/common/userSummary";

export interface UserPaginationParams extends PaginationParams {
  search?: string;
  status?: AccountFilterType;
}

export const getAllUsers = (params: UserPaginationParams) => {
  return axiosClient.get<ApiResponse<PageResponse<UserSummaryResponse>>>(
    "/auth-service/users",
    {
      params: {
        page: params.page,
        size: params.size,
        sort: params.filter || "id,desc",
        search: params.search,
        accountStatus: params.status === "ALL" ? undefined : params.status,
      },
    },
  );
};

export const updateAccountStatus = (id: number, status: AccountStatusType) => {
  return axiosClient.post(`/auth-service/users/${id}`, {
    accountStatus: status,
  });
};
