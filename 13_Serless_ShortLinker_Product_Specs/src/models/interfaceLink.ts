interface Link {
    link_id: string;
    user_id: string;
    email: string
    long_link: string;
    short_link: string;
    time_to_expired: number | null;
    time: string | null;
    requestsCount: number;
    active: boolean;
}