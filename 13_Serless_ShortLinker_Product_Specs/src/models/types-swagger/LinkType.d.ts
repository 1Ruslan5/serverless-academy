export interface BodyCreateShortLink {
    link: "https://www.serverless.com/framework/docs/providers/aws/events/sns",
    time: "one-time"
}

export interface ResponseCreateShortLink {
    idLink: "d439dc580f0c1a6a96af9012f974adb2",
    shortLink: "https://h9wzyct905.execute-api.eu-central-1.amazonaws.com/shortLink/umh6qt",
    timeToValid: "One-time",
    message: "Successfully created short link. Or. The short link in this email already exists"
}

export interface ResponseListShortLink {
    links: Array<GetShortLink>
}

export interface GetShortLink {
    idLink: "d439dc580f0c1a6a96af9012f974adb2",
    shortLink: "https://h9wzyct905.execute-api.eu-central-1.amazonaws.com/shortLink/umh6qt",
    timeToValid: "One-time",
    requests: 0,
    active: true
}

export interface BodyDeactivateShortLink {
    link_id: "d439dc580f0c1a6a96af9012f974adb2"
}

export interface ResponseDeactivateShortLink {
    message: "Successfully deactivated short link"
}

export interface ResponseMovebyShortLink {
    headers: {
        Location: "https://h9wzyct905.execute-api.eu-central-1.amazonaws.com/shortLink/umh6qt"
    },
    body: ""
}