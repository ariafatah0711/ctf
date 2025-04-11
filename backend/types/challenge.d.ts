// src/types/challenge.d.ts
export type ClientChallenge = {
    id: string;
    user_id: string;
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard" | string;
    url: string;
    tags: string[];
    hint?: string | null;
    flag?: string | null;
    flag_hash?: string | null;
    reviewed?: boolean;
    accepted?: boolean;
    submitted_at?: string;
    username?: string;
};
  
export type CreateChallengeInput = {
    user_id: string;
    title: string;
    description: string;
    difficulty: string;
    url: string;
    tags?: string[];
    hint?: string | null;
    flag?: string | null;
};
  
export type UpdateChallengeInput = {
    title: string;
    description: string;
    difficulty: string;
    url: string;
    tags?: string[];
    hint?: string | null;
    flag?: string | null;
};
  
export type ChallengeResponse = {
    data?: ClientChallenge | ClientChallenge[];
    error?: string;
    success?: boolean;
    notFound?: boolean;
    total?: number;
    totalPages?: number;
    page?: number;
};  