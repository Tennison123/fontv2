// posts.post.req.ts
export interface PostPostReq {
    post_id: number;
    user_id: number;
    score: number | null;
    time: string;
    picture: string;
    first_name: string;
    last_name: string;
    icon: string;
    email: string;
    password: string;
    user_type: string;
    profile: string| null;
  }