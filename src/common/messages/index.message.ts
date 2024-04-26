export enum PublicMessage {
    processFailed = "process failed",
    invalidUsername = "invalid information",
    otpSent = "code has been sent successfully",
    loggedIn = "you logged in successfully",
}

export enum notFoundMessage {
    user = "user not found",
}

export enum conflictMessage {
    user = "someone else has using this information already",
}

export enum unauthorizedMessage {
    invalid = "code has expired or invalid",
    invalidPass = "username or password is invalid",
    somethingWrong = "something wrong in authorization",
    shouldLogin = "login again",
    failed = "authorization failed",
}