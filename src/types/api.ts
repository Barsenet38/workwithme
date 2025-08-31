export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UserProfileResponse extends ApiResponse<UserProfile> {}