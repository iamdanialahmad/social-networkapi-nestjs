export interface User {
  fullname: string;
  username: string;
  email: string;
  password: string;
  followers: string[];
  following: string[];
  posts: string[];
  isModerator: boolean;
  isPaid: boolean;
  createdAt: Date;
}
